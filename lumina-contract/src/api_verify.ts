import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { WebSocket } from 'ws';
import { Buffer } from 'buffer';

import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { resolveNetwork, getOrCreateSeed, getDeployment } from './network.js';
import { createWallet, persistWalletState, unshieldedToken, type WalletContext } from './wallet.js';
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

async function verify(destinationWallet: string) {
  const { network, config: networkConfig } = resolveNetwork();
  const deployment = getDeployment(network);
  if (!deployment) throw new Error("Contract not deployed");
  
  const walletCtx = await createWallet({ network, networkConfig, seed: getOrCreateSeed(network) });
  await walletCtx.wallet.waitForSyncedState();
  
  const providers = await createProviders(walletCtx, networkConfig);
  const deployed: any = await findDeployedContract(providers, {
    compiledContract: compiledContract as any,
    contractAddress: deployment.address,
  });

  const bountyId = new Uint8Array(32);
  const companyPubKey = new Uint8Array(32);
  const privateKey = new Uint8Array(32);
  const corporateSignature = new Uint8Array(64);
  const employmentTimestamp = 2000n;
  const validityThreshold = 1000n;
  
  const tx = await deployed.callTx.verifyEmployee(
      bountyId, companyPubKey, privateKey, corporateSignature, employmentTimestamp, validityThreshold, destinationWallet
  );
  
  await persistWalletState(network, walletCtx);
  await walletCtx.wallet.stop();
  
  return {
      txId: tx.public.txId,
      blockHeight: tx.public.blockHeight,
      wallet: destinationWallet
  };
}

const args = process.argv.slice(2);
const wallet = args[0] || "DEFAULT_TEST_WALLET";

verify(wallet).then(res => {
    console.log(JSON.stringify({ success: true, ...res }));
    process.exit(0);
}).catch(err => {
    console.log(JSON.stringify({ success: false, error: err.message }));
    process.exit(1);
});
