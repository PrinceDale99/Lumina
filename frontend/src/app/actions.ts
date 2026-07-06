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
    // If it's a Lace (Midnight) address or other format, fallback to SHA-256 hashing it into a 32-byte array
    const crypto = await import('crypto');
    destWalletBuffer = new Uint8Array(crypto.createHash('sha256').update(destAddress || "empty").digest());
  }

  // Execute the mathematical ZK circuit server-side
  const start = performance.now();
  const [isValid, outPubKey, outBountyId, outDestWallet] = (pureCircuits as any).verifyEmployee(
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

// Soroban Relayer functionality has been fully removed for the 100% Midnight Migration.

export async function submitProofViaMidnightRelayer(bountyId: number, laceAddress: string, evidenceCid: string) {
  const { exec } = await import("child_process");
  const util = await import("util");
  const execAsync = util.promisify(exec);
  const path = await import("path");
  
  const contractDir = path.resolve(process.cwd(), "..", "lumina-contract");
  
  try {
    const { stdout, stderr } = await execAsync(`npx tsx src/api_verify.ts "${laceAddress}"`, { cwd: contractDir });
    const result = JSON.parse(stdout.trim().split('\n').pop() || "{}");
    
    if (!result.success) {
        throw new Error(result.error || "Unknown Midnight error");
    }
    
    return {
      success: true,
      txHash: result.txId,
      network: "Midnight Local Devnet"
    };
  } catch (err: any) {
    console.error("Midnight execution failed", err);
    return {
      success: false,
      error: err.message
    }
  }
}
