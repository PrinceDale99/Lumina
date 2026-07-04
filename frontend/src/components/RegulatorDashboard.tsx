import { Shield, Plus } from "lucide-react";

export default function RegulatorDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-8 border-b border-slate-700 pb-4">
        <Shield className="w-8 h-8 text-blue-400" />
        <h2 className="text-2xl font-semibold text-white">Regulator Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-blue-400" /> Create Bounty Escrow
          </h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Target Company Name</label>
              <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Enron Corp" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Target Company Public Key (Registry)</label>
              <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" placeholder="G..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Bounty Amount (USDC/XLM)</label>
              <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="100000" />
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors mt-4">
              Lock Funds & Initialize Bounty
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-lg font-medium text-white mb-4">Active Bounties</h3>
          <div className="space-y-3">
            {[1, 2].map((id) => (
              <div key={id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex justify-between items-center hover:border-slate-600 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-200">Company #{id} Fraud Report</p>
                  <p className="text-xs text-slate-400 mt-1 font-mono">ID: {id}00X...</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-400">50,000 USDC</p>
                  <p className="text-xs text-blue-400 mt-1">Status: Open</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
