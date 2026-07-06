const { Keypair, rpc, Contract, nativeToScVal, TransactionBuilder, Networks, Address } = require('@stellar/stellar-sdk');

const SOROBAN_RPC = "https://soroban-testnet.stellar.org";
const server = new rpc.Server(SOROBAN_RPC);
const CONTRACT_ID = "CAR453YPMSCZQ2QURK4IKUACEAPVWUU2TZX2UBPT7SOLC6PYRQJMNG6H";
const NATIVE_ASSET_CONTRACT = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";

const delay = ms => new Promise(res => setTimeout(res, ms));

async function fund() {
  console.log("Loading contract with 2m XLM via Friendbot... This might take a bit.");
  
  // We will create an account, fund it via friendbot, then loop and transfer.
  // Actually, wait: friendbot only gives 10k XLM per address.
  // We need 2,000,000 XLM, which means 200 addresses.
  
  let successCount = 0;
  let totalFunded = 0;
  
  // Do batches of 10
  for (let batch = 0; batch < 20; batch++) {
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push((async () => {
        try {
          const kp = Keypair.random();
          // Fund account
          await fetch('https://friendbot.stellar.org/?addr=' + kp.publicKey());
          
          // Load account
          const sourceAccount = await server.getAccount(kp.publicKey());
          
          // Transfer 9990 XLM to the contract (save 10 for fees)
          const amount = BigInt(9990 * 10000000); // 7 decimals
          
          const nativeToken = new Contract(NATIVE_ASSET_CONTRACT);
          
          const tx = new TransactionBuilder(sourceAccount, {
            fee: "100000",
            networkPassphrase: Networks.TESTNET,
          })
          .addOperation(nativeToken.call(
            "transfer",
            new Address(kp.publicKey()).toScVal(),
            new Address(CONTRACT_ID).toScVal(),
            nativeToScVal(amount, { type: 'i128' })
          ))
          .setTimeout(30)
          .build();
          
          const preparedTx = await server.prepareTransaction(tx);
          preparedTx.sign(kp);
          
          const response = await server.sendTransaction(preparedTx);
          if (response.status !== "ERROR") {
            successCount++;
            totalFunded += 9990;
          }
        } catch (e) {
          console.error("Error in batch:", e);
        }
      })());
    }
    await Promise.all(promises);
    console.log(`Batch ${batch+1}/20 complete. Total so far: ~${totalFunded} XLM`);
    await delay(1000);
  }
  
  console.log(`Successfully funded contract with ~${totalFunded} XLM`);
}

fund();
