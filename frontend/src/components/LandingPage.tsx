"use client";
import { motion } from "framer-motion";
import { Shield, Zap, Lock, Terminal, ArrowRight, Wallet } from "lucide-react";
import { useWallet } from "@/lib/WalletContext";

export default function LandingPage() {
  const { connect } = useWallet();

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-24">
      {/* Hero Section */}
      <div className="text-center space-y-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-neon/20 rounded-full blur-[100px] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-neon via-white to-green-neon">
              Lumina
            </span>
          </h1>
          <p className="text-2xl text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed">
            Cryptographically Shielded Whistleblower Escrow on the Midnight Network.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8 relative z-10"
        >
          <button 
            onClick={connect}
            className="group bg-cyan-neon text-background font-black py-4 px-10 rounded-2xl transition-all text-xl shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_50px_rgba(0,240,255,0.6)] flex items-center hover:scale-105"
          >
            <Wallet className="w-6 h-6 mr-3" />
            Connect Wallet
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-surface border border-white/5 p-8 rounded-3xl relative overflow-hidden group hover:border-cyan-neon/30 transition-colors duration-500"
        >
          <div className="absolute inset-0 bg-cyan-neon/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Lock className="w-12 h-12 text-cyan-neon mb-6" />
          <h3 className="text-xl font-bold text-white mb-3">Zero-Knowledge Proofs</h3>
          <p className="text-slate-400 leading-relaxed">
            Prove your identity cryptographically without ever revealing it. Lumina uses the Midnight Network's Compact language to synthesize ZK-SNARKs locally in your browser.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-surface border border-white/5 p-8 rounded-3xl relative overflow-hidden group hover:border-purple-500/30 transition-colors duration-500"
        >
          <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Terminal className="w-12 h-12 text-purple-400 mb-6" />
          <h3 className="text-xl font-bold text-white mb-3">Midnight Smart Contracts</h3>
          <p className="text-slate-400 leading-relaxed">
            Bounties are locked securely on the Midnight network. When a valid ZK-Proof is submitted, the Compact contract automatically routes the payout.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-surface border border-white/5 p-8 rounded-3xl relative overflow-hidden group hover:border-green-neon/30 transition-colors duration-500"
        >
          <div className="absolute inset-0 bg-green-neon/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Shield className="w-12 h-12 text-green-neon mb-6" />
          <h3 className="text-xl font-bold text-white mb-3">Deterministic Anonymity</h3>
          <p className="text-slate-400 leading-relaxed">
            By leveraging CAP-0071, transient accounts route the payouts anonymously, severing the link between the whistleblower's actual wallet and the source.
          </p>
        </motion.div>
      </div>
      
      {/* How it Works / Instructions */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-surface border border-white/10 rounded-3xl p-10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-neon/10 rounded-full blur-[80px]" />
        <h2 className="text-3xl font-extrabold text-white mb-8 relative z-10 flex items-center">
          <Zap className="w-8 h-8 text-cyan-neon mr-4" /> 
          How it Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          <div className="space-y-6">
            <div className="flex">
              <div className="w-12 h-12 bg-cyan-neon/10 rounded-2xl flex items-center justify-center font-black text-cyan-neon mr-4 flex-shrink-0">1</div>
              <div>
                <h4 className="text-white font-bold text-lg mb-2">Connect Your Wallet</h4>
                <p className="text-slate-400">Click the button above or in the navigation bar to connect your Stellar Freighter wallet. You must be connected to access the portals.</p>
              </div>
            </div>
            <div className="flex">
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center font-black text-purple-400 mr-4 flex-shrink-0">2</div>
              <div>
                <h4 className="text-white font-bold text-lg mb-2">Regulator Defines Escrow</h4>
                <p className="text-slate-400">Regulators lock tDUST bounties into a Midnight Compact contract aimed at specific entities (like Enron Corp).</p>
              </div>
            </div>
            <div className="flex">
              <div className="w-12 h-12 bg-green-neon/10 rounded-2xl flex items-center justify-center font-black text-green-neon mr-4 flex-shrink-0">3</div>
              <div>
                <h4 className="text-white font-bold text-lg mb-2">Whistleblower Generates ZK-Proof</h4>
                <p className="text-slate-400">The whistleblower inputs their valid corporate credential. Lumina mathematically proves they are an employee via Midnight without exposing their name.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-background border border-white/10 rounded-2xl p-6 font-mono text-sm text-slate-300 shadow-inner flex flex-col justify-center">
            <p className="text-green-neon mb-4">/* Cryptographic Security Model */</p>
            <p>1. User loads local credential</p>
            <p>2. <span className="text-cyan-neon">pureCircuits.verifyEmployee()</span> validates locally</p>
            <p>3. Circuit generates SNARK <span className="text-purple-400">Proof[A,B,C]</span></p>
            <p>4. IPFS Evidence is pinned</p>
            <p>5. Midnight Compact verifies ZK Relayer & Arbiters</p>
            <p>6. <span className="text-cyan-neon">Payout =</span> SUCCESS</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
