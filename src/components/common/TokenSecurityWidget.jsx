import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, KeyRound, Clock, AlertTriangle, Eye, X } from 'lucide-react';

const TokenSecurityWidget = () => {
  const { token, decodedToken, timeRemaining, forceExpire, isAuthenticated } = useAuth();
  const [showInspector, setShowInspector] = useState(false);

  if (!isAuthenticated && !token) return null;

  return (
    <>
      {/* Floating Status Pill */}
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2">
        <div className="bg-slate-900 text-white rounded-full px-4 py-2 shadow-2xl border border-slate-700 flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-bold">
            <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Bearer Token:</span>
            <span className="text-emerald-400 font-mono">ACTIVE</span>
          </div>

          {timeRemaining !== null && (
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[11px] font-bold ${
              timeRemaining > 20
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-rose-500/20 text-rose-300 animate-pulse'
            }`}>
              <Clock className="w-3 h-3" />
              <span>{timeRemaining}s</span>
            </div>
          )}

          <button
            onClick={() => setShowInspector(true)}
            className="text-[11px] font-bold text-indigo-300 hover:text-white cursor-pointer underline"
          >
            Inspect JWT
          </button>

          <button
            onClick={forceExpire}
            className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full hover:bg-amber-500/30 cursor-pointer"
            title="Expire token to test 401 response handling"
          >
            Force Expire (401)
          </button>
        </div>
      </div>

      {/* JWT Inspector Modal */}
      {showInspector && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <h4 className="font-bold text-sm">JWT Token Security Inspector</h4>
              </div>
              <button
                onClick={() => setShowInspector(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                  Raw Bearer Token (Authorization Header):
                </span>
                <p className="bg-slate-800 p-2.5 rounded-xl text-[10px] text-indigo-300 break-all select-all">
                  {token}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                  Decoded JWT Claims (Payload):
                </span>
                <pre className="bg-slate-800 p-2.5 rounded-xl text-[10px] text-emerald-300 overflow-x-auto">
                  {JSON.stringify(decodedToken, null, 2)}
                </pre>
              </div>

              <div className="p-3 bg-indigo-950/60 border border-indigo-900 rounded-xl text-[11px] text-indigo-200 font-sans">
                <strong>Axios Request Interceptor:</strong> Automatically adds <code className="text-white">Authorization: Bearer &lt;token&gt;</code> to all protected learning API requests.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TokenSecurityWidget;
