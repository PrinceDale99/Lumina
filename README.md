# Lumina: Trustless Zero-Knowledge Whistleblower Escrow

<div align="center">
  <img src="https://raw.githubusercontent.com/PrinceDale99/Lumina/main/public/logo.png" alt="Lumina Logo" width="200" height="200" />
</div>

Lumina is a decentralized, zero-knowledge financial escrow system designed to protect whistleblowers. It allows corporate insiders to mathematically prove their employment status and submit encrypted evidence of fraud—**without ever revealing their identity**.

### The Initial Product Idea
The conceptualization of Lumina began with a simple question: How can we mathematically guarantee the safety of those who risk everything to expose corporate corruption? Traditional whistleblowing systems rely heavily on trust—trust in institutions, trust in lawyers, and trust in centralized platforms. Lumina was conceived to replace this fragile trust with immutable cryptography. The goal was to build an unstoppable, trustless escrow mechanism where the validity of an insider's claims could be proven mathematically, and the financial reward distributed automatically, all while strictly preserving the whistleblower's absolute anonymity.

---

## 🛑 The Problem

Whistleblowers face immense personal, legal, and financial risks when exposing corporate fraud or regulatory violations. Existing whistleblowing channels and bounty systems are fundamentally flawed:

1. **Centralized Trust:** Traditional hotlines require trusting a centralized entity (a government agency or law firm), which can be subpoenaed, hacked, or internally compromised.
2. **Transparent Ledgers:** Attempting to claim a financial bounty on a standard blockchain exposes the payout to corporate investigators. Through chain-analysis, investigators can trace the funds back to the whistleblower, stripping away their anonymity.

## 💡 The Solution: Lumina

Lumina bridges the gap between trustless payouts and absolute anonymity. It allows a whistleblower to generate a cryptographic proof of their employment *locally on their own device*, and submit it alongside encrypted evidence. If decentralized arbiters validate the evidence, a smart contract automatically routes the bounty to a brand-new, unconnected wallet. 

The deterministic link between the employee's real-world identity and their payout wallet is mathematically severed.

---

## 🧠 Core Technologies

### Why Midnight Compact (Zero-Knowledge)?
Lumina uses the **Midnight Network's Compact language** to write specialized Zero-Knowledge circuits (`circuits/src/employee.compact`).

* **Local Verification:** The whistleblower provides their digitally signed corporate credentials (e.g., an employment hash, timestamp, and registry key).
* **Zero Knowledge:** The Compact circuit runs entirely *locally* in the user's browser (or secure environment). It generates a ZK-SNARK proving that:
  1. The user is a valid employee of the target entity.
  2. The user has not submitted a claim before (preventing Sybil attacks via a cryptographic Nullifier).
* **Absolute Privacy:** The actual credential never leaves the device. It is mathematically impossible for regulators, the blockchain, or the target corporation to reverse-engineer the whistleblower's identity.

#### Public State vs Private Witness
A fundamental paradigm in Lumina's Midnight integration is the separation of **Public State** and **Private Witness**. 
* **Private Witness:** Highly sensitive data—such as the whistleblower's digital employment signature, exact timestamp of hire, and private key—acts as the *Private Witness*. This data is ingested locally by the Compact Prover but is **never** broadcasted, stored, or revealed to the network. 
* **Public State:** The network only ever sees the *Public State*—the output of the ZK circuit. In Lumina, this consists solely of a boolean (Valid/Invalid), the Target Company's Public Key, and a Cryptographic Nullifier (to prevent double-claiming). By strictly gating private variables from the public ledger, Lumina guarantees that on-chain analytics can never expose the whistleblower.

### Why Stellar (Soroban)?
Lumina utilizes **Stellar's Soroban Smart Contracts** for the financial escrow and arbitration layer.

* **Fast and Cheap:** Stellar provides lightning-fast settlement and near-zero transaction fees, which is crucial for managing high-value XLM escrows efficiently.
* **Advanced Authorization:** Using Stellar's CAP-0071 authorization framework, Soroban allows complex, multi-party signature patterns.
* **Untraceable Payouts:** The smart contract acts as a trustless escrow agent. Upon verification of the ZK-SNARK and arbiter approval, the contract authorizes the payout through a transient account to the whistleblower's clean Freighter wallet, breaking the on-chain money trail.

---

## 🏗️ System Architecture & Execution Flow

### 1. Bounty Deployment (Regulator)
Regulators (e.g., SEC, independent auditors) use the **Regulator Dashboard** to deploy trustless bounties targeting specific corporate entities. They define the required arbiter approvals and fund the Soroban escrow with XLM.

### 2. Proof Generation (Whistleblower)
* An employee accesses the **Whistleblower Portal** via a secure connection.
* They load their corporate credential. The browser securely compiles the Midnight Compact circuit, computes a Poseidon Hash, and synthesizes a ZK-SNARK proof.
* The evidence payload is AES-encrypted locally with the Regulator's public key and pinned to IPFS.
* The user generates a blank Stellar wallet with zero history.
* The ZK-proof, Nullifier, and encrypted evidence CID are submitted to the Soroban contract.

### 3. Decentralized Arbitration
Registered arbiters (auditors, legal experts) review the decrypted evidence off-chain. If the evidence of fraud is conclusive, they cast their cryptographic votes on the Soroban contract.

### 4. Trustless Execution
Once the predefined threshold of arbiter votes is reached, the Soroban contract automatically releases the XLM bounty to the whistleblower's clean wallet. No human intervention can stop or redirect the funds once the conditions are met.

---

## 💻 Tech Stack

* **Frontend:** Next.js 14, React, TailwindCSS, Framer Motion
* **Zero-Knowledge:** Midnight Compact, `@midnight-ntwrk/compact-runtime`, WebAssembly (WASM)
* **Smart Contracts:** Soroban (Stellar), Rust
* **Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* Rust and Cargo (for Soroban Smart Contracts)
* Stellar CLI
* A secure connection (VPN/Tor recommended for whistleblowers)

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PrinceDale99/Lumina.git
   cd Lumina
   ```

2. **Install dependencies:**
   ```bash
   npm install
   cd frontend && npm install
   ```

3. **Run the Next.js Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Smart Contract Deployment (Soroban)
To deploy the Lumina Escrow contract to the Stellar Testnet:
```bash
cd contracts/escrow
stellar contract build
stellar contract deploy --network testnet --source <your-alias>
```
*Screenshot: Successful Soroban Contract Deployment on Stellar Testnet*  
<img src="public/Smart%20Contract.png" width="600" alt="Smart Contract Deployment" />

### Compiling ZK Circuits (Midnight Compact)
If you wish to modify the Midnight Zero-Knowledge circuits, you will need the Midnight toolchain installed.
```bash
cd circuits
npm run compile
```
*Screenshot: Successful Midnight Compact Compilation*  
<img src="public/Compile%20Output.png" width="600" alt="Compile Output" />

---

## 🛡️ Security Notice
While Lumina provides cryptographic guarantees regarding Zero-Knowledge proofs and smart contract execution, operational security (OpSec) remains the responsibility of the whistleblower. Users should always access the portal via Tor or a trusted VPN, and never generate proofs on a corporate-managed device or network.
