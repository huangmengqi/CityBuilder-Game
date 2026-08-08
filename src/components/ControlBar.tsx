import React from 'react';
import { Zap, Hammer, Magnet, Shuffle, Sparkles } from 'lucide-react';

interface ControlBarProps {
  energy: number;
  maxEnergy: number;
  coins: number;
  gems: number;
  isBoardFull: boolean;
  activeTool: 'hammer' | 'rainbow' | null;
  onSpawnBrick: () => void;
  onUseHammer: () => void;
  onUseMagnet: () => void;
  onUseShuffle: () => void;
  onUseRainbow: () => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  energy,
  coins,
  gems,
  isBoardFull,
  activeTool,
  onSpawnBrick,
  onUseHammer,
  onUseMagnet,
  onUseShuffle,
  onUseRainbow,
}) => {
  return (
    <div className="w-full max-w-md mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-xl mt-2 select-none">
      {/* Primary Spawn Brick Button */}
      <button
        onClick={onSpawnBrick}
        disabled={energy <= 0 || isBoardFull}
        className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg transition-all transform active:scale-95 border ${
          energy <= 0 || isBoardFull
            ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-amber-95 border-amber-300/50 shadow-amber-900/30'
        }`}
      >
        <span className="text-2xl">🧱</span>
        <span>
          {isBoardFull ? 'BOARD FULL!' : energy <= 0 ? 'NO ENERGY!' : 'SPAWN BRICK'}
        </span>
        {energy > 0 && !isBoardFull && (
          <div className="flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-lg text-xs text-amber-200 ml-1">
            <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>-1</span>
          </div>
        )}
      </button>

      {/* Power-ups Row */}
      <div className="grid grid-cols-4 gap-2 mt-2.5">
        {/* Hammer */}
        <button
          onClick={onUseHammer}
          className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-xs font-bold ${
            activeTool === 'hammer'
              ? 'bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-400'
              : coins >= 50
              ? 'bg-slate-800/80 border-slate-700 hover:border-slate-500 text-slate-200 active:scale-95'
              : 'bg-slate-900 border-slate-800 text-slate-600'
          }`}
        >
          <Hammer className={`w-4 h-4 mb-1 ${activeTool === 'hammer' ? 'text-rose-400 animate-bounce' : 'text-amber-400'}`} />
          <span>Demolish</span>
          <span className="text-[10px] font-normal text-yellow-400">🪙 50</span>
        </button>

        {/* Magnet */}
        <button
          onClick={onUseMagnet}
          disabled={coins < 80}
          className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-xs font-bold ${
            coins >= 80
              ? 'bg-slate-800/80 border-slate-700 hover:border-slate-500 text-slate-200 active:scale-95'
              : 'bg-slate-900 border-slate-800 text-slate-600'
          }`}
        >
          <Magnet className="w-4 h-4 mb-1 text-sky-400" />
          <span>Auto Merge</span>
          <span className="text-[10px] font-normal text-yellow-400">🪙 80</span>
        </button>

        {/* Shuffle */}
        <button
          onClick={onUseShuffle}
          disabled={coins < 40}
          className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-xs font-bold ${
            coins >= 40
              ? 'bg-slate-800/80 border-slate-700 hover:border-slate-500 text-slate-200 active:scale-95'
              : 'bg-slate-900 border-slate-800 text-slate-600'
          }`}
        >
          <Shuffle className="w-4 h-4 mb-1 text-emerald-400" />
          <span>Shuffle</span>
          <span className="text-[10px] font-normal text-yellow-400">🪙 40</span>
        </button>

        {/* Rainbow Wildcard */}
        <button
          onClick={onUseRainbow}
          disabled={gems < 10 && coins < 150}
          className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-xs font-bold ${
            gems >= 10 || coins >= 150
              ? 'bg-slate-800/80 border-slate-700 hover:border-slate-500 text-slate-200 active:scale-95'
              : 'bg-slate-900 border-slate-800 text-slate-600'
          }`}
        >
          <Sparkles className="w-4 h-4 mb-1 text-pink-400" />
          <span>Wildcard</span>
          <span className="text-[10px] font-normal text-cyan-300">💎 10</span>
        </button>
      </div>
    </div>
  );
};
