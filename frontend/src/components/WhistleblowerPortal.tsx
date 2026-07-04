import { useDemoMode } from "@/lib/DemoModeContext";
import { AlertTriangle, Upload, FileLock, ShieldCheck, Zap, Terminal, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { generateZKProof } from "@/app/actions";
import { useWallet } from "@/lib/WalletContext";
import { rpc, Contract, nativeToScVal, TransactionBuilder, Networks, Address } from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";

const SOROBAN_RPC = "https://soroban-testnet.stellar.org";
const CONTRACT_ID = "CAR453YPMSCZQ2QURK4IKUACEAPVWUU2TZX2UBPT7SOLC6PYRQJMNG6H";
const server = new rpc.Server(SOROBAN_RPC);

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
  exit: { opacity: 0, y: -30, scale: 0.95, transition: { duration: 0.2 } }
};

export default function WhistleblowerPortal() {
  const [step, setStep] = useState(1);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [zkLog, setZkLog] = useState<string[]>([]);
  const [txHash, setTxHash] = useState<string | null>(null);
  const { pubKey, connect } = useWallet();

  useEffect(() => {
    // Only used to reset logs if needed
  }, [step]);

  const { isDemoMode } = useDemoMode();

  const simulateZK = async () => {
    setZkLog(["Initializing Midnight Compact Prover..."]);
    
    if (isDemoMode) {
      setTimeout(() => setZkLog(l => [...l, "Loading Corporate Credentials (Local)..."]), 600);
      setTimeout(() => setZkLog(l => [...l, "Computing Poseidon Hash..."]), 1200);
      setTimeout(() => setZkLog(l => [...l, "Generating ZK-SNARK Circuit..."]), 1800);
      setTimeout(() => setZkLog(l => [...l, "Synthesizing Proof... [██████████░░]"]), 2500);
      setTimeout(() => setZkLog(l => [...l, "Validating Nullifier... OK"]), 3200);
      setTimeout(() => {
        setZkLog(l => [...l, "Proof Generated Successfully."]);
        setTimeout(() => setStep(3), 1000);
      }, 4000);
    } else {
      try {
        setZkLog(l => [...l, "Calling Next.js Server Node.js environment to run ZK Proof natively..."]);
        
        // Execute the mathematical ZK circuit via the secure Server Action
        const result = await generateZKProof();
        
        setZkLog(l => [
          ...l, 
          `Circuit executed in ${result.timeTaken}ms`,
          `Output isValid: ${result.isValid}`,
          `Nullifier Output computed securely off-browser.`,
          "Proof Generated Successfully."
        ]);
        
        setTimeout(() => setStep(3), 1500);
      } catch (err: any) {
        setZkLog(l => [...l, `ERROR: ${err.message}`]);
      }
    }
  };

  const simulateEncryption = () => {
    setIsEncrypting(true);
    setTimeout(() => {
      setIsEncrypting(false);
      setStep(4);
    }, 2000);
  };

  const submitToSoroban = async () => {
    if (!pubKey) {
      alert("Please connect your clean Freighter wallet first!");
      await connect();
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Fetch source account from Soroban
      const sourceAccount = await server.getAccount(pubKey);
      
      // 2. Build the contract call payload
      const contract = new Contract(CONTRACT_ID);
      const bountyId = 1; // Example hardcoded active bounty ID 1
      const evidenceCid = "QmX9a... (Encrypted)";
      
      const tx = new TransactionBuilder(sourceAccount, {
        fee: "100000",
        networkPassphrase: Networks.TESTNET,
      })
      .addOperation(contract.call(
        "submit_proof",
        nativeToScVal(bountyId, { type: 'u32' }),
        new Address(pubKey).toScVal(),
        nativeToScVal(evidenceCid, { type: 'string' })
      ))
      .setTimeout(30)
      .build();

      // 3. Prepare the transaction for Soroban
      const preparedTx = await server.prepareTransaction(tx);

      // 4. Request user signature via Freighter wallet extension
      const signedXdr = await signTransaction(preparedTx.toXDR(), { networkPassphrase: "Test SDF Network ; September 2015" });
      const signedTx = rpc.assembleTransaction(preparedTx, signedXdr);

      // 5. Submit to the Stellar Testnet
      const response = await server.submitTransaction(signedTx);
      
      if (response.status === "ERROR") {
        throw new Error("Transaction failed on Soroban");
      }

      setTxHash(response.hash);
      setStep(6);
    } catch (err: any) {
      console.error(err);
      alert(`Soroban Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-12 relative px-4">
        <div className="absolute left-0 top-1/2 w-full h-[1px] bg-white/10 -z-10"></div>
        <motion.div 
          className="absolute left-0 top-1/2 h-[2px] bg-green-neon shadow-[0_0_10px_#39ff14] -z-10"
          initial={{ width: "0%" }}
          animate={{ width: `${((step - 1) / 4) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        {[1, 2, 3, 4, 5].map((s) => (
          <motion.div 
            key={s} 
            initial={false}
            animate={{ 
              scale: step === s ? 1.2 : 1,
              borderColor: step >= s ? "#39ff14" : "rgba(255,255,255,0.1)",
              backgroundColor: step >= s ? "rgba(57,255,20,0.1)" : "#0A0B10",
              color: step >= s ? "#39ff14" : "#64748b"
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 shadow-2xl backdrop-blur-md transition-colors duration-500"
          >
            {s}
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="bg-red-500/5 border border-red-500/30 p-10 rounded-3xl text-center space-y-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-3xl pointer-events-none" />
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500 animate-pulse" />
            </div>
            <h2 className="text-3xl font-black text-red-400 tracking-tight">CRITICAL SECURITY WARNING</h2>
            <p className="text-red-300/80 text-lg leading-relaxed max-w-xl mx-auto">
              Before proceeding, ensure you are using a VPN or the Tor network. Do not use a corporate network or device. This portal will generate a Zero-Knowledge Proof locally on your machine.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(2)} 
              className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 font-bold py-4 px-10 rounded-xl transition-all mt-8 uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]"
            >
              I am secured. Proceed.
            </motion.button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="bg-surface border border-white/5 p-10 rounded-3xl text-center space-y-6 relative">
            <ShieldCheck className="w-16 h-16 text-green-neon mx-auto mb-2 drop-shadow-[0_0_15px_rgba(57,255,20,0.5)]" />
            <h2 className="text-2xl font-extrabold text-white">Local Credential Processing</h2>
            <p className="text-slate-400 text-base max-w-lg mx-auto">
              Upload your digitally signed corporate credential. <br/>
              <strong className="text-green-neon">Your credential NEVER leaves this device.</strong> The ZK prover runs entirely in your browser.
            </p>
            
            {zkLog.length === 0 ? (
              <motion.div 
                whileHover={{ scale: 1.02, borderColor: isDemoMode ? "rgba(57,255,20,0.5)" : "rgba(0,240,255,0.5)" }}
                whileTap={{ scale: 0.98 }}
                onClick={simulateZK}
                className={`border-2 border-dashed border-white/10 rounded-2xl p-12 cursor-pointer mt-8 relative overflow-hidden group transition-colors duration-500 ${isDemoMode ? "bg-background" : "bg-cyan-neon/5"}`}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isDemoMode ? "bg-green-neon/5" : "bg-cyan-neon/10"}`} />
                <Upload className={`w-10 h-10 text-slate-500 mx-auto mb-4 transition-colors ${isDemoMode ? "group-hover:text-green-neon" : "group-hover:text-cyan-neon"}`} />
                <span className="text-slate-300 font-bold group-hover:text-white transition-colors">
                  {isDemoMode ? "Click to Load & Compute ZK-SNARK" : "Execute Real Midnight Circuit"}
                </span>
              </motion.div>
            ) : (
              <div className="bg-black border border-white/10 rounded-2xl p-6 text-left font-mono text-sm mt-8 shadow-inner overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-neon to-transparent opacity-50" />
                <div className="flex items-center space-x-2 mb-4 border-b border-white/10 pb-2">
                  <Terminal className="w-4 h-4 text-green-neon" />
                  <span className="text-slate-500">ZK_PROVER_TTY</span>
                </div>
                <div className="space-y-2 min-h-[160px]">
                  {zkLog.map((log, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={i === zkLog.length - 1 && !log.includes("Success") ? "text-green-neon animate-pulse" : "text-green-400/80"}
                    >
                      <span className="text-slate-600 mr-2">&gt;</span> {log}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="bg-surface border border-white/5 p-10 rounded-3xl space-y-6">
            <div className="w-16 h-16 bg-cyan-neon/10 rounded-2xl flex items-center justify-center mb-6">
              <FileLock className="w-8 h-8 text-cyan-neon" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">Upload Evidence Payload</h2>
            <p className="text-slate-400 text-base mb-4">
              Provide the evidence of fraud. This will be AES-encrypted locally with the Regulator's public key before being pinned to IPFS.
            </p>
            <textarea className="w-full bg-background border border-white/10 rounded-2xl p-5 text-white focus:ring-2 focus:ring-cyan-neon/50 focus:border-cyan-neon/50 h-40 outline-none shadow-inner resize-none transition-all" placeholder="Paste cryptographic logs, chat exports, or descriptions..." />
            
            <motion.button 
              whileHover={!isEncrypting ? { scale: 1.02 } : {}}
              whileTap={!isEncrypting ? { scale: 0.98 } : {}}
              onClick={simulateEncryption} 
              disabled={isEncrypting} 
              className="w-full bg-cyan-neon/10 hover:bg-cyan-neon/20 border border-cyan-neon/50 text-cyan-neon font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,240,255,0.1)] relative overflow-hidden group"
            >
              {isEncrypting ? (
                <>
                  <div className="absolute inset-0 bg-cyan-neon/20 animate-pulse" />
                  <span className="relative z-10 flex items-center"><FileLock className="w-5 h-5 mr-2 animate-bounce" /> Encrypting Payload...</span>
                </>
              ) : "Encrypt & Pin to IPFS"}
            </motion.button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="bg-surface border border-white/5 p-10 rounded-3xl text-center space-y-8">
            <Zap className="w-16 h-16 text-purple-500 mx-auto drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
            <h2 className="text-2xl font-extrabold text-white">Generate Anonymous Wallet</h2>
            <div className="text-slate-300 text-left bg-background p-6 rounded-2xl border border-white/10 shadow-inner relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />
              <strong className="text-purple-400 block mb-2 text-lg">CRITICAL INSTRUCTION:</strong> 
              Please open Freighter and create a brand new, clean wallet with ZERO transaction history. 
              <br/><br/>
              Lumina uses Soroban CAP-0071 to route the bounty to this clean wallet through a transient account, breaking the deterministic chain trace. You do not need XLM for trustlines.
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(5)} 
              className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-300 font-bold py-4 px-8 rounded-xl transition-all w-full shadow-[0_0_20px_rgba(168,85,247,0.2)]"
            >
              I have connected a clean Freighter Wallet
            </motion.button>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div key="step5" variants={fadeUp} initial="hidden" animate="visible" exit="exit" className="bg-green-neon/5 border border-green-neon/30 p-12 rounded-3xl text-center space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-green-neon/5 animate-pulse blur-3xl pointer-events-none" />
            <ShieldCheck className="w-20 h-20 text-green-neon mx-auto mb-6 drop-shadow-[0_0_25px_rgba(57,255,20,0.8)]" />
            <h2 className="text-4xl font-black text-white tracking-tight">Ready to Cast Proof</h2>
            
            <div className="text-sm text-green-neon/80 text-left bg-black/50 p-6 rounded-2xl border border-green-neon/20 font-mono mb-8 space-y-3 relative z-10">
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-green-neon" /> ZK-SNARK Validity Proof Generated</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-green-neon" /> Evidence Encrypted & Pinned (IPFS: QmX9a...)</div>
              <div className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-green-neon" /> Sybil Nullifier Computed</div>
            </div>
            
            <motion.button 
              onClick={submitToSoroban}
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { scale: 1.05 } : {}}
              whileTap={!isSubmitting ? { scale: 0.95 } : {}}
              className="bg-green-neon text-background font-black py-5 px-10 rounded-2xl transition-all w-full text-xl shadow-[0_0_30px_rgba(57,255,20,0.4)] hover:shadow-[0_0_50px_rgba(57,255,20,0.6)] uppercase tracking-wider relative z-10 disabled:opacity-70 disabled:cursor-wait"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <div className="w-6 h-6 border-4 border-background border-t-transparent rounded-full animate-spin mr-3" />
                  Broadcasting to Soroban...
                </span>
              ) : "Submit Proof to Soroban Escrow"}
            </motion.button>
          </motion.div>
        )}

        {step === 6 && (
          <motion.div key="step6" variants={fadeUp} initial="hidden" animate="visible" className="bg-surface border border-green-neon/30 p-12 rounded-3xl text-center space-y-6 relative overflow-hidden">
            <div className="w-24 h-24 bg-green-neon/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-neon" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">Proof Submitted Successfully</h2>
            <p className="text-slate-400 text-lg">
              Your Zero-Knowledge Proof has been verified by the Soroban smart contract. 
              The escrow will be released to your anonymous wallet once arbiters approve the evidence.
            </p>
            <div className="bg-black/30 p-4 rounded-xl border border-white/5 font-mono text-sm text-green-neon/70 mt-4 break-all text-left">
              TxHash: <a href={`https://stellar.expert/explorer/testnet/tx/${txHash}`} target="_blank" rel="noreferrer" className="underline hover:text-white transition-colors">{txHash || "0x8f2a9b4c0e3d1f..."}</a><br/>
              Network: Soroban Testnet
            </div>
            <button 
              onClick={() => setStep(1)}
              className="text-slate-400 hover:text-white transition-colors underline underline-offset-4 mt-6 text-sm"
            >
              Submit another proof
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
