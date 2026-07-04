use soroban_sdk::contracterror;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    AlreadyInitialized = 1,
    NotAuthorized = 2,
    BountyNotFound = 3,
    BountyNotSettled = 4,
    InvalidProof = 5,
    SybilDetected = 6,
}
