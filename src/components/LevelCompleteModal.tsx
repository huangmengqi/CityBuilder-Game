import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, Play, RotateCcw, Map } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface LevelCompleteModalProps {
  levelId: number;
  score: number;
  rewardCoins: number;
  rewardGems: number;
  unlockedNextTier?: number;
  onNextLevel: () => void;
  onReplay: () => void;
  onLevelSelect: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  levelId,
  score,
  rewardCoins,
  rewardGems,
  onNextLevel,
  onReplay,
  onLevelSelect,
}) => {
  useEffect(() => {
    soundEngine.playVictory();
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-amber-500/80 rounded-3xl w-full max-w-sm p-6 shadow-2xl text-slate-100 text-center animate-in fade-in zoom-in-95 duration-300">
        {/* Victory Header */}
        <div className="text-4xl mb-1">🏆</div>
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
          LEVEL COMPLETE!
        </h2>
        <p className="text-xs text-amber-200 font-semibold mt-0.5">Level {levelId} Cleared</p>

        {/* 3 Stars */}
        <div className="flex items-center justify-center gap-2 my-4">
          {[1, 2, 3].map((starIdx) => (
            <Star
              key={starIdx}
              className="w-10 h-10 text-yellow-400 fill-yellow-400 animate-bounce drop-shadow-lg"
              style={{ animationDelay: `${starIdx * 150}ms` }}
            />
          ))}
        </div>

        {/* Rewards Box */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 my-4 space-y-2 text-sm font-bold">
          <div className="flex justify-between items-center text-slate-300">
            <span>Score Achieved</span>
            <span className="text-amber-400">{score.toLocaleString()} Pts</span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span>Coins Earned</span>
            <span className="text-yellow-300">🪙 +{rewardCoins}</span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span>Gems Earned</span>
            <span className="text-cyan-300">💎 +{rewardGems}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-5">
          <button
            onClick={onNextLevel}
            className="w-full py-3 rounded-xl font-black text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 shadow-lg shadow-amber-900/40 flex items-center justify-center gap-2 text-base transition-all transform active:scale-95"
          >
            <span>NEXT LEVEL</span>
            <Play className="w-5 h-5 fill-slate-950" />
          </button>

          <div className="flex gap-2">
            <button
              onClick={onReplay}
              className="flex-1 py-2.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center gap-1.5 text-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Replay</span>
            </button>

            <button
              onClick={onLevelSelect}
              className="flex-1 py-2.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center gap-1.5 text-xs transition-colors"
            >
              <Map className="w-4 h-4" />
              <span>Level Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
