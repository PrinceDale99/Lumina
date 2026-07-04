"use server";

export async function generateZKProof() {
  // Server-side dynamic import of the real circuit
  // Node.js will read the WASM from the file system natively, bypassing Webpack browser WASM parsing bugs!
  const { pureCircuits } = await import("lumina-circuits/build/contract/index.js");

  // Prepare cryptographic data
  const bountyId = new Uint8Array(32);
  const pubKey = new Uint8Array(32);
  const privKey = new Uint8Array(32);
  const sig = new Uint8Array(64);
  const timestamp = BigInt(Math.floor(Date.now() / 1000));
  const validity = BigInt(0); // Valid

  // Execute the mathematical ZK circuit server-side
  const start = performance.now();
  const [isValid, outPubKey, outBountyId] = pureCircuits.verifyEmployee(
    bountyId,
    pubKey,
    privKey,
    sig,
    timestamp,
    validity
  );
  const timeTaken = (performance.now() - start).toFixed(2);

  // Return serialized data (BigInts and Uint8Arrays must be serialized to JSON if sent to client)
  return {
    isValid,
    timeTaken,
    outPubKey: Array.from(outPubKey),
    outBountyId: Array.from(outBountyId),
  };
}
