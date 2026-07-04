#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, BytesN, Env, String};

#[test]
fn test_initialization() {
    let env = Env::default();
    let admin = Address::generate(&env);
    
    let contract_id = env.register_contract(None, LuminaStakeContract);
    let client = LuminaStakeContractClient::new(&env, &contract_id);
    
    client.init(&admin);
}

#[test]
fn test_bounty_creation_and_evidence() {
    let env = Env::default();
    let admin = Address::generate(&env);
    let contract_id = env.register_contract(None, LuminaStakeContract);
    let client = LuminaStakeContractClient::new(&env, &contract_id);
    
    client.init(&admin);
    
    let target_hash = BytesN::from_array(&env, &[0; 32]);
    
    // Mock authorization for the admin
    env.mock_all_auths();
    
    // Admin creates a bounty
    client.initialize_bounty(&admin, &1u64, &target_hash, &100_000i128);
    
    // Whistleblower submits ZK proof
    let nullifier = BytesN::from_array(&env, &[1; 32]);
    let ipfs_hash = String::from_slice(&env, "QmTestHash");
    let mock_proof = BytesN::from_array(&env, &[2; 64]);
    
    client.submit_evidence(&1u64, &nullifier, &ipfs_hash, &mock_proof);
    
    // Sybil Protection is inherently tested if we try to submit the same nullifier again.
}
