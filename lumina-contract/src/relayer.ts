import express from 'express';
import cors from 'cors';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { WebSocket } from 'ws';

import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { resolveNetwork, getOrCreateSeed, getDeployment } from './network.js';
import { createWallet, unshieldedToken, type WalletContext } from './wallet.js';
import { CompiledContract } from '@midnight-ntwrk/compact-js';

// @ts-expect-error Required for wallet sync
globalThis.WebSocket = WebSocket;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const zkConfigPath = path.resolve(__dirname, '..', 'contracts', 'managed', 'employee');
const contractPath = path.join(zkConfigPath, 'contract', 'index.js');
const Employee = await import(pathToFileURL(contractPath).href);
const compiledContract = CompiledContract.make('employee', Employee.Contract).pipe(
  CompiledContract.withVacantWitnesses,
  CompiledContract.withCompiledFileAssets(zkConfigPath),
);

async function createProviders(walletCtx: WalletContext, networkConfig: any) {
  const privateStatePassword = process.env.PRIVATE_STATE_PASSWORD?.trim() || 'Local-Devnet-Development-Placeholder-1';
  const state = await walletCtx.wallet.waitForSyncedState();
  const walletProvider = {
    getCoinPublicKey: () => state.shielded.coinPublicKey.toHexString(),
    getEncryptionPublicKey: () => state.shielded.encryptionPublicKey.toHexString(),
    async balanceTx(tx: any, ttl?: Date) {
      const recipe = await walletCtx.wallet.balanceUnboundTransaction(
        tx,
        { shieldedSecretKeys: walletCtx.shieldedSecretKeys, dustSecretKey: walletCtx.dustSecretKey },
        { ttl: ttl ?? new Date(Date.now() + 30 * 60 * 1000) },
      );
      const signedRecipe = await walletCtx.wallet.signRecipe(recipe, (payload) =>
        walletCtx.unshieldedKeystore.signData(payload),
      );
      return walletCtx.wallet.finalizeRecipe(signedRecipe);
    },
    submitTx: (tx: any) => walletCtx.wallet.submitTransaction(tx) as any,
  };
  const zkConfigProvider = new NodeZkConfigProvider(zkConfigPath);
  const accountId = walletCtx.unshieldedKeystore.getBech32Address().toString();
  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'employee-state',
      accountId,
      privateStoragePasswordProvider: () => privateStatePassword,
    }),
    publicDataProvider: indexerPublicDataProvider(networkConfig.indexer, networkConfig.indexerWS),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(networkConfig.proofServer, zkConfigProvider),
    walletProvider,
    midnightProvider: walletProvider,
  };
}

let deployed: any;
let isReady = false;

async function initRelayer() {
  const { network, config: networkConfig } = resolveNetwork();
  const deployment = getDeployment(network);
  if (!deployment) throw new Error("Contract not deployed");
  
  console.log(`[Relayer] Connecting to ${network}...`);
  console.log(`[Relayer] Initializing wallet and syncing (this may take a few minutes)...`);
  
  const walletCtx = await createWallet({ network, networkConfig, seed: getOrCreateSeed(network) });
  await walletCtx.wallet.waitForSyncedState();
  
  console.log(`[Relayer] Wallet synced! Setting up providers...`);
  const providers = await createProviders(walletCtx, networkConfig);
  
  deployed = await findDeployedContract(providers, {
    compiledContract: compiledContract as any,
    contractAddress: deployment.address,
  });
  
  isReady = true;
  console.log(`[Relayer] Ready! Listening for Verification requests...`);
}

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: isReady ? 'ready' : 'syncing' });
});

app.post('/api/verify', async (req, res) => {
  if (!isReady) {
    return res.status(503).json({ success: false, error: "Relayer is still syncing with Midnight blockchain." });
  }

  const { destinationWallet } = req.body;
  if (!destinationWallet) {
    return res.status(400).json({ success: false, error: "Missing destinationWallet" });
  }

  try {
    console.log(`[Relayer] Received verification request for wallet: ${destinationWallet}`);
    
    const bountyId = new Uint8Array(32);
    const companyPubKey = new Uint8Array(32);
    const privateKey = new Uint8Array(32);
    const corporateSignature = new Uint8Array(64);
    const employmentTimestamp = 2000n;
    const validityThreshold = 1000n;
    
    const tx = await deployed.callTx.verifyEmployee(
        bountyId, companyPubKey, privateKey, corporateSignature, employmentTimestamp, validityThreshold, destinationWallet
    );
    
    console.log(`[Relayer] Verification successful! TxID: ${tx.public.txId}`);
    res.json({
        success: true,
        txId: tx.public.txId,
        blockHeight: tx.public.blockHeight,
        wallet: destinationWallet
    });
  } catch (err: any) {
    console.error(`[Relayer] Verification failed:`, err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[Relayer] Express server listening on port ${PORT}`);
  initRelayer().catch(err => {
    console.error(`[Relayer] Initialization failed:`, err);
    process.exit(1);
  });
});
