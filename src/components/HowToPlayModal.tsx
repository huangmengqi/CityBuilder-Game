import React from 'react';
import { X, Sparkles, HelpCircle } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-extrabold text-amber-400">How To Play</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 custom-scrollbar text-xs sm:text-sm">
          {/* Rule 1 */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-3.5 space-y-2">
            <h3 className="font-extrabold text-amber-300 flex items-center gap-1.5">
              <span>🧱 1. Merge Matching Buildings</span>
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Drag or tap two identical structures to combine them into the next architectural tier!
            </p>
            <div className="bg-slate-900/90 rounded-xl p-2.5 font-mono text-[11px] text-amber-200 border border-slate-800 flex flex-wrap gap-1 items-center justify-center">
              <span>🧱 Brick</span> + <span>🧱 Brick</span> = <span>🧱 Wall</span>
              <span className="text-slate-500">→</span>
              <span>🏗️ Framework</span>
              <span className="text-slate-500">→</span>
              <span>🛖 Shack</span>
              <span className="text-slate-500">→</span>
              <span>🏠 House</span>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-3.5 space-y-2">
            <h3 className="font-extrabold text-amber-300 flex items-center gap-1.5">
              <span>📦 2. Clear Obstacles & Crates</span>
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Cracking wooden crates or melting frozen ice blocks expands your building lot. Merge tiles next to crates or use the 🔨 Hammer tool to smash them!
            </p>
          </div>

          {/* Rule 3 */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-3.5 space-y-2">
            <h3 className="font-extrabold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>3. Ultimate Goal: Sky City 🌟</span>
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Progress through 15 unique levels to reach the apex of city building: <strong>Sky City 🌟</strong>!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
