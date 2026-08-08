import React from 'react';
import { X, Trophy, CheckCircle2 } from 'lucide-react';
import { Achievement } from '../types';

interface AchievementsModalProps {
  achievements: Achievement[];
  onClaim: (id: string) => void;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  achievements,
  onClaim,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <div>
              <h2 className="text-lg font-extrabold text-amber-400">Architect Quests</h2>
              <p className="text-xs text-slate-400">Earn Coins & Gems for Milestones</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quests List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
          {achievements.map((item) => {
            const isReady = item.progress >= item.target && !item.claimed;

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                  item.claimed
                    ? 'bg-slate-950/60 border-slate-900 opacity-60'
                    : isReady
                    ? 'bg-amber-950/40 border-amber-500/80 shadow-md ring-1 ring-amber-400/40'
                    : 'bg-slate-800/80 border-slate-700'
                }`}
              >
                <div className="text-3xl flex-shrink-0">{item.icon}</div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-sm text-slate-100 truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 truncate">{item.description}</p>

                  <div className="flex items-center gap-2 mt-1.5 text-xs font-bold">
                    <span className="text-yellow-400">🪙 +{item.rewardCoins}</span>
                    <span className="text-cyan-300">💎 +{item.rewardGems}</span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {item.claimed ? (
                    <div className="flex items-center gap-1 text-xs text-slate-500 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Done</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onClaim(item.id)}
                      disabled={!isReady}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
                        isReady
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-300 animate-pulse shadow-md'
                          : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {isReady ? 'Claim!' : `${item.progress}/${item.target}`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
