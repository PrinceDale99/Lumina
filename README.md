# Lumina: Zero-Knowledge Escrow & Relayer System

Lumina is a privacy-first whistleblower and regulatory system built on the **Midnight Network**. It leverages zero-knowledge (ZK) proofs to allow anonymous individuals to submit cryptographic evidence and receive bounties without exposing their real-world identity.

---

## How It Works (The Architecture)

Lumina uses a hybrid Relayer architecture to abstract the complexities of blockchain gas fees away from the whistleblower. 

1. **The Smart Contract (Compact):** The core escrow logic is written in the Midnight Compact language (`circuits/src/employee.compact`). This handles the mathematical ZK-proof verification.
2. **The Relayer Backend (Next.js):** The `actions.ts` backend securely spins up a burner wallet to pay the Midnight Network gas fees (`tDUST`/`tNIGHT`). 
3. **The User Flow:** 
   - A whistleblower connects their Lace wallet (for receiving funds).
   - They submit evidence.
   - The frontend generates a Zero-Knowledge Proof locally via the Proof Server.
   - The Relayer broadcasts the proof to the Midnight smart contract, shielding the user's identity entirely.

---

## 🚀 Live Deployment Instructions (Midnight Testnet)

The smart contract has been fully compiled successfully into `circuits/build/contract/`. To deploy this to the live network, you must complete the final Provider setup.

### Step 1: Ensure Infrastructure is Running
You must have the local Midnight Proof Server running in Docker to generate the deployment ZK-proofs:
```bash
docker run -d --name proof-server -p 6300:6300 midnightntwrk/proof-server:latest
```
*(This is currently running on your machine on port 6300).*

### Step 2: Finalize the SDK Script
Because Midnight SDK versions update rapidly during testnet phases, you need to plug in the specific Wallet Provider logic from the official IOG Developer Portal.

1. Open `circuits/deploy.ts`.
2. Navigate to the official Midnight Network documentation and search for **"Deploying a Compact Contract"** or **"Wallet Provider Setup"**.
3. Copy the official TypeScript snippet that initializes the Wallet using your seed phrase.
4. Replace the commented-out `// Initialize Wallet SDK...` sections in `deploy.ts` with the official code.

### Step 3: Execute Deployment
Once your `deploy.ts` is updated with the official SDK syntax, run the deployment script:
```bash
cd circuits
npm run deploy
```

Upon success, you will receive your **Midnight Contract Address**. You can track this transaction on the community explorer: `https://midnightexplorer.io/contract/<ADDRESS>`.

---

## Running the Web App Locally

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the Next.js development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` to interact with the Whistleblower Portal.

---

## Screenshots

- **Successful Proof Generation & UI:** 
  *(Screenshots located in `frontend/public/`)*

*(Lumina was developed with privacy at its absolute core. Thank you for using Midnight!)*
