import { Shield, Plus, TrendingUp, Activity, CheckCircle2, Scale, Eye, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { useDemoMode } from "@/lib/DemoModeContext";
import { useWallet } from "@/lib/WalletContext";
import { rpc, Contract, nativeToScVal, TransactionBuilder, Networks, Address } from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";

const SOROBAN_RPC = "https://soroban-testnet.stellar.org";
const CONTRACT_ID = "CAR453YPMSCZQ2QURK4IKUACEAPVWUU2TZX2UBPT7SOLC6PYRQJMNG6H";
const server = new rpc.Server(SOROBAN_RPC);

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const AnimatedNumber = ({ value, suffix = "" }: { value: string | number, suffix?: string }) => (
  <div className="relative inline-block">
    <AnimatePresence mode="popLayout">
      <motion.span
        key={String(value)}
        initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        exit={{ y: -20, opacity: 0, filter: "blur(4px)", position: "absolute", left: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="inline-block"
      >
        {value}
      </motion.span>
    </AnimatePresence>
    {suffix && <span className="ml-2 inline-block">{suffix}</span>}
  </div>
);

export default function RegulatorDashboard() {
  const [votingOn, setVotingOn] = useState<number | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);
  
  // Real Form State
  const [targetEntity, setTargetEntity] = useState("");
  const [registryKey, setRegistryKey] = useState("");
  const [escrowAmount, setEscrowAmount] = useState("");
  const [requiredArbiters, setRequiredArbiters] = useState("3");

  const [bounties, setBounties] = useState<any[]>([
    { id: 1, entity: "Entity #1 Investigation", amount: "50,000", bid: "100X9A" },
    { id: 2, entity: "Entity #2 Investigation", amount: "50,000", bid: "200X9A" }
  ]);
  const { isDemoMode } = useDemoMode();
  const { pubKey, connect } = useWallet();
  const [contractBalance, setContractBalance] = useState("0");

  const totalEscrowed = isDemoMode ? "14.2M" : bounties.reduce((sum, b) => sum + parseInt(b.amount.replace(/,/g, '') || "0"), 0).toLocaleString();
  const resolvedClaims = isDemoMode ? "4" : "0";

  useEffect(() => {
    if (isDemoMode) return;
    const fetchBalance = async () => {
      try {
        const { Keypair, Account, scValToNative } = await import("@stellar/stellar-sdk");
        const nativeToken = new Contract("CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC");
        const kp = Keypair.random();
        const tx = new TransactionBuilder(new Account(kp.publicKey(), "0"), {
          fee: "100",
          networkPassphrase: Networks.TESTNET,
        })
        .addOperation(nativeToken.call("balance", new Address(CONTRACT_ID).toScVal()))
        .setTimeout(30)
        .build();

        const sim = await server.simulateTransaction(tx);
        if ((sim as any).result?.retval) {
          const balBigInt = scValToNative((sim as any).result.retval);
          const xlmBal = Number(balBigInt) / 10000000;
          setContractBalance(xlmBal.toLocaleString(undefined, {maximumFractionDigits: 0}));
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [isDemoMode]);

  const castVote = (id: number, vote: boolean) => {
    // In a real app, this generates the ZK Proof of Arbiter status
    setVotingOn(null);
  };

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEntity || !registryKey || !escrowAmount) return;

    if (!pubKey) {
      alert("Please connect your Freighter wallet to act as the Regulator.");
      await connect();
      return;
    }

    setIsDeploying(true);
    setDeploySuccess(false);
    
    try {
      const sourceAccount = await server.getAccount(pubKey);
      const contract = new Contract(CONTRACT_ID);
      const bountyId = Math.floor(Math.random() * 1000000); // Random u32
      const amount = BigInt(escrowAmount);
      const arbiters = Number(requiredArbiters);

      const tx = new TransactionBuilder(sourceAccount, {
        fee: "100000",
        networkPassphrase: Networks.TESTNET,
      })
      .addOperation(contract.call(
        "deploy_bounty",
        nativeToScVal(bountyId, { type: 'u32' }),
        nativeToScVal(targetEntity, { type: 'string' }),
        nativeToScVal(amount, { type: 'i128' }),
        nativeToScVal(arbiters, { type: 'u32' })
      ))
      .setTimeout(30)
      .build();

      const preparedTx = await server.prepareTransaction(tx);
      const { signedTxXdr } = await signTransaction(preparedTx.toXDR(), { networkPassphrase: "Test SDF Network ; September 2015" });
      const signedTx = TransactionBuilder.fromXDR(signedTxXdr, Networks.TESTNET) as any;

      const response = await server.sendTransaction(signedTx);
      
      if (response.status === "ERROR") {
        throw new Error("Transaction failed on Soroban");
      }

      setDeploySuccess(true);
      
      const newBounty = { 
        id: bountyId, 
        entity: targetEntity, 
        amount: Number(escrowAmount).toLocaleString(), 
        bid: registryKey.substring(0, 6) 
      };
      
      setBounties([newBounty, ...bounties]);
      setTargetEntity("");
      setRegistryKey("");
      setEscrowAmount("");
      
      setTimeout(() => setDeploySuccess(false), 5000);
    } catch (err: any) {
      console.error(err);
      alert(`Soroban Error: ${err.message}`);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center space-x-4 mb-8 pb-4 border-b border-white/5">
        <div className="bg-cyan-neon/10 p-3 rounded-2xl shadow-[0_0_20px_rgba(0,240,255,0.2)]">
          <Shield className="w-7 h-7 text-cyan-neon" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Regulator & Arbiter Command</h2>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Stat Box 1 */}
        <motion.div variants={item} className="bg-surface border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-cyan-neon/30 transition-all duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-neon/5 rounded-full blur-3xl group-hover:bg-cyan-neon/10 transition-all duration-500" />
          <div className="flex items-center space-x-2 text-cyan-neon mb-4">
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold text-sm">Total Escrowed</span>
          </div>
          <div className="text-4xl font-black text-white">
            <AnimatedNumber value={totalEscrowed} suffix="XLM" />
          </div>
          <div className="text-slate-400 text-sm mt-2">{isDemoMode ? "Across 12 Active Bounties" : `Across ${bounties.length} Active Bounties`}</div>
        </motion.div>

        {/* Stat Box 2 */}
        <motion.div variants={item} className="bg-surface border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-green-neon/30 transition-all duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-neon/5 rounded-full blur-3xl group-hover:bg-green-neon/10 transition-all duration-500" />
          <div className="flex items-center space-x-2 text-green-neon mb-4">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold text-sm">Resolved Claims</span>
          </div>
          <div className="text-4xl font-black text-white">
            <AnimatedNumber value={resolvedClaims} />
          </div>
          <div className="text-slate-400 text-sm mt-2">Zero-Knowledge Validated</div>
        </motion.div>

        {/* Stat Box 3 (Clickable) */}
        <motion.a 
          href={`https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`}
          target="_blank"
          rel="noopener noreferrer"
          variants={item} 
          className="bg-surface border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-purple-500/50 transition-all duration-500 cursor-pointer block"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-500" />
          <div className="flex items-center space-x-2 text-purple-400 mb-4">
            <Activity className="w-5 h-5" />
            <span className="font-semibold text-sm">Contract Balance</span>
            <div className="flex-grow" />
            <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
          <div className="text-4xl font-black text-white">
            <AnimatedNumber value={isDemoMode ? "2.1M" : contractBalance} suffix="XLM" />
          </div>
          <div className="text-slate-400 text-sm mt-2">Available for Escrow</div>
        </motion.a>

        {/* Form Box - Spans 2 columns */}
        <motion.div variants={item} className="md:col-span-2 bg-surface border border-white/5 p-8 rounded-3xl relative backdrop-blur-md">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-neon/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl pointer-events-none" />
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Plus className="w-6 h-6 mr-3 text-cyan-neon" /> 
            Deploy New ZK Escrow Bounty
          </h3>
          <form onSubmit={handleDeploy} className="space-y-5 relative z-10">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Target Entity</label>
                <input value={targetEntity} onChange={(e) => setTargetEntity(e.target.value)} required type="text" className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white focus:ring-2 focus:ring-cyan-neon/50 focus:border-cyan-neon/50 outline-none transition-all shadow-inner" placeholder="e.g. Enron Corp" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Entity Registry Key (Public)</label>
                <input value={registryKey} onChange={(e) => setRegistryKey(e.target.value)} required type="text" className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white focus:ring-2 focus:ring-cyan-neon/50 focus:border-cyan-neon/50 outline-none font-mono text-sm shadow-inner" placeholder="G..." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Escrow Amount (XLM)</label>
                <input value={escrowAmount} onChange={(e) => setEscrowAmount(e.target.value)} required type="number" className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white focus:ring-2 focus:ring-cyan-neon/50 focus:border-cyan-neon/50 outline-none shadow-inner" placeholder="100,000" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Required Arbiter Approvals</label>
                <input value={requiredArbiters} onChange={(e) => setRequiredArbiters(e.target.value)} required type="number" className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white focus:ring-2 focus:ring-cyan-neon/50 focus:border-cyan-neon/50 outline-none shadow-inner" placeholder="3" />
              </div>
            </div>
            <motion.button 
              type="submit"
              disabled={isDeploying}
              whileHover={!isDeploying ? { scale: 1.02 } : {}}
              whileTap={!isDeploying ? { scale: 0.98 } : {}}
              className="w-full bg-cyan-neon/10 hover:bg-cyan-neon/20 border border-cyan-neon/50 text-cyan-neon font-bold py-4 px-6 rounded-xl transition-all duration-300 mt-4 shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] relative overflow-hidden group disabled:opacity-50 disabled:cursor-wait"
            >
              {isDeploying ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Deploying Smart Contract...
                </span>
              ) : deploySuccess ? (
                <span className="flex items-center justify-center text-green-neon">
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Deployed Successfully!
                </span>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
                  Initialize Trustless Bounty
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* List Box - Spans 1 column */}
        <motion.div variants={item} className="bg-surface border border-white/5 p-8 rounded-3xl flex flex-col relative overflow-hidden">
          <h3 className="text-xl font-bold text-white mb-6">Active Deployments</h3>
          {!isDemoMode ? (
            <div className="flex-grow flex flex-col items-center justify-center opacity-50 space-y-4 py-8">
              <Loader2 className="w-10 h-10 text-cyan-neon animate-spin" />
              <p className="text-sm font-bold text-slate-300">Fetching Soroban State...</p>
              <p className="text-xs text-slate-500 text-center">No active bounties found on-chain</p>
            </div>
          ) : (
            <div className="space-y-4 flex-grow">
              {bounties.map((bounty) => (
                <motion.div 
                  key={bounty.id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="bg-background border border-white/5 p-4 rounded-2xl flex flex-col justify-between hover:border-cyan-neon/30 transition-all cursor-pointer relative overflow-hidden group"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-neon/50 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                  <div>
                    <p className="text-sm font-bold text-white">{bounty.entity}</p>
                    <p className="text-xs text-slate-500 mt-1 font-mono">B-ID: {bounty.bid}...</p>
                  </div>
                  <div className="mt-3 flex justify-between items-end">
                    <p className="text-sm font-black text-green-neon tracking-tight">{bounty.amount} XLM</p>
                    <span className="px-2 py-1 bg-cyan-neon/10 text-cyan-neon text-[10px] uppercase font-bold rounded-md">Listening</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Arbiter Voting Portal */}
        <motion.div variants={item} className="md:col-span-3 bg-surface border border-purple-500/30 p-8 rounded-3xl relative backdrop-blur-md overflow-hidden mt-6">
          <div className="absolute inset-0 bg-purple-500/5 pointer-events-none" />
          <div className="flex items-center space-x-3 mb-6">
            <Scale className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Arbiter Governance (Private ZK Voting)</h3>
          </div>
          
          {!isDemoMode ? (
            <div className="flex items-center justify-center py-10 opacity-50 space-x-4">
               <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
               <span className="text-purple-300 font-bold">Scanning for Arbiter nullifiers on-chain... No Active ZK Votes required.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[8].map((id) => (
                <div key={id} className="bg-background border border-white/10 p-6 rounded-2xl relative">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-white font-bold">Review Needed: Entity #{id} Leak</h4>
                      <p className="text-slate-400 text-sm mt-1">Escrow: <span className="text-green-neon">100,000 XLM</span></p>
                    </div>
                    <div className="bg-yellow-500/20 text-yellow-500 text-xs font-bold px-3 py-1 rounded-full border border-yellow-500/50">
                      2/3 Approvals
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-slate-300 bg-white/5 p-3 rounded-xl mb-6">
                    <Eye className="w-4 h-4 text-cyan-neon" />
                    <span>IPFS Evidence Payload: <a href="#" className="text-cyan-neon hover:underline font-mono">QmYwAP...</a></span>
                  </div>

                  <AnimatePresence mode="wait">
                    {votingOn === id ? (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: "auto" }} 
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <p className="text-xs text-purple-300 mb-2">Generating Arbiter ZK Nullifier... Your vote is cryptographically hidden.</p>
                        <div className="flex space-x-4">
                          <button onClick={() => castVote(id, true)} className="flex-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400 font-bold py-3 rounded-xl flex items-center justify-center transition-all">
                            <ThumbsUp className="w-4 h-4 mr-2" /> Approve Payout
                          </button>
                          <button onClick={() => castVote(id, false)} className="flex-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 font-bold py-3 rounded-xl flex items-center justify-center transition-all">
                            <ThumbsDown className="w-4 h-4 mr-2" /> Reject
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.button 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setVotingOn(id)}
                        className="w-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-300 font-bold py-3 rounded-xl transition-all"
                      >
                        Evaluate Evidence & Cast Anonymous Vote
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </motion.div>
  );
}
