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
    destWalletBuffer = new Uint8Array(32); // Fallback if invalid
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

export async function submitProofViaRelayer(bountyId: number, destAddress: string, evidenceCid: string) {
  try {
    const { Keypair, rpc, Contract, TransactionBuilder, Networks, Address, nativeToScVal } = await import("@stellar/stellar-sdk");
    
    // 1. Generate a Burner Account (Dynamic Keypair)
    const burner = Keypair.random();
    
    // 2. Fund the Burner Account on Testnet via Friendbot
    const fundResponse = await fetch(`https://friendbot.stellar.org/?addr=${burner.publicKey()}`);
    if (!fundResponse.ok) {
      throw new Error("Failed to fund burner account via Friendbot");
    }

    const server = new rpc.Server("https://soroban-testnet.stellar.org");
    const sourceAccount = await server.getAccount(burner.publicKey());
    
    // 3. Build the Contract Call
    const CONTRACT_ID = "CAR453YPMSCZQ2QURK4IKUACEAPVWUU2TZX2UBPT7SOLC6PYRQJMNG6H";
    const contract = new Contract(CONTRACT_ID);
    
    const tx = new TransactionBuilder(sourceAccount, {
      fee: "100000",
      networkPassphrase: Networks.TESTNET,
    })
    .addOperation(contract.call(
      "submit_proof",
      nativeToScVal(bountyId, { type: 'u32' }),
      new Address(destAddress).toScVal(),
      nativeToScVal(evidenceCid, { type: 'string' })
    ))
    .setTimeout(30)
    .build();

    // 4. Prepare and Sign with the Burner Account Private Key
    const preparedTx = await server.prepareTransaction(tx);
    preparedTx.sign(burner);

    // 5. Submit to Soroban
    const response = await server.sendTransaction(preparedTx);
    
    if (response.status === "ERROR") {
      throw new Error("Transaction failed on Soroban");
    }

    return {
      success: true,
      txHash: response.hash
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}
