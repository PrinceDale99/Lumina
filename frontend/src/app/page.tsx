"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RegulatorDashboard from "@/components/RegulatorDashboard";
import WhistleblowerPortal from "@/components/WhistleblowerPortal";
import { cn } from "@/lib/utils";

export default function Home() {
  const [view, setView] = useState<"regulator" | "whistleblower">("whistleblower");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-12"
    >
      <div className="flex justify-center">
        <div className="bg-surface border border-white/5 p-1.5 rounded-2xl flex space-x-2 shadow-2xl backdrop-blur-md">
          <button 
            onClick={() => setView("regulator")}
            className={cn(
              "px-8 py-3 rounded-xl font-bold transition-all duration-300 relative overflow-hidden",
              view === "regulator" ? "text-cyan-neon" : "text-slate-400 hover:text-slate-200"
            )}
          >
            {view === "regulator" && (
              <motion.div 
                layoutId="activeTab"
                className="absolute inset-0 bg-cyan-neon/10 border border-cyan-neon/30 rounded-xl"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">Regulator Command</span>
          </button>
          
          <button 
            onClick={() => setView("whistleblower")}
            className={cn(
              "px-8 py-3 rounded-xl font-bold transition-all duration-300 relative overflow-hidden",
              view === "whistleblower" ? "text-green-neon" : "text-slate-400 hover:text-slate-200"
            )}
          >
            {view === "whistleblower" && (
              <motion.div 
                layoutId="activeTab"
                className="absolute inset-0 bg-green-neon/10 border border-green-neon/30 rounded-xl"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">Whistleblower Portal</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
          >
            {view === "regulator" ? <RegulatorDashboard /> : <WhistleblowerPortal />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
