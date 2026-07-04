use soroban_sdk::{contracttype, BytesN, String};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum BountyStatus {
    Open = 0,
    Reviewing = 1,
    Settled = 2,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Bounty {
    pub id: u64,
    pub target_hash: BytesN<32>,
    pub amount: i128,
    pub status: BountyStatus,
}

#[contracttype]
#[derive(Clone)]
pub struct Evidence {
    pub ipfs_hash: String,
    pub credential_nullifier: BytesN<32>,
}
