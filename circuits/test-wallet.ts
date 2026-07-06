import { FluentWalletBuilder, createDefaultTestLogger, MidnightWalletProvider } from '@midnight-ntwrk/testkit-js';
const envConfig = { indexer: 'http://127.0.0.1:8088/api/v1/graphql', indexerWS: 'ws://127.0.0.1:8088/api/v1/graphql/ws', node: 'http://127.0.0.1:9944', nodeWS: 'ws://127.0.0.1:9944', proofServer: 'http://127.0.0.1:6300', networkId: 'Undeployed' as any };
async function test() {
  const { wallet, seeds, keystore } = await FluentWalletBuilder.forEnvironment(envConfig).withMnemonic('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art').buildWithoutStarting();
  const wp = await MidnightWalletProvider.withWallet(createDefaultTestLogger(), envConfig, wallet, (seeds as any).shielded, (seeds as any).dust, keystore);
  console.log('coinPublicKey in wp:', 'coinPublicKey' in wp);
  console.log('coinPublicKey from wallet:', wallet.coinPublicKey);
}
test().catch(console.error);
