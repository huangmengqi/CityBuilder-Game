import React from 'react';
import { Volume2, VolumeX, Map, BookOpen, ShoppingBag, Trophy, HelpCircle, Zap } from 'lucide-react';
import { UserProgress, SoundSettings } from '../types';

interface HeaderProps {
  progress: UserProgress;
  currentLevelName: string;
  soundSettings: SoundSettings;
  onToggleSound: () => void;
  onOpenLevelSelect: () => void;
  onOpenCodex: () => void;
  onOpenShop: () => void;
  onOpenAchievements: () => void;
  onOpenHowToPlay: () => void;
  onOpenAudioSettings: () => void;
  energyRechargeTime: number; // in seconds until next +1 energy
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  currentLevelName,
  soundSettings,
  onOpenLevelSelect,
  onOpenCodex,
  onOpenShop,
  onOpenAchievements,
  onOpenHowToPlay,
  onOpenAudioSettings,
  energyRechargeTime,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 px-3 py-2 shadow-md sticky top-0 z-30">
      {/* Top row: Level Badge & Stats */}
      <div className="max-w-xl mx-auto flex items-center justify-between gap-2">
        {/* Level Indicator */}
        <button
          onClick={onOpenLevelSelect}
          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-50 font-bold px-2.5 py-1 rounded-xl shadow-sm text-xs sm:text-sm transition-all transform active:scale-95 border border-amber-400/40"
        >
          <Map className="w-4 h-4 text-amber-200" />
          <span>Lvl {progress.currentLevel}</span>
        </button>

        {/* Resources Bar */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium">
          {/* Energy */}
          <div
            onClick={onOpenShop}
            className="flex items-center gap-1 bg-slate-800/90 border border-amber-500/30 px-2 py-1 rounded-lg cursor-pointer hover:border-amber-400/60 transition-colors"
            title="Energy (Used to spawn bricks)"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <span className="font-bold text-amber-300">
              {progress.energy}/{progress.maxEnergy}
            </span>
            {progress.energy < progress.maxEnergy && (
              <span className="text-[10px] text-slate-400 hidden sm:inline ml-0.5">
                ({formatTime(energyRechargeTime)})
              </span>
            )}
          </div>

          {/* Coins */}
          <div
            onClick={onOpenShop}
            className="flex items-center gap-1 bg-slate-800/90 border border-yellow-500/30 px-2 py-1 rounded-lg cursor-pointer hover:border-yellow-400/60 transition-colors"
            title="Coins"
          >
            <span className="text-sm">🪙</span>
            <span className="font-bold text-yellow-300">
              {progress.coins.toLocaleString()}
            </span>
          </div>

          {/* Gems */}
          <div
            onClick={onOpenShop}
            className="flex items-center gap-1 bg-slate-800/90 border border-cyan-500/30 px-2 py-1 rounded-lg cursor-pointer hover:border-cyan-400/60 transition-colors"
            title="Gems"
          >
            <span className="text-sm">💎</span>
            <span className="font-bold text-cyan-300">
              {progress.gems.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom row: Nav Action Buttons */}
      <div className="max-w-xl mx-auto flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-800/60">
        <div className="text-xs font-semibold text-slate-300 truncate max-w-[140px] sm:max-w-[200px]">
          {currentLevelName}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onOpenHowToPlay}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenCodex}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs"
            title="Building Codex"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Codex</span>
          </button>

          <button
            onClick={onOpenAchievements}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs"
            title="Achievements"
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="hidden sm:inline">Quests</span>
          </button>

          <button
            onClick={onOpenShop}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs"
            title="Shop"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Shop</span>
          </button>

          <button
            onClick={onOpenAudioSettings}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Sound Settings"
          >
            {soundSettings.bgmEnabled || soundSettings.sfxEnabled ? (
              <Volume2 className="w-4 h-4 text-sky-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
