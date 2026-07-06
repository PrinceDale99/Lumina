import { FluentWalletBuilder } from '@midnight-ntwrk/testkit-js';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const seedPhrase = process.env.WALLET_SEED_PHRASE;
  if (!seedPhrase) throw new Error("Missing WALLET_SEED_PHRASE");

  const envConfig = {
    walletNetworkId: "Testnet" as any,
    networkId: "Testnet",
    indexer: "https://indexer.testnet-02.midnight.network",
    indexerWS: "wss://indexer.testnet-02.midnight.network",
    node: "https://rpc.testnet-02.midnight.network",
    nodeWS: "wss://rpc.testnet-02.midnight.network",
    proofServer: "http://localhost:6300",
    faucet: undefined
  };

  const { wallet, seeds, keystore } = await FluentWalletBuilder.forEnvironment(envConfig).withMnemonic(seedPhrase).buildWithoutStarting();
  console.log("Seeds:", Object.keys(seeds));
}

main().catch(console.error);
