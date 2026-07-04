use aiken/hash.{Blake2b_224, Hash}
use aiken/list
use aiken/transaction.{ScriptContext}
use aiken/transaction/credential.{VerificationKey}

// The datum stores the Bounty ID.
type EscrowDatum {
  bounty_id: Int,
}

// The action to perform.
type EscrowRedeemer {
  ReleaseFunds
}

// The validator is parameterized by the Relayer's public key hash.
// Since the Zero-Knowledge proofs (Midnight Compact) are verified off-chain by the Relayer,
// the Plutus contract simply verifies that the trusted Relayer has authorized the release.
validator(relayer_pub_key: Hash<Blake2b_224, VerificationKey>) {
  fn spend(
    _datum: EscrowDatum,
    _redeemer: EscrowRedeemer,
    ctx: ScriptContext,
  ) -> Bool {
    let ScriptContext { transaction, .. } = ctx

    // Ensure the trusted Relayer signed the transaction
    list.has(transaction.extra_signatories, relayer_pub_key)
  }
}
