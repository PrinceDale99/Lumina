import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { 
  MidnightWalletProvider, 
  createDefaultTestLogger,
  FluentWalletBuilder,
  inMemoryPrivateStateProvider,
  WalletSeeds
} from '@midnight-ntwrk/testkit-js';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { dummyContractAddress } from '@midnight-ntwrk/compact-runtime';
import * as dotenv from 'dotenv';
import { Contract } from './build/contract/index.js';

dotenv.config();

async function main() {
  const seedPhrase = process.env.SEED || 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art';

  setNetworkId('Undeployed');
  console.log("Connecting to Local Midnight Network...");

  const logger = createDefaultTestLogger();

  const envConfig = {
    walletNetworkId: "Undeployed" as any,
    networkId: "Undeployed",
    indexer: "http://127.0.0.1:8088/api/v4/graphql",
    indexerWS: "ws://127.0.0.1:8088/api/v4/graphql/ws",
    node: "http://127.0.0.1:9944",
    nodeWS: "ws://127.0.0.1:9944",
    proofServer: "http://127.0.0.1:6300",
    faucet: undefined
  };

  console.log("Initializing Wallet with Alice's pre-funded seed phrase...");
  const { masterSeed } = WalletSeeds.fromMnemonic(seedPhrase);
  const walletProvider = await MidnightWalletProvider.build(logger, envConfig, masterSeed);

  console.log("Starting wallet provider...");
  await walletProvider.start();
  
  const coinPublicKey = walletProvider.getCoinPublicKey();
  console.log("Wallet Provider coin public key:", coinPublicKey);


  console.log("Initializing Providers...");

  const zkConfigProvider = new NodeZkConfigProvider('./build/contract');
  const proofProvider = httpClientProofProvider(envConfig.proofServer, zkConfigProvider);

  const providers = {
    privateStateProvider: inMemoryPrivateStateProvider(),
    publicDataProvider: indexerPublicDataProvider(envConfig.indexer, envConfig.indexerWS),
    zkConfigProvider: zkConfigProvider,
    proofProvider: proofProvider,
    walletProvider: walletProvider,
    midnightProvider: walletProvider,
  };

  logger.info('Deploying Zero-Knowledge Escrow Contract to Midnight Local Testnet...');
  
  // Shim for v0.5.1 compiler output running on v4.1.1 SDK
  const compiledContractShim = {
    [Symbol.for('compactContextTypeId')]: {
      ctor: Contract,
      witnesses: {}
    }
  };

  const deployed = await deployContract(providers as any, {
    compiledContract: compiledContractShim as any,
    privateStateId: 'lumina-escrow-state',
    initialPrivateState: {}
  });

  logger.info(`Contract deployed at: ${deployed.deployTxData.public.contractAddress}`);
  
  return { contractAddress: deployed.deployTxData.public.contractAddress };
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
