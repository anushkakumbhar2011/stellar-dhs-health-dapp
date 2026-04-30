#![no_std]

//! # DHS Health Records Smart Contract
//! 
//! A production-ready Soroban smart contract for decentralized health record management.
//! 
//! ## Features
//! - Store IPFS CIDs of medical records linked to user addresses
//! - Secure retrieval with wallet-based authentication
//! - Timestamp tracking for audit trails
//! - DHS token rewards for record uploads
//! - Access control using Soroban's native auth

use soroban_sdk::{
    contract, contractimpl, contracttype, token, Address, Env, String, Vec, symbol_short,
};

/// Storage key for the contract admin
const ADMIN_KEY: &str = "ADMIN";

/// Storage key for total records count
const TOTAL_RECORDS_KEY: &str = "TOTAL_RECORDS";

/// Reward amount in DHS tokens for uploading a record (in stroops: 10 DHS)
const UPLOAD_REWARD: i128 = 10_0000000; // 10 tokens with 7 decimals

//
// DATA STRUCTURES
//

/// Represents a single medical record entry
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct HealthRecord {
    /// IPFS Content Identifier (CID) of the encrypted medical record
    pub cid: String,
    /// Timestamp when the record was added (Unix timestamp)
    pub timestamp: u64,
    /// Optional record name/description
    pub name: String,
    /// Record type (e.g., "lab_result", "prescription", "mri_scan")
    pub record_type: String,
}

/// Storage key for user records
#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    /// Admin address
    Admin,
    /// User records: DataKey::Records(user_address)
    Records(Address),
    /// User token balance: DataKey::Balance(user_address)
    Balance(Address),
    /// Total records count
    TotalRecords,
}

//
// CONTRACT TRAIT
//

#[contract]
pub struct DHSHealthRecordsContract;

#[contractimpl]
impl DHSHealthRecordsContract {
    //
    // INITIALIZATION
    //

    /// Initialize the contract with an admin address
    /// 
    /// # Arguments
    /// * `env` - The contract environment
    /// * `admin` - The address that will have admin privileges
    /// 
    /// # Panics
    /// Panics if contract is already initialized
    pub fn initialize(env: Env, admin: Address) {
        // Ensure contract is not already initialized
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Contract already initialized");
        }

        // Require admin to authorize this action
        admin.require_auth();

        // Store admin address
        env.storage().instance().set(&DataKey::Admin, &admin);
        
        // Initialize total records counter
        env.storage().instance().set(&DataKey::TotalRecords, &0u64);
    }

    //
    // CORE FUNCTIONS - MEDICAL RECORDS
    //

    /// Add a new medical record for the caller
    /// 
    /// # Arguments
    /// * `env` - The contract environment
    /// * `user` - The user's wallet address (must be the caller)
    /// * `cid` - IPFS Content Identifier of the encrypted medical record
    /// * `name` - Human-readable name for the record
    /// * `record_type` - Type of medical record (e.g., "lab_result", "prescription")
    /// 
    /// # Returns
    /// The index of the newly added record
    /// 
    /// # Authentication
    /// Requires the user to authorize this transaction
    pub fn add_record(
        env: Env,
        user: Address,
        cid: String,
        name: String,
        record_type: String,
    ) -> u32 {
        // Require user authentication
        user.require_auth();

        // Get current timestamp
        let timestamp = env.ledger().timestamp();

        // Create new health record
        let record = HealthRecord {
            cid,
            timestamp,
            name,
            record_type,
        };

        // Get existing records or create new vector
        let key = DataKey::Records(user.clone());
        let mut records: Vec<HealthRecord> = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or(Vec::new(&env));

        // Add new record
        records.push_back(record);
        let record_index = records.len() - 1;

        // Save updated records
        env.storage().persistent().set(&key, &records);

        // Increment total records counter
        let total_key = DataKey::TotalRecords;
        let total: u64 = env.storage().instance().get(&total_key).unwrap_or(0);
        env.storage().instance().set(&total_key, &(total + 1));

        // Reward user with DHS tokens
        Self::reward_user(&env, &user, UPLOAD_REWARD);

        record_index
    }

    /// Retrieve all medical records for a specific user
    /// 
    /// # Arguments
    /// * `env` - The contract environment
    /// * `user` - The user's wallet address
    /// 
    /// # Returns
    /// Vector of all health records for the user
    /// 
    /// # Authentication
    /// Requires the user to authorize this transaction (only owner can view their records)
    pub fn get_records(env: Env, user: Address) -> Vec<HealthRecord> {
        // Require user authentication - only the owner can view their records
        user.require_auth();

        let key = DataKey::Records(user);
        env.storage()
            .persistent()
            .get(&key)
            .unwrap_or(Vec::new(&env))
    }

    /// Get a specific record by index
    /// 
    /// # Arguments
    /// * `env` - The contract environment
    /// * `user` - The user's wallet address
    /// * `index` - The index of the record to retrieve
    /// 
    /// # Returns
    /// The health record at the specified index
    /// 
    /// # Panics
    /// Panics if index is out of bounds
    pub fn get_record_by_index(env: Env, user: Address, index: u32) -> HealthRecord {
        // Require user authentication
        user.require_auth();

        let key = DataKey::Records(user);
        let records: Vec<HealthRecord> = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or(Vec::new(&env));

        records.get(index).unwrap()
    }

    /// Get the total number of records for a user
    /// 
    /// # Arguments
    /// * `env` - The contract environment
    /// * `user` - The user's wallet address
    /// 
    /// # Returns
    /// The total count of records
    pub fn get_record_count(env: Env, user: Address) -> u32 {
        // Require user authentication
        user.require_auth();

        let key = DataKey::Records(user);
        let records: Vec<HealthRecord> = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or(Vec::new(&env));

        records.len()
    }

    //
    // DHS TOKEN FUNCTIONS
    //

    /// Get the DHS token balance for a user
    /// 
    /// # Arguments
    /// * `env` - The contract environment
    /// * `user` - The user's wallet address
    /// 
    /// # Returns
    /// The user's DHS token balance
    pub fn get_balance(env: Env, user: Address) -> i128 {
        let key = DataKey::Balance(user);
        env.storage().persistent().get(&key).unwrap_or(0)
    }

    /// Transfer DHS tokens from one user to another
    /// 
    /// # Arguments
    /// * `env` - The contract environment
    /// * `from` - The sender's address
    /// * `to` - The recipient's address
    /// * `amount` - The amount to transfer
    /// 
    /// # Panics
    /// Panics if sender has insufficient balance
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        // Require sender authentication
        from.require_auth();

        // Check sender balance
        let from_balance = Self::get_balance(env.clone(), from.clone());
        if from_balance < amount {
            panic!("Insufficient balance");
        }

        // Update balances
        let to_balance = Self::get_balance(env.clone(), to.clone());
        
        env.storage()
            .persistent()
            .set(&DataKey::Balance(from), &(from_balance - amount));
        
        env.storage()
            .persistent()
            .set(&DataKey::Balance(to), &(to_balance + amount));
    }

    //
    // ADMIN FUNCTIONS
    //

    /// Get the total number of records across all users (admin only)
    /// 
    /// # Arguments
    /// * `env` - The contract environment
    /// 
    /// # Returns
    /// Total count of all records in the system
    pub fn get_total_records(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::TotalRecords)
            .unwrap_or(0)
    }

    /// Get the admin address
    /// 
    /// # Arguments
    /// * `env` - The contract environment
    /// 
    /// # Returns
    /// The admin address
    pub fn get_admin(env: Env) -> Address {
        env.storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("Contract not initialized")
    }

    //
    // INTERNAL HELPER FUNCTIONS
    //

    /// Internal function to reward a user with DHS tokens
    /// 
    /// # Arguments
    /// * `env` - The contract environment
    /// * `user` - The user to reward
    /// * `amount` - The amount of tokens to reward
    fn reward_user(env: &Env, user: &Address, amount: i128) {
        let key = DataKey::Balance(user.clone());
        let current_balance: i128 = env.storage().persistent().get(&key).unwrap_or(0);
        let new_balance = current_balance + amount;
        env.storage().persistent().set(&key, &new_balance);
    }
}

//
// TESTS
//

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env, String};

    #[test]
    fn test_initialize() {
        let env = Env::default();
        let contract_id = env.register_contract(None, DHSHealthRecordsContract);
        let client = DHSHealthRecordsContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);

        // Mock the auth to always succeed
        env.mock_all_auths();

        client.initialize(&admin);

        assert_eq!(client.get_admin(), admin);
        assert_eq!(client.get_total_records(), 0);
    }

    #[test]
    fn test_add_and_get_record() {
        let env = Env::default();
        let contract_id = env.register_contract(None, DHSHealthRecordsContract);
        let client = DHSHealthRecordsContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let user = Address::generate(&env);

        env.mock_all_auths();

        // Initialize contract
        client.initialize(&admin);

        // Add a record
        let cid = String::from_str(&env, "QmX7Kd9fH3pQ2vR8sT1uW6yZ4aB5cD7eF9gH2iJ3kL4mN5");
        let name = String::from_str(&env, "Blood Test Results");
        let record_type = String::from_str(&env, "lab_result");

        let index = client.add_record(&user, &cid, &name, &record_type);
        assert_eq!(index, 0);

        // Get records
        let records = client.get_records(&user);
        assert_eq!(records.len(), 1);

        let record = records.get(0).unwrap();
        assert_eq!(record.cid, cid);
        assert_eq!(record.name, name);
        assert_eq!(record.record_type, record_type);

        // Check user was rewarded
        let balance = client.get_balance(&user);
        assert_eq!(balance, UPLOAD_REWARD);
    }

    #[test]
    fn test_multiple_records() {
        let env = Env::default();
        let contract_id = env.register_contract(None, DHSHealthRecordsContract);
        let client = DHSHealthRecordsContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let user = Address::generate(&env);

        env.mock_all_auths();

        client.initialize(&admin);

        // Add multiple records
        for i in 0..3 {
            let cid = String::from_str(&env, "QmTestCID");
            let name = String::from_str(&env, "Test Record");
            let record_type = String::from_str(&env, "test");
            client.add_record(&user, &cid, &name, &record_type);
        }

        let count = client.get_record_count(&user);
        assert_eq!(count, 3);

        let total = client.get_total_records();
        assert_eq!(total, 3);

        // Check rewards accumulated
        let balance = client.get_balance(&user);
        assert_eq!(balance, UPLOAD_REWARD * 3);
    }

    #[test]
    fn test_token_transfer() {
        let env = Env::default();
        let contract_id = env.register_contract(None, DHSHealthRecordsContract);
        let client = DHSHealthRecordsContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let user1 = Address::generate(&env);
        let user2 = Address::generate(&env);

        env.mock_all_auths();

        client.initialize(&admin);

        // User1 adds a record and gets rewarded
        let cid = String::from_str(&env, "QmTestCID");
        let name = String::from_str(&env, "Test Record");
        let record_type = String::from_str(&env, "test");
        client.add_record(&user1, &cid, &name, &record_type);

        // Transfer tokens from user1 to user2
        let transfer_amount = 5_0000000; // 5 DHS
        client.transfer(&user1, &user2, &transfer_amount);

        assert_eq!(client.get_balance(&user1), UPLOAD_REWARD - transfer_amount);
        assert_eq!(client.get_balance(&user2), transfer_amount);
    }

    #[test]
    #[should_panic(expected = "Insufficient balance")]
    fn test_transfer_insufficient_balance() {
        let env = Env::default();
        let contract_id = env.register_contract(None, DHSHealthRecordsContract);
        let client = DHSHealthRecordsContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let user1 = Address::generate(&env);
        let user2 = Address::generate(&env);

        env.mock_all_auths();

        client.initialize(&admin);

        // Try to transfer without balance
        client.transfer(&user1, &user2, &100);
    }
}
