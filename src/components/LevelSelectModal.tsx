import React from 'react';
import { X, Lock, Star, Play } from 'lucide-react';
import { LEVELS } from '../data/levels';
import { UserProgress } from '../types';

interface LevelSelectModalProps {
  progress: UserProgress;
  onSelectLevel: (levelId: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  progress,
  onSelectLevel,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗺️</span>
            <div>
              <h2 className="text-lg font-extrabold text-amber-400">Select Level</h2>
              <p className="text-xs text-slate-400">
                Unlocked {progress.unlockedLevel} / {LEVELS.length} Levels
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Map Grid */}
        <div className="p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1 custom-scrollbar">
          {LEVELS.map((level) => {
            const isUnlocked = level.id <= progress.unlockedLevel;
            const isCurrent = level.id === progress.currentLevel;
            const stars = progress.stars[level.id] || 0;

            return (
              <div
                key={level.id}
                onClick={() => {
                  if (isUnlocked) {
                    onSelectLevel(level.id);
                    onClose();
                  }
                }}
                className={`p-3 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden ${
                  isCurrent
                    ? 'bg-amber-950/60 border-amber-400 ring-2 ring-amber-400/50 shadow-lg scale-[1.02]'
                    : isUnlocked
                    ? 'bg-slate-800/80 border-slate-700 hover:border-slate-500 hover:scale-[1.01]'
                    : 'bg-slate-950/60 border-slate-900 opacity-50 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black px-2 py-0.5 rounded-md bg-slate-900/80 text-amber-300">
                      Lvl {level.id}
                    </span>
                    {isUnlocked ? (
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3].map((starIdx) => (
                          <Star
                            key={starIdx}
                            className={`w-3.5 h-3.5 ${
                              starIdx <= stars
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    ) : (
                      <Lock className="w-4 h-4 text-slate-600" />
                    )}
                  </div>

                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-100 line-clamp-1 mt-1">
                    {level.name}
                  </h3>

                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                    {level.goals[0]?.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-bold">
                  <span className="text-yellow-400">🪙 +{level.rewardCoins}</span>
                  {isUnlocked && (
                    <span className="flex items-center gap-1 text-amber-400 group-hover:translate-x-0.5 transition-transform">
                      Play <Play className="w-3 h-3 fill-amber-400" />
                    </span>
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
