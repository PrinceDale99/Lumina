"use client";
import { useState, useEffect } from "react";
import { 
  StellarWalletsKit, 
  Networks 
} from "@creit.tech/stellar-wallets-kit";
import { defaultModules } from "@creit.tech/stellar-wallets-kit/modules/utils";
import { FREIGHTER_ID } from "@creit.tech/stellar-wallets-kit/modules/freighter";
import { Wallet, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function WalletConnect() {
  const [pubKey, setPubKey] = useState<string | null>(null);

  useEffect(() => {
    // Initialize the kit on the client side
    StellarWalletsKit.init({
      network: Networks.TESTNET,
      selectedWalletId: FREIGHTER_ID,
      modules: defaultModules(),
    });
    
    // Check if we are already connected (optional, but good for UX)
    StellarWalletsKit.getAddress().then(({ address }) => {
      if (address) setPubKey(address);
    }).catch(() => {});
  }, []);

  const handleConnect = async () => {
    try {
      const { address } = await StellarWalletsKit.authModal();
      setPubKey(address);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDisconnect = async () => {
    try {
      await StellarWalletsKit.disconnect();
      setPubKey(null);
    } catch (e) {
      console.error(e);
      setPubKey(null);
    }
  };

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
          <button onClick={handleDisconnect} className="ml-2 text-slate-500 hover:text-red-400 transition-colors p-1">
            <LogOut className="w-4 h-4" />
          </button>
        </motion.div>
      ) : (
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleConnect}
          className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:shadow-[0_0_20px_rgba(57,255,20,0.2)] hover:border-green-neon/50 flex items-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-neon/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
          <Wallet className="w-4 h-4 mr-2 text-green-neon" />
          Connect Wallet
        </motion.button>
      )}
    </>
  );
}
