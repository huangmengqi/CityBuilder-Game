import React from 'react';
import { LevelGoal } from '../types';
import { BUILDINGS } from '../data/buildings';
import { CheckCircle2 } from 'lucide-react';

interface LevelGoalsBarProps {
  goals: LevelGoal[];
  score: number;
}

export const LevelGoalsBar: React.FC<LevelGoalsBarProps> = ({ goals, score }) => {
  return (
    <div className="w-full max-w-md mx-auto bg-slate-900/80 border border-slate-800 rounded-2xl p-2.5 shadow-lg mb-2 text-slate-100">
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
        <span>Level Objectives</span>
        <span className="text-amber-400 font-extrabold text-xs">Score: {score.toLocaleString()}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {goals.map((goal, idx) => {
          let current = goal.currentCount || 0;
          let target = goal.targetCount || 1;
          let isComplete = false;

          if (goal.type === 'score') {
            current = score;
            target = goal.targetScore || 1000;
            isComplete = score >= target;
          } else {
            isComplete = current >= target;
          }

          const percent = Math.min(100, Math.floor((current / target) * 100));

          let icon = goal.icon;
          if (goal.type === 'building_tier' && goal.targetTier) {
            icon = BUILDINGS[goal.targetTier]?.emoji || icon;
          }

          return (
            <div
              key={idx}
              className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                isComplete
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-200'
              }`}
            >
              <div className="text-xl flex-shrink-0">{icon}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="truncate pr-1">{goal.description}</span>
                  <span className="flex-shrink-0 text-[11px] font-bold">
                    {goal.type === 'score'
                      ? `${Math.min(current, target).toLocaleString()}/${target.toLocaleString()}`
                      : `${Math.min(current, target)}/${target}`}
                  </span>
                </div>

                {/* Mini Progress Bar */}
                <div className="w-full bg-slate-700/80 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isComplete ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {isComplete && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 animate-bounce" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
