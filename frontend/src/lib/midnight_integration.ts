/**
 * Midnight ZK-SNARK Integration Layer
 * 
 * This module is responsible for orchestrating the local witness generation.
 * It strictly enforces that the private key and corporate credentials never
 * leave the user's local machine by talking exclusively to the localhost 
 * Midnight Proof Server.
 */

export async function generateProofLocally(
  privateKey: string, 
  corporateSignature: string,
  bountyId: string
) {
  try {
    // We send the private data ONLY to the local Midnight server running on localhost.
    // The browser enforces CORS, but this is a local-to-local call.
    const response = await fetch("http://127.0.0.1:8080/generate_proof", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        circuit: "verifyEmployee",
        public_inputs: {
          bountyId,
          companyPubKey: "G_TARGET_COMPANY_PUB_KEY"
        },
        private_witnesses: {
          privateKey,
          corporateSignature,
          employmentTimestamp: Date.now(),
          validityThreshold: 1600000000
        }
      })
    });

    if (!response.ok) {
      throw new Error("Local ZK Proof generation failed. Invalid credentials?");
    }

    const proofData = await response.json();
    
    // proofData contains the SNARK proof bytes, the credentialNullifier, and isValidEmployee
    return proofData;
  } catch (error) {
    console.error("OpSec Error: Proof generation failed locally.", error);
    throw error;
  }
}
