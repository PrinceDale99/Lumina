"use client";
import { Wallet, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useWallet } from "@/lib/WalletContext";

export default function WalletConnect() {
  const { pubKey, connect, disconnect } = useWallet();

  return (
    <>
      {pubKey ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center space-x-3 bg-surface border border-white/10 px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(57,255,20,0.1)]"
        >
          <div className="w-2 h-2 rounded-full bg-green-neon animate-pulse" />
          <Wallet className="w-4 h-4 text-green-neon" />
          <span className="text-sm font-mono text-slate-300">
            {pubKey.substring(0, 4)}...{pubKey.substring(pubKey.length - 4)}
          </span>
          <button onClick={disconnect} className="ml-2 text-slate-500 hover:text-red-400 transition-colors p-1">
            <LogOut className="w-4 h-4" />
          </button>
        </motion.div>
      ) : (
        <div className="flex space-x-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => connect('freighter')}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 hover:shadow-[0_0_20px_rgba(57,255,20,0.2)] hover:border-green-neon/50 flex items-center"
          >
            <Wallet className="w-4 h-4 mr-2 text-green-neon" />
            Freighter
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => connect('lace')}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:border-cyan-neon/50 flex items-center"
          >
            <Wallet className="w-4 h-4 mr-2 text-cyan-neon" />
            Lace
          </motion.button>
        </div>
    </>
  );
}
