import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Building2, Lightbulb, Play } from 'lucide-react';

interface LoadingScreenProps {
  onFinish: () => void;
}

const GAME_TIPS = [
  '💡 Drag or tap two identical buildings to merge and upgrade them into a higher tier structure!',
  '🔨 Blocked by crates or ice? Use the Hammer tool to easily break obstacles on the board!',
  '🌈 The Wildcard Rainbow Building can instantly merge with any building tier!',
  '📖 Discover new buildings in the Codex to claim bonus coins and diamonds.',
  '⚡ Energy restores naturally over time. Complete levels with 3 stars for max rewards!',
  '🔥 Perform rapid merge combos to trigger multiplier score bonuses and epic sounds!',
  '🏬 Visit the Shop to purchase Wildcard cards and power-up tools using coins.',
];

const LOADING_STEPS = [
  'Initializing Merge Engine...',
  'Loading High-Res Building Assets...',
  'Preparing Game Levels & Leaderboards...',
  'Synthesizing Audio & SFX...',
  'Loading Complete! Ready to Build!',
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [currentStepText, setCurrentStepText] = useState(LOADING_STEPS[0]);
  const [isReady, setIsReady] = useState(false);

  // Progress Bar timer
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReady(true);
          return 100;
        }
        // Random incremental progress
        const diff = Math.floor(Math.random() * 12) + 5;
        const next = Math.min(100, prev + diff);

        // Update step status text
        if (next < 30) setCurrentStepText(LOADING_STEPS[0]);
        else if (next < 60) setCurrentStepText(LOADING_STEPS[1]);
        else if (next < 85) setCurrentStepText(LOADING_STEPS[2]);
        else if (next < 99) setCurrentStepText(LOADING_STEPS[3]);
        else setCurrentStepText(LOADING_STEPS[4]);

        return next;
      });
    }, 180);

    return () => clearInterval(interval);
  }, []);

  // Tips cycling timer
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % GAME_TIPS.length);
    }, 2800);

    return () => clearInterval(tipInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white select-none overflow-hidden"
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Badge */}
      <div className="pt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400/80 bg-slate-900/80 px-4 py-1.5 rounded-full border border-amber-500/20 backdrop-blur">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Skyline Merge • 2D Building Game</span>
      </div>

      {/* Center Hero Icon & Title */}
      <div className="flex flex-col items-center my-auto text-center z-10 max-w-sm w-full">
        {/* Cover Icon Frame */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="relative mb-6"
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 via-purple-500 to-indigo-500 rounded-3xl opacity-75 blur-md animate-pulse" />
          <img
            src="./icon.png"
            alt="Skyline Merge Icon"
            referrerPolicy="no-referrer"
            className="relative w-36 h-36 rounded-2xl border-2 border-amber-300/40 object-cover shadow-2xl"
          />
        </motion.div>

        <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 mb-1 drop-shadow">
          Skyline Merge
        </h1>
        <p className="text-xs text-slate-400 font-medium tracking-wide mb-8">
          Build & Upgrade Your Dream City Skyline
        </p>

        {/* Progress Bar Container */}
        <div className="w-full bg-slate-950/80 p-4 rounded-2xl border border-slate-800 shadow-inner flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Building2 className="w-3.5 h-3.5 animate-spin" />
              {currentStepText}
            </span>
            <span className="font-mono text-amber-400 font-extrabold">{progress}%</span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.6)]"
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Ready Start Button or auto timer */}
        {isReady && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onFinish}
            className="mt-6 w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>TAP TO START</span>
          </motion.button>
        )}
      </div>

      {/* Bottom Rolling Tips Section */}
      <div className="w-full max-w-sm z-10 mb-2">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 backdrop-blur shadow-xl flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 mt-0.5 border border-amber-500/20">
            <Lightbulb className="w-4 h-4" />
          </div>

          <div className="flex-1 min-h-[44px] flex items-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentTipIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="text-xs text-slate-300 font-medium leading-relaxed"
              >
                {GAME_TIPS[currentTipIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
