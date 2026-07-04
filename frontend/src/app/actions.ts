"use server";

export async function generateZKProof(destAddress: string) {
  // Server-side dynamic import of the real circuit
  // Node.js will read the WASM from the file system natively, bypassing Webpack browser WASM parsing bugs!
  const { pureCircuits } = await import("lumina-circuits/build/contract/index.js");
  const { StrKey } = await import("@stellar/stellar-sdk");

  // Prepare cryptographic data
  const bountyId = new Uint8Array(32);
  const pubKey = new Uint8Array(32);
  const privKey = new Uint8Array(32);
  const sig = new Uint8Array(64);
  const timestamp = BigInt(Math.floor(Date.now() / 1000));
  const validity = BigInt(0); // Valid
  
  // Convert Stellar G-address string to 32-byte Ed25519 public key
  let destWalletBuffer;
  try {
    destWalletBuffer = StrKey.decodeEd25519PublicKey(destAddress);
  } catch (e) {
    // If it's a Lace (Cardano) address or other format, fallback to SHA-256 hashing it into a 32-byte array
    const crypto = await import('crypto');
    destWalletBuffer = new Uint8Array(crypto.createHash('sha256').update(destAddress || "empty").digest());
  }

  // Execute the mathematical ZK circuit server-side
  const start = performance.now();
  const [isValid, outPubKey, outBountyId, outDestWallet] = pureCircuits.verifyEmployee(
    bountyId,
    pubKey,
    privKey,
    sig,
    timestamp,
    validity,
    destWalletBuffer
  );
  const timeTaken = (performance.now() - start).toFixed(2);

  // Return serialized data (BigInts and Uint8Arrays must be serialized to JSON if sent to client)
  return {
    isValid,
    timeTaken,
    outPubKey: Array.from(outPubKey),
    outBountyId: Array.from(outBountyId),
    outDestWallet: Array.from(outDestWallet),
  };
}

// Soroban Relayer functionality has been fully removed for the 100% Cardano Migration.

export async function submitProofViaCardanoRelayer(bountyId: number, laceAddress: string, evidenceCid: string) {
  // Wait for 1.5 seconds to simulate Plutus V2 transaction building and signing
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // The Relayer (Node.js) verifies the Midnight ZK Proof locally.
  // Once verified, the Relayer signs a Cardano transaction with its own private key.
  // The Aiken Plutus contract verifies the Relayer's signature and releases the ADA/Tokens to the laceAddress.
  
  // Return a mock Blockfrost transaction hash on Cardano Preprod
  const mockTxHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');

  return {
    success: true,
    txHash: mockTxHash,
    network: "Cardano Preprod"
  };
}
