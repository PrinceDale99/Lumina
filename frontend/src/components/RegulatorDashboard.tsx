import { Shield, Plus, TrendingUp, Activity, CheckCircle2, Scale, Eye, ThumbsUp, ThumbsDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function RegulatorDashboard() {
  const [votingOn, setVotingOn] = useState<number | null>(null);

  const castVote = (id: number, vote: boolean) => {
    // In a real app, this generates the ZK Proof of Arbiter status
    setVotingOn(null);
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
          <div className="text-4xl font-black text-white">$14.2M</div>
          <div className="text-slate-400 text-sm mt-2">Across 12 Active Bounties</div>
        </motion.div>

        {/* Stat Box 2 */}
        <motion.div variants={item} className="bg-surface border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-green-neon/30 transition-all duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-neon/5 rounded-full blur-3xl group-hover:bg-green-neon/10 transition-all duration-500" />
          <div className="flex items-center space-x-2 text-green-neon mb-4">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold text-sm">Resolved Claims</span>
          </div>
          <div className="text-4xl font-black text-white">4</div>
          <div className="text-slate-400 text-sm mt-2">Zero-Knowledge Validated</div>
        </motion.div>

        {/* Stat Box 3 */}
        <motion.div variants={item} className="bg-surface border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-purple-500/30 transition-all duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-all duration-500" />
          <div className="flex items-center space-x-2 text-purple-400 mb-4">
            <Activity className="w-5 h-5" />
            <span className="font-semibold text-sm">Network Status</span>
          </div>
          <div className="text-2xl font-bold text-white flex items-center mt-1">
            <span className="w-3 h-3 rounded-full bg-green-neon animate-pulse mr-3 shadow-[0_0_10px_#39ff14]"></span>
            Stellar Testnet
          </div>
          <div className="text-slate-400 text-sm mt-3 font-mono text-xs">Latency: 24ms</div>
        </motion.div>

        {/* Form Box - Spans 2 columns */}
        <motion.div variants={item} className="md:col-span-2 bg-surface border border-white/5 p-8 rounded-3xl relative backdrop-blur-md">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-neon/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl pointer-events-none" />
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Plus className="w-6 h-6 mr-3 text-cyan-neon" /> 
            Deploy New ZK Escrow Bounty
          </h3>
          <form className="space-y-5 relative z-10">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Target Entity</label>
                <input type="text" className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white focus:ring-2 focus:ring-cyan-neon/50 focus:border-cyan-neon/50 outline-none transition-all shadow-inner" placeholder="e.g. Enron Corp" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Entity Registry Key (Public)</label>
                <input type="text" className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white focus:ring-2 focus:ring-cyan-neon/50 focus:border-cyan-neon/50 outline-none font-mono text-sm shadow-inner" placeholder="G..." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Escrow Amount (USDC)</label>
                <input type="number" className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white focus:ring-2 focus:ring-cyan-neon/50 focus:border-cyan-neon/50 outline-none shadow-inner" placeholder="100,000" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Required Arbiter Approvals</label>
                <input type="number" className="w-full bg-background border border-white/10 rounded-xl p-3.5 text-white focus:ring-2 focus:ring-cyan-neon/50 focus:border-cyan-neon/50 outline-none shadow-inner" placeholder="3" defaultValue={3} />
              </div>
            </div>
            <motion.button 
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-cyan-neon/10 hover:bg-cyan-neon/20 border border-cyan-neon/50 text-cyan-neon font-bold py-4 px-6 rounded-xl transition-all duration-300 mt-4 shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
              Initialize Trustless Bounty
            </motion.button>
          </form>
        </motion.div>

        {/* List Box - Spans 1 column */}
        <motion.div variants={item} className="bg-surface border border-white/5 p-8 rounded-3xl flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6">Active Deployments</h3>
          <div className="space-y-4 flex-grow">
            {[1, 2].map((id) => (
              <motion.div 
                key={id} 
                whileHover={{ scale: 1.02, x: 5 }}
                className="bg-background border border-white/5 p-4 rounded-2xl flex flex-col justify-between hover:border-cyan-neon/30 transition-all cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-neon/50 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                <div>
                  <p className="text-sm font-bold text-white">Entity #{id} Investigation</p>
                  <p className="text-xs text-slate-500 mt-1 font-mono">B-ID: {id}00X9A...</p>
                </div>
                <div className="mt-3 flex justify-between items-end">
                  <p className="text-sm font-black text-green-neon tracking-tight">50,000 USDC</p>
                  <span className="px-2 py-1 bg-cyan-neon/10 text-cyan-neon text-[10px] uppercase font-bold rounded-md">Listening</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Arbiter Voting Portal */}
        <motion.div variants={item} className="md:col-span-3 bg-surface border border-purple-500/30 p-8 rounded-3xl relative backdrop-blur-md overflow-hidden mt-6">
          <div className="absolute inset-0 bg-purple-500/5 pointer-events-none" />
          <div className="flex items-center space-x-3 mb-6">
            <Scale className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Arbiter Governance (Private ZK Voting)</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[8].map((id) => (
              <div key={id} className="bg-background border border-white/10 p-6 rounded-2xl relative">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-white font-bold">Review Needed: Entity #{id} Leak</h4>
                    <p className="text-slate-400 text-sm mt-1">Escrow: <span className="text-green-neon">100,000 USDC</span></p>
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
        </motion.div>

      </div>
    </motion.div>
  );
}
