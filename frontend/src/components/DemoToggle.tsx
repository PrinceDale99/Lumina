"use client";
import { useDemoMode } from "@/lib/DemoModeContext";
import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck } from "lucide-react";

export default function DemoToggle() {
  const { isDemoMode, toggleDemoMode } = useDemoMode();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={toggleDemoMode}
        className={`relative flex items-center h-8 w-32 rounded-full p-1 transition-colors duration-300 ${
          isDemoMode ? "bg-amber-500/20 border border-amber-500/50" : "bg-cyan-neon/20 border border-cyan-neon/50"
        }`}
      >
        <motion.div
          className={`absolute flex items-center justify-center h-6 w-14 rounded-full shadow-md ${
            isDemoMode ? "bg-amber-500" : "bg-cyan-neon"
          }`}
          layout
          initial={false}
          animate={{
            x: isDemoMode ? 0 : 64,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {isDemoMode ? (
            <span className="text-[10px] font-bold text-amber-950 flex items-center">
              <ShieldAlert className="w-3 h-3 mr-1" /> DEMO
            </span>
          ) : (
            <span className="text-[10px] font-bold text-cyan-950 flex items-center">
              <ShieldCheck className="w-3 h-3 mr-1" /> REAL
            </span>
          )}
        </motion.div>
        
        <div className="w-full flex justify-between px-2 pointer-events-none text-[10px] font-bold tracking-wider">
          <span className={`${isDemoMode ? "opacity-0" : "opacity-50 text-amber-500"}`}>DEMO</span>
          <span className={`${isDemoMode ? "opacity-50 text-cyan-neon" : "opacity-0"}`}>REAL</span>
        </div>
      </button>
    </div>
  );
}
