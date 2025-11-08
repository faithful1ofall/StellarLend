#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Symbol, Vec, symbol_short};

#[derive(Clone)]
#[contracttype]
pub struct NFTMetadata {
    pub name: String,
    pub uri: String,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Owner(u32),          // token_id -> owner
    Metadata(u32),       // token_id -> metadata
    Approved(u32),       // token_id -> approved address
    NextTokenId,         // counter
    Admin,               // admin address
}

#[contract]
pub struct NFTContract;

#[contractimpl]
impl NFTContract {
    /// Initialize the NFT contract
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::NextTokenId, &0u32);
    }

    /// Mint a new NFT
    pub fn mint(env: Env, to: Address, name: String, uri: String) -> u32 {
        to.require_auth();
        
        let token_id: u32 = env.storage()
            .instance()
            .get(&DataKey::NextTokenId)
            .unwrap_or(0);
        
        let metadata = NFTMetadata { name, uri };
        
        env.storage().instance().set(&DataKey::Owner(token_id), &to);
        env.storage().instance().set(&DataKey::Metadata(token_id), &metadata);
        env.storage().instance().set(&DataKey::NextTokenId, &(token_id + 1));
        
        env.events().publish(
            (symbol_short!("mint"), to.clone()),
            token_id
        );
        
        token_id
    }

    /// Transfer NFT from one address to another
    pub fn transfer(env: Env, from: Address, to: Address, token_id: u32) {
        let owner: Address = env.storage()
            .instance()
            .get(&DataKey::Owner(token_id))
            .unwrap_or_else(|| panic!("Token does not exist"));
        
        if owner != from {
            panic!("Not the owner");
        }
        
        // Check if caller is owner or approved
        let approved: Option<Address> = env.storage()
            .instance()
            .get(&DataKey::Approved(token_id));
        
        let caller = if let Some(approved_addr) = approved {
            if approved_addr == env.current_contract_address() {
                // Contract itself is approved (for vault operations)
                approved_addr
            } else {
                from.require_auth();
                from.clone()
            }
        } else {
            from.require_auth();
            from.clone()
        };
        
        env.storage().instance().set(&DataKey::Owner(token_id), &to);
        env.storage().instance().remove(&DataKey::Approved(token_id));
        
        env.events().publish(
            (symbol_short!("transfer"), from, to.clone()),
            token_id
        );
    }

    /// Approve an address to transfer a specific NFT
    pub fn approve(env: Env, owner: Address, spender: Address, token_id: u32) {
        owner.require_auth();
        
        let current_owner: Address = env.storage()
            .instance()
            .get(&DataKey::Owner(token_id))
            .unwrap_or_else(|| panic!("Token does not exist"));
        
        if current_owner != owner {
            panic!("Not the owner");
        }
        
        env.storage().instance().set(&DataKey::Approved(token_id), &spender);
        
        env.events().publish(
            (symbol_short!("approve"), owner, spender.clone()),
            token_id
        );
    }

    /// Get the owner of an NFT
    pub fn owner_of(env: Env, token_id: u32) -> Address {
        env.storage()
            .instance()
            .get(&DataKey::Owner(token_id))
            .unwrap_or_else(|| panic!("Token does not exist"))
    }

    /// Get NFT metadata
    pub fn get_metadata(env: Env, token_id: u32) -> NFTMetadata {
        env.storage()
            .instance()
            .get(&DataKey::Metadata(token_id))
            .unwrap_or_else(|| panic!("Token does not exist"))
    }

    /// Get approved address for a token
    pub fn get_approved(env: Env, token_id: u32) -> Option<Address> {
        env.storage().instance().get(&DataKey::Approved(token_id))
    }

    /// Get total supply
    pub fn total_supply(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&DataKey::NextTokenId)
            .unwrap_or(0)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_mint() {
        let env = Env::default();
        let contract_id = env.register_contract(None, NFTContract);
        let client = NFTContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let user = Address::generate(&env);
        
        client.initialize(&admin);
        
        env.mock_all_auths();
        let token_id = client.mint(&user, &String::from_str(&env, "Test NFT"), &String::from_str(&env, "ipfs://test"));
        
        assert_eq!(token_id, 0);
        assert_eq!(client.owner_of(&token_id), user);
        assert_eq!(client.total_supply(), 1);
    }

    #[test]
    fn test_transfer() {
        let env = Env::default();
        let contract_id = env.register_contract(None, NFTContract);
        let client = NFTContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let user1 = Address::generate(&env);
        let user2 = Address::generate(&env);
        
        client.initialize(&admin);
        
        env.mock_all_auths();
        let token_id = client.mint(&user1, &String::from_str(&env, "Test NFT"), &String::from_str(&env, "ipfs://test"));
        
        client.transfer(&user1, &user2, &token_id);
        
        assert_eq!(client.owner_of(&token_id), user2);
    }

    #[test]
    fn test_approve() {
        let env = Env::default();
        let contract_id = env.register_contract(None, NFTContract);
        let client = NFTContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let user = Address::generate(&env);
        let spender = Address::generate(&env);
        
        client.initialize(&admin);
        
        env.mock_all_auths();
        let token_id = client.mint(&user, &String::from_str(&env, "Test NFT"), &String::from_str(&env, "ipfs://test"));
        
        client.approve(&user, &spender, &token_id);
        
        assert_eq!(client.get_approved(&token_id), Some(spender));
    }
}
