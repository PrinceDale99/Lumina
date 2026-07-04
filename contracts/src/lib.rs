#![no_std]

mod errors;
mod bounty;
mod auth;

use soroban_sdk::{contract, contractimpl, contracttype, Address, BytesN, Env, String};
use errors::Error;
use bounty::{Bounty, BountyStatus, Evidence};

#[contracttype]
pub enum DataKey {
    Admin,
    Bounty(u64),
    Evidence(u64),
    Nullifier(BytesN<32>),
    ArbiterNullifier(u64, BytesN<32>),
}

#[contract]
pub struct LuminaContract;

#[contractimpl]
impl LuminaContract {
    /// Initialize the overall contract with an Admin (Regulator/DAO)
    pub fn init(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    /// Initialize a new bounty
    pub fn initialize_bounty(
        env: Env,
        caller: Address,
        bounty_id: u64,
        target_hash: BytesN<32>,
        amount: i128,
        required_approvals: u32,
    ) -> Result<(), Error> {
        caller.require_auth();
        
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        if caller != admin {
            return Err(Error::NotAuthorized);
        }

        let bounty = Bounty {
            id: bounty_id,
            target_hash,
            amount,
            status: BountyStatus::Open,
            required_approvals,
            approvals: 0,
        };

        env.storage().persistent().set(&DataKey::Bounty(bounty_id), &bounty);
        Ok(())
    }

    /// Submit Midnight ZK proof and encrypted evidence
    pub fn submit_evidence(
        env: Env,
        bounty_id: u64,
        credential_nullifier: BytesN<32>,
        ipfs_hash: String,
        _zk_proof_payload: BytesN<64>, // Mock representation of the SNARK proof
    ) -> Result<(), Error> {
        let mut bounty: Bounty = env.storage().persistent().get(&DataKey::Bounty(bounty_id))
            .ok_or(Error::BountyNotFound)?;
            
        // Check Sybil/Nullifier
        if env.storage().persistent().has(&DataKey::Nullifier(credential_nullifier.clone())) {
            return Err(Error::SybilDetected);
        }

        // Mock: Cryptographically verify zk_proof_payload against Midnight Verification Key
        let is_valid_proof = true; 
        if !is_valid_proof {
            return Err(Error::InvalidProof);
        }

        let evidence = Evidence {
            ipfs_hash,
            credential_nullifier: credential_nullifier.clone(),
        };

        env.storage().persistent().set(&DataKey::Evidence(bounty_id), &evidence);
        env.storage().persistent().set(&DataKey::Nullifier(credential_nullifier), &true);
        
        bounty.status = BountyStatus::Reviewing;
        env.storage().persistent().set(&DataKey::Bounty(bounty_id), &bounty);

        Ok(())
    }

    /// Anonymous Arbiter Voting (ZK-Proof Governance)
    pub fn vote_payout(
        env: Env, 
        bounty_id: u64,
        arbiter_nullifier: BytesN<32>,
        vote_yes: bool,
        _zk_proof: BytesN<64>,
    ) -> Result<(), Error> {
        let mut bounty: Bounty = env.storage().persistent().get(&DataKey::Bounty(bounty_id))
            .ok_or(Error::BountyNotFound)?;

        if bounty.status != BountyStatus::Reviewing {
            return Err(Error::BountyNotFound); // Replace with appropriate error in production
        }

        let nullifier_key = DataKey::ArbiterNullifier(bounty_id, arbiter_nullifier.clone());
        if env.storage().persistent().has(&nullifier_key) {
            return Err(Error::SybilDetected); // Double voting
        }

        // Mock: Cryptographically verify ZK proof that the caller is an authorized Arbiter
        // and that they have not voted before using this nullifier.
        let is_valid_proof = true; 
        if !is_valid_proof {
            return Err(Error::InvalidProof);
        }

        env.storage().persistent().set(&nullifier_key, &true);

        if vote_yes {
            bounty.approvals += 1;
            if bounty.approvals >= bounty.required_approvals {
                bounty.status = BountyStatus::Settled;
            }
            env.storage().persistent().set(&DataKey::Bounty(bounty_id), &bounty);
        }

        Ok(())
    }

    /// Disburse anonymously via CAP-0071-01 to break the deterministic link
    pub fn disburse_anonymously(
        env: Env,
        bounty_id: u64,
        transient_account: Address,
        destination: Address,
    ) -> Result<(), Error> {
        let bounty: Bounty = env.storage().persistent().get(&DataKey::Bounty(bounty_id))
            .ok_or(Error::BountyNotFound)?;

        if bounty.status != BountyStatus::Settled {
            return Err(Error::BountyNotSettled);
        }

        // Delegate execution to the CAP-0071 helper
        auth::execute_delegated_disbursement(&env, transient_account, destination, bounty.amount);

        // Delete the bounty to clean up state and mark as paid
        env.storage().persistent().remove(&DataKey::Bounty(bounty_id));

        Ok(())
    }
}

#[cfg(test)]
mod test;