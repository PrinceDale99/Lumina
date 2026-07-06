"use server";

export async function generateZKProof(destAddress: string) {
  // Mock function to prevent build errors since the ZK logic has been moved purely to the Relayer backend
  return {
    isValid: true,
    timeTaken: "0.00",
    outPubKey: [],
    outBountyId: [],
    outDestWallet: []
  };
}

export async function submitProofViaMidnightRelayer(bountyId: number, laceAddress: string, evidenceCid: string) {
  try {
    const RELAYER_URL = process.env.MIDNIGHT_RELAYER_URL || 'http://127.0.0.1:3001';
    console.log(`Sending verification request to Relayer: ${RELAYER_URL}/api/verify`);

    // Use a long timeout as the relayer generates the ZK Proof and submits it to Midnight Testnet
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const response = await fetch(`${RELAYER_URL}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destinationWallet: laceAddress }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error('Relayer verification failed:', data);
      return { success: false, error: data.error || 'Verification failed on relayer' };
    }

    return {
      success: true,
      txHash: data.txId,
      network: "Midnight Testnet"
    };
  } catch (error: any) {
    console.error('Action error:', error);
    return { success: false, error: error.message };
  }
}
