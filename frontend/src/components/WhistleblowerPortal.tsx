import { AlertTriangle, Upload, FileLock, ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";

export default function WhistleblowerPortal() {
  const [step, setStep] = useState(1);
  const [isEncrypting, setIsEncrypting] = useState(false);

  const simulateEncryption = () => {
    setIsEncrypting(true);
    setTimeout(() => {
      setIsEncrypting(false);
      setStep(4);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-slate-700 -z-10"></div>
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${step >= s ? "bg-green-900 border-green-neon text-green-neon" : "bg-slate-800 border-slate-600 text-slate-500"}`}>
            {s}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-xl text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto animate-pulse" />
          <h2 className="text-xl font-bold text-red-200">CRITICAL SECURITY WARNING</h2>
          <p className="text-red-300 text-sm">
            Before proceeding, ensure you are using a VPN or the Tor network. Do not use a corporate network or device. This portal will generate a Zero-Knowledge Proof locally on your machine.
          </p>
          <button onClick={() => setStep(2)} className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors mt-4">
            I am secured. Proceed.
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 text-center space-y-4">
          <ShieldCheck className="w-12 h-12 text-green-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Local Credential Processing</h2>
          <p className="text-slate-400 text-sm">
            Upload your digitally signed corporate badge/credential. <br/>
            <strong className="text-green-400">Your credential NEVER leaves this device.</strong> The Midnight Compact prover runs entirely in your browser.
          </p>
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 hover:border-green-400 transition-colors cursor-pointer bg-slate-900/50 mt-6" onClick={() => setStep(3)}>
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <span className="text-slate-300 font-medium">Click to Load Credential Locally</span>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
          <FileLock className="w-8 h-8 text-blue-400 mb-2" />
          <h2 className="text-xl font-bold text-white">Upload Evidence Payload</h2>
          <p className="text-slate-400 text-sm mb-4">
            Provide the evidence of fraud. This will be encrypted with the Regulator's public key before being uploaded to IPFS.
          </p>
          <textarea className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 h-32 outline-none" placeholder="Describe the fraud or paste links/data..." />
          
          <button onClick={simulateEncryption} disabled={isEncrypting} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
            {isEncrypting ? (
              <span className="animate-pulse flex items-center"><FileLock className="w-4 h-4 mr-2" /> Encrypting Payload...</span>
            ) : "Encrypt & Pin to IPFS"}
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 text-center space-y-6">
          <Zap className="w-12 h-12 text-yellow-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Generate Anonymous Wallet</h2>
          <p className="text-slate-400 text-sm text-left bg-slate-900 p-4 rounded-lg border border-slate-800">
            <strong>CRITICAL:</strong> Please open Freighter and create a brand new, clean wallet with ZERO transaction history. 
            <br/><br/>
            Lumina uses Soroban CAP-0071 to route the bounty to this clean wallet through a transient account, breaking the deterministic chain trace. You do not need XLM for trustlines.
          </p>
          <button onClick={() => setStep(5)} className="bg-slate-700 hover:bg-slate-600 text-white border border-slate-500 font-semibold py-3 px-6 rounded-lg transition-colors w-full">
            I have connected a clean Freighter Wallet
          </button>
        </div>
      )}

      {step === 5 && (
        <div className="bg-green-900/20 border border-green-500/50 p-8 rounded-xl text-center space-y-4">
          <ShieldCheck className="w-16 h-16 text-green-neon mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">Ready to Cast Proof</h2>
          <div className="text-sm text-slate-300 text-left bg-slate-900 p-4 rounded-lg border border-slate-800 font-mono mb-6">
            ✓ ZK-SNARK Validity Proof Generated<br/>
            ✓ Evidence Encrypted & Pinned (IPFS: QmX...)<br/>
            ✓ Sybil Nullifier Computed
          </div>
          <button className="bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20 font-bold py-4 px-8 rounded-xl transition-all w-full text-lg animate-pulse">
            Submit Proof to Soroban Escrow
          </button>
        </div>
      )}
    </div>
  );
}
