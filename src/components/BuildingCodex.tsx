import React from 'react';
import { X, Lock, Sparkles } from 'lucide-react';
import { BUILDINGS } from '../data/buildings';

interface BuildingCodexProps {
  unlockedTiers: number[];
  onClose: () => void;
}

export const BuildingCodex: React.FC<BuildingCodexProps> = ({ unlockedTiers, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <div>
              <h2 className="text-lg font-extrabold text-amber-400">Architect Codex</h2>
              <p className="text-xs text-slate-400">Building Progression & Evolution Lore</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Building Grid */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
          {Object.values(BUILDINGS).map((item) => {
            const isUnlocked = unlockedTiers.includes(item.tier);

            return (
              <div
                key={item.tier}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                    : 'bg-slate-950/60 border-slate-900 opacity-60'
                }`}
              >
                {/* Emoji / Icon Box */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 border ${
                    isUnlocked
                      ? `bg-gradient-to-br ${item.gradient}`
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                  }`}
                >
                  {isUnlocked ? item.emoji : <Lock className="w-6 h-6 text-slate-600" />}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-100 flex items-center gap-1.5">
                      {isUnlocked ? item.name : '??? Locked'}
                      {item.tier === 10 && isUnlocked && (
                        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                      )}
                    </h3>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-700/80 text-amber-300">
                      Tier {item.tier}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                    {isUnlocked ? item.description : 'Merge lower tier buildings to unlock this architecture.'}
                  </p>

                  {/* Formula & Rewards */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[11px] font-medium text-slate-400">
                    <span>
                      {item.tier === 1
                        ? 'Spawned via Generator'
                        : `Recipe: 2x Tier ${item.tier - 1} ${BUILDINGS[item.tier - 1]?.emoji || ''}`}
                    </span>
                    {isUnlocked && (
                      <span className="text-yellow-400 font-bold">
                        🪙 +{item.value} / +{item.score} Pts
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
