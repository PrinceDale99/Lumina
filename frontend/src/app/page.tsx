"use client";
import { useState } from "react";
import RegulatorDashboard from "@/components/RegulatorDashboard";
import WhistleblowerPortal from "@/components/WhistleblowerPortal";

export default function Home() {
  const [view, setView] = useState<"regulator" | "whistleblower">("whistleblower");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-center space-x-4">
        <button 
          onClick={() => setView("regulator")}
          className={`px-6 py-2 rounded-full font-medium transition-all ${view === "regulator" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}
        >
          Regulator / Funder
        </button>
        <button 
          onClick={() => setView("whistleblower")}
          className={`px-6 py-2 rounded-full font-medium transition-all ${view === "whistleblower" ? "bg-green-600 text-white shadow-lg shadow-green-500/20" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}
        >
          Whistleblower Portal
        </button>
      </div>

      <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-sm">
        {view === "regulator" ? <RegulatorDashboard /> : <WhistleblowerPortal />}
      </div>
    </div>
  );
}
