import { Lucid, Blockfrost } from "lucid-cardano";
import plutusBlueprint from "./plutus.json" assert { type: "json" };

/**
 * Lumina Escrow Deployment Script (Cardano Preprod)
 * 
 * To run this script:
 * 1. Install dependencies: npm i lucid-cardano ts-node
 * 2. Get a Blockfrost API Key for Preprod
 * 3. Add your wallet seed phrase
 * 4. Run: npx ts-node deploy.ts
 */

async function main() {
  const BLOCKFROST_API_KEY = "preprodYOUR_BLOCKFROST_KEY_HERE";
  const SEED_PHRASE = "your seed phrase goes here...";

  // Initialize Lucid with Blockfrost
  const lucid = await Lucid.new(
    new Blockfrost("https://cardano-preprod.blockfrost.io/api/v0", BLOCKFROST_API_KEY),
    "Preprod",
  );

  lucid.selectWalletFromSeed(SEED_PHRASE);

  console.log("Wallet address:", await lucid.wallet.address());

  // Find the compiled Plutus V2 script
  const validator = plutusBlueprint.validators.find((v: any) => v.title === "escrow.spend");
  if (!validator) {
    throw new Error("Could not find compiled escrow.spend validator in plutus.json!");
  }

  const script = {
    type: "PlutusV2",
    script: validator.compiledCode,
  };

  const contractAddress = lucid.utils.validatorToAddress(script as any);
  console.log("\n✅ Lumina Cardano Escrow Smart Contract Address:");
  console.log(contractAddress);
  
  // NOTE: This script calculates the deployed address. 
  // Plutus scripts do not need to be explicitly 'deployed' like EVM contracts.
  // They are intrinsically deployed simply by sending funds to the calculated address!
  console.log("\nTo fund the escrow, send ADA directly to this address.");
}

main().catch(console.error);
