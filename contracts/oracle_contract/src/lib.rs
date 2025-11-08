#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol, symbol_short};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    FloorPrice,
    LastUpdate,
    Updater(Address),
}

#[contract]
pub struct OracleContract;

#[contractimpl]
impl OracleContract {
    /// Initialize the oracle with an admin and initial price
    pub fn initialize(env: Env, admin: Address, initial_price: i128) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        
        admin.require_auth();
        
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::FloorPrice, &initial_price);
        env.storage().instance().set(&DataKey::LastUpdate, &env.ledger().timestamp());
        
        // Admin is automatically an authorized updater
        env.storage().instance().set(&DataKey::Updater(admin.clone()), &true);
        
        env.events().publish(
            (symbol_short!("init"), admin),
            initial_price
        );
    }

    /// Update the floor price (only authorized updaters)
    pub fn update_price(env: Env, updater: Address, new_price: i128) {
        updater.require_auth();
        
        let is_authorized: bool = env.storage()
            .instance()
            .get(&DataKey::Updater(updater.clone()))
            .unwrap_or(false);
        
        if !is_authorized {
            panic!("Not authorized to update price");
        }
        
        if new_price <= 0 {
            panic!("Price must be positive");
        }
        
        env.storage().instance().set(&DataKey::FloorPrice, &new_price);
        env.storage().instance().set(&DataKey::LastUpdate, &env.ledger().timestamp());
        
        env.events().publish(
            (symbol_short!("update"), updater),
            new_price
        );
    }

    /// Get the current floor price
    pub fn get_price(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&DataKey::FloorPrice)
            .unwrap_or(0)
    }

    /// Get the timestamp of the last price update
    pub fn get_last_update(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::LastUpdate)
            .unwrap_or(0)
    }

    /// Add an authorized price updater (admin only)
    pub fn add_updater(env: Env, admin: Address, updater: Address) {
        admin.require_auth();
        
        let stored_admin: Address = env.storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic!("Not initialized"));
        
        if stored_admin != admin {
            panic!("Not admin");
        }
        
        env.storage().instance().set(&DataKey::Updater(updater.clone()), &true);
        
        env.events().publish(
            (symbol_short!("add_upd"), admin),
            updater
        );
    }

    /// Remove an authorized price updater (admin only)
    pub fn remove_updater(env: Env, admin: Address, updater: Address) {
        admin.require_auth();
        
        let stored_admin: Address = env.storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic!("Not initialized"));
        
        if stored_admin != admin {
            panic!("Not admin");
        }
        
        env.storage().instance().remove(&DataKey::Updater(updater.clone()));
        
        env.events().publish(
            (symbol_short!("rm_upd"), admin),
            updater
        );
    }

    /// Check if an address is an authorized updater
    pub fn is_updater(env: Env, address: Address) -> bool {
        env.storage()
            .instance()
            .get(&DataKey::Updater(address))
            .unwrap_or(false)
    }

    /// Get the admin address
    pub fn get_admin(env: Env) -> Address {
        env.storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic!("Not initialized"))
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_initialize() {
        let env = Env::default();
        let contract_id = env.register_contract(None, OracleContract);
        let client = OracleContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let initial_price = 1_000_0000000; // 1000 XLM in stroops
        
        env.mock_all_auths();
        client.initialize(&admin, &initial_price);
        
        assert_eq!(client.get_price(), initial_price);
        assert_eq!(client.get_admin(), admin);
        assert!(client.is_updater(&admin));
    }

    #[test]
    fn test_update_price() {
        let env = Env::default();
        let contract_id = env.register_contract(None, OracleContract);
        let client = OracleContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let initial_price = 1_000_0000000;
        
        env.mock_all_auths();
        client.initialize(&admin, &initial_price);
        
        let new_price = 1_500_0000000;
        client.update_price(&admin, &new_price);
        
        assert_eq!(client.get_price(), new_price);
    }

    #[test]
    fn test_add_updater() {
        let env = Env::default();
        let contract_id = env.register_contract(None, OracleContract);
        let client = OracleContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let updater = Address::generate(&env);
        let initial_price = 1_000_0000000;
        
        env.mock_all_auths();
        client.initialize(&admin, &initial_price);
        
        assert!(!client.is_updater(&updater));
        
        client.add_updater(&admin, &updater);
        
        assert!(client.is_updater(&updater));
        
        let new_price = 1_200_0000000;
        client.update_price(&updater, &new_price);
        
        assert_eq!(client.get_price(), new_price);
    }

    #[test]
    #[should_panic(expected = "Not authorized to update price")]
    fn test_unauthorized_update() {
        let env = Env::default();
        let contract_id = env.register_contract(None, OracleContract);
        let client = OracleContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let unauthorized = Address::generate(&env);
        let initial_price = 1_000_0000000;
        
        env.mock_all_auths();
        client.initialize(&admin, &initial_price);
        
        client.update_price(&unauthorized, &2_000_0000000);
    }
}
