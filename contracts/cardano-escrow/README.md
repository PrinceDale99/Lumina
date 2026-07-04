# Lumina Cardano Escrow

This directory contains the Aiken smart contract for the Lumina Escrow on Cardano.

Since Midnight zero-knowledge proofs are verified off-chain via the Relayer (Next.js backend), this Plutus contract ensures that the bounty is only released when authorized by the trusted Relayer.

## Prerequisites

- [Aiken](https://aiken-lang.org/installation-instructions)
- [Lucid](https://lucid.space/) (for deployment)
- Blockfrost API Key (Preprod)

## Building the Contract

Compile the Aiken validator to generate the `plutus.json` file:

```bash
aiken build
```

This will create a `plutus.json` file in the root of the project which contains the compiled CBOR for the `escrow` validator.

## Deployment to Preprod

To deploy to Cardano Preprod, you can use Lucid in a Node.js script:

```typescript
import { Lucid, Blockfrost } from "lucid-cardano";
import plutusBlueprint from "./plutus.json" assert { type: "json" };

const lucid = await Lucid.new(
  new Blockfrost("https://cardano-preprod.blockfrost.io/api/v0", "YOUR_BLOCKFROST_KEY"),
  "Preprod",
);

// Load the compiled Plutus V2 script
const validator = plutusBlueprint.validators.find(v => v.title === "escrow.spend");
const script = {
  type: "PlutusV2",
  script: validator.compiledCode,
};

const address = lucid.utils.validatorToAddress(script);
console.log("Cardano Escrow Address:", address);
```
