import React from 'react';
import { X, Zap, Hammer, Magnet, Sparkles } from 'lucide-react';
import { UserProgress } from '../types';

interface ShopModalProps {
  progress: UserProgress;
  onBuyEnergy: (coinsCost: number, gemsCost: number) => void;
  onBuyGemsCoins: (gemAmount: number, coinGain: number) => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  progress,
  onBuyEnergy,
  onBuyGemsCoins,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <div>
              <h2 className="text-lg font-extrabold text-amber-400">Architect Supply Shop</h2>
              <p className="text-xs text-slate-400">Refill Energy & Boosters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resources Summary */}
        <div className="bg-slate-950 p-3 flex items-center justify-around border-b border-slate-800 text-sm font-extrabold">
          <div className="flex items-center gap-1.5 text-amber-300">
            <Zap className="w-4 h-4 fill-amber-400" />
            <span>Energy: {progress.energy}/{progress.maxEnergy}</span>
          </div>
          <div className="flex items-center gap-1.5 text-yellow-300">
            <span>🪙 {progress.coins.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-300">
            <span>💎 {progress.gems.toLocaleString()}</span>
          </div>
        </div>

        {/* Offers list */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
          {/* Energy Refill */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
                <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-100">Full Energy Refill</h3>
                <p className="text-xs text-slate-400">+20 Energy to spawn bricks</p>
              </div>
            </div>

            <button
              onClick={() => onBuyEnergy(100, 0)}
              disabled={progress.coins < 100}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                progress.coins >= 100
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 border-amber-300 shadow-md'
                  : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              🪙 100
            </button>
          </div>

          {/* Gems to Coins 1 */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 border border-yellow-400/40 flex items-center justify-center text-2xl">
                🪙
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-100">Coin Sack</h3>
                <p className="text-xs text-slate-400">+1,000 Gold Coins</p>
              </div>
            </div>

            <button
              onClick={() => onBuyGemsCoins(20, 1000)}
              disabled={progress.gems < 20}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                progress.gems >= 20
                  ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 border-cyan-300 shadow-md'
                  : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              💎 20
            </button>
          </div>

          {/* Gems to Coins 2 */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 border border-yellow-400/40 flex items-center justify-center text-2xl">
                💰
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-100">Treasury Vault</h3>
                <p className="text-xs text-slate-400">+5,000 Gold Coins</p>
              </div>
            </div>

            <button
              onClick={() => onBuyGemsCoins(80, 5000)}
              disabled={progress.gems < 80}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                progress.gems >= 80
                  ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 border-cyan-300 shadow-md'
                  : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              💎 80
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
