import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tile } from '../types';
import { BUILDINGS } from '../data/buildings';
import { Hammer, Sparkles } from 'lucide-react';

interface GameBoardProps {
  rows: number;
  cols: number;
  grid: (Tile | null)[][];
  selectedCoord: { r: number; c: number } | null;
  activeTool: 'hammer' | 'rainbow' | null;
  onTileClick: (r: number, c: number) => void;
  onTileDrop: (fromR: number, fromC: number, toR: number, toC: number) => void;
  floatingTexts: Array<{ id: string; x: number; y: number; text: string; color: string }>;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  rows,
  cols,
  grid,
  selectedCoord,
  activeTool,
  onTileClick,
  onTileDrop,
  floatingTexts,
}) => {
  const [dragSource, setDragSource] = useState<{ r: number; c: number } | null>(null);

  const handleDragStart = (e: React.DragEvent, r: number, c: number) => {
    setDragSource({ r, c });
    e.dataTransfer.setData('text/plain', JSON.stringify({ r, c }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, toR: number, toC: number) => {
    e.preventDefault();
    let src = dragSource;
    if (!src) {
      try {
        const data = e.dataTransfer.getData('text/plain');
        if (data) {
          src = JSON.parse(data);
        }
      } catch {
        // ignore
      }
    }
    if (src) {
      onTileDrop(src.r, src.c, toR, toC);
      setDragSource(null);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center select-none">
      {/* Active Tool Header Indicator */}
      {activeTool && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md ${
            activeTool === 'hammer'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
          }`}
        >
          {activeTool === 'hammer' ? (
            <>
              <Hammer className="w-3.5 h-3.5" />
              <span>Hammer Active: Tap any tile to break it</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Wildcard Active: Tap any tile to match</span>
            </>
          )}
        </motion.div>
      )}

      {/* 2D Flat Game Grid Container */}
      <div className="relative w-full aspect-square bg-slate-900/90 rounded-3xl border-2 border-slate-800 shadow-2xl p-3 flex items-center justify-center overflow-hidden">
        {/* Floating FX Overlay */}
        <AnimatePresence>
          {floatingTexts.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 1, y: item.y, x: item.x, scale: 0.8 }}
              animate={{ opacity: 0, y: item.y - 50, scale: 1.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`absolute pointer-events-none z-50 font-black text-lg drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] ${item.color}`}
            >
              {item.text}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Dynamic Grid Layout */}
        <div
          className="grid gap-2 w-full h-full"
          style={{
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((_, c) => {
              const tile = grid[r]?.[c] || null;
              const isSelected = selectedCoord?.r === r && selectedCoord?.c === c;
              const building = tile?.tier ? BUILDINGS[tile.tier] : null;

              return (
                <div
                  key={`cell-${r}-${c}`}
                  className="relative w-full h-full"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, r, c)}
                  onClick={() => onTileClick(r, c)}
                >
                  {/* Base Grid Cell Slot */}
                  <div
                    className={`absolute inset-0 rounded-2xl border transition-colors cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/60 z-30 shadow-lg'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {!tile && (
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-800/80" />
                    )}
                  </div>

                  {/* Tile Item */}
                  {tile && (
                    <motion.div
                      key={tile.id}
                      initial={tile.isNew ? { scale: 0.2, opacity: 0 } : false}
                      animate={{
                        scale: isSelected ? 1.06 : 1,
                        opacity: 1,
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      draggable={tile.type === 'building' || tile.type === 'rainbow'}
                      onDragStart={(e) => handleDragStart(e, r, c)}
                      className={`absolute inset-0 rounded-2xl border-2 flex flex-col items-center justify-between p-1.5 text-center shadow-md cursor-pointer transition-shadow overflow-hidden ${
                        tile.type === 'crate'
                          ? 'bg-gradient-to-br from-amber-800 to-amber-950 border-amber-600 text-amber-100'
                          : tile.type === 'frozen'
                          ? 'bg-gradient-to-br from-cyan-800 to-sky-950 border-cyan-400 text-cyan-100'
                          : tile.type === 'rainbow'
                          ? 'bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 border-pink-300 text-white shadow-pink-500/40'
                          : building
                          ? `bg-gradient-to-br ${building.gradient}`
                          : 'bg-slate-800 border-slate-700'
                      } ${
                        isSelected
                          ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-900 shadow-2xl z-40'
                          : 'z-10'
                      }`}
                    >
                      {/* Crate Content */}
                      {tile.type === 'crate' && (
                        <div className="flex flex-col items-center justify-center h-full">
                          <span className="text-3xl filter drop-shadow-md">📦</span>
                          <span className="text-[10px] font-black tracking-wider text-amber-300 mt-0.5">
                            {tile.hp && tile.hp > 1 ? `HP: ${tile.hp}` : 'Crate'}
                          </span>
                        </div>
                      )}

                      {/* Frozen Content */}
                      {tile.type === 'frozen' && (
                        <div className="flex flex-col items-center justify-center h-full">
                          <span className="text-3xl filter drop-shadow-md animate-pulse">🧊</span>
                          <span className="text-[10px] font-black tracking-wider text-cyan-200 mt-0.5">
                            Frozen
                          </span>
                        </div>
                      )}

                      {/* Wildcard Content */}
                      {tile.type === 'rainbow' && (
                        <div className="flex flex-col items-center justify-center h-full">
                          <span className="text-3xl filter drop-shadow-md animate-bounce">🌈</span>
                          <span className="text-[9px] font-black uppercase tracking-tight text-pink-100 mt-0.5">
                            Wildcard
                          </span>
                        </div>
                      )}

                      {/* Building Content */}
                      {tile.type === 'building' && building && (
                        <div className="flex flex-col items-center justify-between h-full w-full py-0.5">
                          <div className="w-full flex justify-end px-0.5">
                            <span className="text-[9px] font-black bg-black/40 px-1.5 py-0.5 rounded-full border border-white/20 leading-none">
                              T{building.tier}
                            </span>
                          </div>
                          <span className="text-3xl filter drop-shadow-md transform transition-transform hover:scale-110 my-auto">
                            {building.emoji}
                          </span>
                          <span className="text-[11px] font-black leading-tight tracking-tight line-clamp-1 drop-shadow">
                            {building.name}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};



