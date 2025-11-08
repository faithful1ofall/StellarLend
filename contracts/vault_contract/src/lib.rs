#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, token, vec, Address, Env, IntoVal, Symbol, symbol_short,
};

#[derive(Clone)]
#[contracttype]
pub struct Loan {
    pub borrower: Address,
    pub nft_id: u32,
    pub borrowed_amount: i128,
    pub collateral_value: i128,
    pub timestamp: u64,
    pub is_active: bool,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    NftContract,
    OracleContract,
    Loan(u32),        // nft_id -> Loan
    LtvRatio,         // Loan-to-value ratio (70 = 70%)
    LiquidationThreshold, // Liquidation threshold (80 = 80%)
}

const LTV_RATIO: u32 = 70;  // 70% LTV
const LIQUIDATION_THRESHOLD: u32 = 80;  // 80% collateralization required

#[contract]
pub struct VaultContract;

#[contractimpl]
impl VaultContract {
    /// Initialize the vault contract
    pub fn initialize(
        env: Env,
        admin: Address,
        nft_contract: Address,
        oracle_contract: Address,
    ) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        
        admin.require_auth();
        
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::NftContract, &nft_contract);
        env.storage().instance().set(&DataKey::OracleContract, &oracle_contract);
        env.storage().instance().set(&DataKey::LtvRatio, &LTV_RATIO);
        env.storage().instance().set(&DataKey::LiquidationThreshold, &LIQUIDATION_THRESHOLD);
        
        env.events().publish(
            (symbol_short!("init"), admin),
            (nft_contract, oracle_contract)
        );
    }

    /// Deposit NFT as collateral and borrow XLM
    pub fn deposit_and_borrow(env: Env, borrower: Address, nft_id: u32) -> i128 {
        borrower.require_auth();
        
        // Check if NFT is already used as collateral
        if env.storage().instance().has(&DataKey::Loan(nft_id)) {
            let loan: Loan = env.storage().instance().get(&DataKey::Loan(nft_id)).unwrap();
            if loan.is_active {
                panic!("NFT already used as collateral");
            }
        }
        
        let nft_contract: Address = env.storage()
            .instance()
            .get(&DataKey::NftContract)
            .unwrap();
        
        let oracle_contract: Address = env.storage()
            .instance()
            .get(&DataKey::OracleContract)
            .unwrap();
        
        // Get floor price from oracle
        let floor_price: i128 = env.invoke_contract(
            &oracle_contract,
            &Symbol::new(&env, "get_price"),
            vec![&env],
        );
        
        // Verify NFT ownership
        let owner: Address = env.invoke_contract(
            &nft_contract,
            &Symbol::new(&env, "owner_of"),
            vec![&env, nft_id.into_val(&env)],
        );
        
        if owner != borrower {
            panic!("Not the NFT owner");
        }
        
        // Transfer NFT to vault
        let _: () = env.invoke_contract(
            &nft_contract,
            &Symbol::new(&env, "transfer"),
            vec![&env, borrower.clone().into_val(&env), env.current_contract_address().into_val(&env), nft_id.into_val(&env)],
        );
        
        if floor_price <= 0 {
            panic!("Invalid floor price");
        }
        
        // Calculate borrow amount (70% LTV)
        let ltv_ratio: u32 = env.storage()
            .instance()
            .get(&DataKey::LtvRatio)
            .unwrap_or(LTV_RATIO);
        
        let borrow_amount = (floor_price * ltv_ratio as i128) / 100;
        
        // Create loan record
        let loan = Loan {
            borrower: borrower.clone(),
            nft_id,
            borrowed_amount: borrow_amount,
            collateral_value: floor_price,
            timestamp: env.ledger().timestamp(),
            is_active: true,
        };
        
        env.storage().instance().set(&DataKey::Loan(nft_id), &loan);
        
        // Transfer XLM to borrower
        let native_token = token::Client::new(&env, &env.current_contract_address());
        native_token.transfer(&env.current_contract_address(), &borrower, &borrow_amount);
        
        env.events().publish(
            (symbol_short!("borrow"), borrower),
            (nft_id, borrow_amount)
        );
        
        borrow_amount
    }

    /// Repay loan and reclaim NFT
    pub fn repay(env: Env, borrower: Address, nft_id: u32) {
        borrower.require_auth();
        
        let loan: Loan = env.storage()
            .instance()
            .get(&DataKey::Loan(nft_id))
            .unwrap_or_else(|| panic!("Loan does not exist"));
        
        if !loan.is_active {
            panic!("Loan is not active");
        }
        
        if loan.borrower != borrower {
            panic!("Not the borrower");
        }
        
        // Transfer XLM from borrower to vault
        let native_token = token::Client::new(&env, &env.current_contract_address());
        native_token.transfer(&borrower, &env.current_contract_address(), &loan.borrowed_amount);
        
        // Transfer NFT back to borrower
        let nft_contract: Address = env.storage()
            .instance()
            .get(&DataKey::NftContract)
            .unwrap();
        
        let _: () = env.invoke_contract(
            &nft_contract,
            &Symbol::new(&env, "transfer"),
            vec![&env, env.current_contract_address().into_val(&env), borrower.clone().into_val(&env), nft_id.into_val(&env)],
        );
        
        // Mark loan as inactive
        let mut updated_loan = loan.clone();
        updated_loan.is_active = false;
        env.storage().instance().set(&DataKey::Loan(nft_id), &updated_loan);
        
        env.events().publish(
            (symbol_short!("repay"), borrower),
            nft_id
        );
    }

    /// Liquidate an undercollateralized loan
    pub fn liquidate(env: Env, liquidator: Address, nft_id: u32) {
        liquidator.require_auth();
        
        let loan: Loan = env.storage()
            .instance()
            .get(&DataKey::Loan(nft_id))
            .unwrap_or_else(|| panic!("Loan does not exist"));
        
        if !loan.is_active {
            panic!("Loan is not active");
        }
        
        // Get current floor price
        let oracle_contract: Address = env.storage()
            .instance()
            .get(&DataKey::OracleContract)
            .unwrap();
        
        let current_price: i128 = env.invoke_contract(
            &oracle_contract,
            &Symbol::new(&env, "get_price"),
            vec![&env],
        );
        
        // Check if loan is undercollateralized
        let liquidation_threshold: u32 = env.storage()
            .instance()
            .get(&DataKey::LiquidationThreshold)
            .unwrap_or(LIQUIDATION_THRESHOLD);
        
        let required_collateral = (loan.borrowed_amount * 100) / liquidation_threshold as i128;
        
        if current_price >= required_collateral {
            panic!("Loan is not undercollateralized");
        }
        
        // Transfer NFT to liquidator
        let nft_contract: Address = env.storage()
            .instance()
            .get(&DataKey::NftContract)
            .unwrap();
        
        let _: () = env.invoke_contract(
            &nft_contract,
            &Symbol::new(&env, "transfer"),
            vec![&env, env.current_contract_address().into_val(&env), liquidator.clone().into_val(&env), nft_id.into_val(&env)],
        );
        
        // Mark loan as inactive
        let mut updated_loan = loan.clone();
        updated_loan.is_active = false;
        env.storage().instance().set(&DataKey::Loan(nft_id), &updated_loan);
        
        env.events().publish(
            (symbol_short!("liquidate"), liquidator),
            (nft_id, loan.borrower)
        );
    }

    /// Get loan details
    pub fn get_loan(env: Env, nft_id: u32) -> Option<Loan> {
        env.storage().instance().get(&DataKey::Loan(nft_id))
    }

    /// Calculate maximum borrow amount for an NFT
    pub fn calculate_borrow_amount(env: Env, _nft_id: u32) -> i128 {
        let oracle_contract: Address = env.storage()
            .instance()
            .get(&DataKey::OracleContract)
            .unwrap();
        
        let floor_price: i128 = env.invoke_contract(
            &oracle_contract,
            &Symbol::new(&env, "get_price"),
            vec![&env],
        );
        
        let ltv_ratio: u32 = env.storage()
            .instance()
            .get(&DataKey::LtvRatio)
            .unwrap_or(LTV_RATIO);
        
        (floor_price * ltv_ratio as i128) / 100
    }

    /// Check if a loan can be liquidated
    pub fn is_liquidatable(env: Env, nft_id: u32) -> bool {
        let loan: Option<Loan> = env.storage().instance().get(&DataKey::Loan(nft_id));
        
        if loan.is_none() {
            return false;
        }
        
        let loan = loan.unwrap();
        
        if !loan.is_active {
            return false;
        }
        
        let oracle_contract: Address = env.storage()
            .instance()
            .get(&DataKey::OracleContract)
            .unwrap();
        
        let current_price: i128 = env.invoke_contract(
            &oracle_contract,
            &Symbol::new(&env, "get_price"),
            vec![&env],
        );
        
        let liquidation_threshold: u32 = env.storage()
            .instance()
            .get(&DataKey::LiquidationThreshold)
            .unwrap_or(LIQUIDATION_THRESHOLD);
        
        let required_collateral = (loan.borrowed_amount * 100) / liquidation_threshold as i128;
        
        current_price < required_collateral
    }

    /// Get vault configuration
    pub fn get_config(env: Env) -> (Address, Address, u32, u32) {
        let nft_contract: Address = env.storage()
            .instance()
            .get(&DataKey::NftContract)
            .unwrap();
        
        let oracle_contract: Address = env.storage()
            .instance()
            .get(&DataKey::OracleContract)
            .unwrap();
        
        let ltv_ratio: u32 = env.storage()
            .instance()
            .get(&DataKey::LtvRatio)
            .unwrap_or(LTV_RATIO);
        
        let liquidation_threshold: u32 = env.storage()
            .instance()
            .get(&DataKey::LiquidationThreshold)
            .unwrap_or(LIQUIDATION_THRESHOLD);
        
        (nft_contract, oracle_contract, ltv_ratio, liquidation_threshold)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_initialize() {
        let env = Env::default();
        let contract_id = env.register_contract(None, VaultContract);
        let client = VaultContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let nft_contract = Address::generate(&env);
        let oracle_contract = Address::generate(&env);
        
        env.mock_all_auths();
        client.initialize(&admin, &nft_contract, &oracle_contract);
        
        let (nft, oracle, ltv, liq) = client.get_config();
        assert_eq!(nft, nft_contract);
        assert_eq!(oracle, oracle_contract);
        assert_eq!(ltv, 70);
        assert_eq!(liq, 80);
    }
}
