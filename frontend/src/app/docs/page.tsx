"use client";
import Link from "next/link";
import { ShieldCheck, Search, DollarSign, Lock, Zap } from "lucide-react";
import { motion, Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DocsPage() {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto space-y-16 pb-20 pt-8"
    >
      <motion.div variants={fadeUp} className="space-y-6">
        <Link href="/" className="text-cyan-neon hover:text-white transition-colors inline-flex items-center space-x-2 font-bold tracking-wide uppercase text-sm mb-4">
          <span className="text-xl">&larr;</span> <span>Return to Terminal</span>
        </Link>
        <h1 className="text-5xl sm:text-6xl font-black tracking-tighter text-white">
          System Architecture
        </h1>
        <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
          Lumina is a decentralized, zero-knowledge financial escrow designed to protect whistleblowers. By combining Midnight Compact ZK-SNARKs with Midnight smart contracts (Compact), we ensure that your identity remains cryptographically shielded from retaliation.
        </p>
      </motion.div>

      <motion.div variants={fadeUp} className="grid gap-8 md:grid-cols-2">
        <div className="bg-surface border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-red-500/30 transition-all duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-all duration-500" />
          <div className="bg-red-500/10 w-14 h-14 flex items-center justify-center rounded-2xl mb-6 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <Lock className="w-7 h-7 text-red-500" />
          </div>
          <h3 className="text-2xl font-black text-white mb-3 tracking-tight">The Vulnerability</h3>
          <p className="text-slate-400 leading-relaxed">
            Whistleblowers face significant risk. Claiming a financial bounty on a transparent blockchain exposes payouts to corporate investigators through chain-analysis, rendering conventional bounties unsafe.
          </p>
        </div>

        <div className="bg-surface border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-green-neon/30 transition-all duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-neon/5 rounded-full blur-3xl group-hover:bg-green-neon/10 transition-all duration-500" />
          <div className="bg-green-neon/10 w-14 h-14 flex items-center justify-center rounded-2xl mb-6 shadow-[0_0_15px_rgba(57,255,20,0.2)]">
            <ShieldCheck className="w-7 h-7 text-green-neon" />
          </div>
          <h3 className="text-2xl font-black text-white mb-3 tracking-tight">The Lumina Defense</h3>
          <p className="text-slate-400 leading-relaxed">
            Lumina bridges the gap. It verifies your corporate identity locally using Zero-Knowledge proofs. Your identity never leaves your device, and funds are escrowed to an entirely unconnected wallet.
          </p>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="space-y-12 mt-20 relative before:absolute before:inset-0 before:bg-gradient-to-b before:from-cyan-neon/5 before:to-transparent before:rounded-3xl before:-z-10 p-8 border border-white/5 rounded-3xl">
        <h2 className="text-4xl font-black text-white tracking-tight">The Execution Flow</h2>
        
        <div className="relative border-l-2 border-white/10 ml-6 space-y-16 py-4">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative pl-10"
          >
            <div className="absolute -left-[1.05rem] top-1 w-8 h-8 rounded-full bg-background border-2 border-cyan-neon flex items-center justify-center font-black text-sm text-cyan-neon shadow-[0_0_15px_rgba(0,240,255,0.5)]">
              1
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Local ZK-Proof Generation</h3>
            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
              Using your corporate credentials (such as an employment hash), your local browser uses the Midnight Compact circuit to generate a ZK-SNARK. This proof mathematically verifies you are an eligible employee without revealing your ID.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1, type: "spring" }}
            className="relative pl-10"
          >
            <div className="absolute -left-[1.05rem] top-1 w-8 h-8 rounded-full bg-background border-2 border-purple-500 flex items-center justify-center font-black text-sm text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              2
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Bounty Escrow Request</h3>
            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
              The generated proof, along with a newly generated, entirely blank "destination wallet" address, is submitted to the Lumina smart contract on Stellar. The contract acts as a trustless escrow agent.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className="relative pl-10"
          >
            <div className="absolute -left-[1.05rem] top-1 w-8 h-8 rounded-full bg-background border-2 border-green-neon flex items-center justify-center font-black text-sm text-green-neon shadow-[0_0_15px_rgba(57,255,20,0.5)]">
              3
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Untraceable Payout</h3>
            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
              Upon verification, the contract leverages Stellar's CAP-0071 delegation pattern to authorize the transfer from the funding pool directly into your clean destination wallet. The link between your corporate identity and your new wallet is forever mathematically hidden.
            </p>
          </motion.div>

        </div>
      </motion.div>
    </motion.div>
  );
}
