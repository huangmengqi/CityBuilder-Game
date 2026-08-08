import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { Tile, UserProgress, SoundSettings } from './types';
import { LEVELS } from './data/levels';
import { BUILDINGS } from './data/buildings';
import { INITIAL_ACHIEVEMENTS } from './data/achievements';
import { soundEngine } from './utils/soundEngine';

import { Header } from './components/Header';
import { LevelGoalsBar } from './components/LevelGoalsBar';
import { GameBoard } from './components/GameBoard';
import { ControlBar } from './components/ControlBar';

import { BuildingCodex } from './components/BuildingCodex';
import { LevelSelectModal } from './components/LevelSelectModal';
import { AudioSettingsModal } from './components/AudioSettingsModal';
import { ShopModal } from './components/ShopModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { AchievementsModal } from './components/AchievementsModal';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { LoadingScreen } from './components/LoadingScreen';

const STORAGE_KEY = 'skyline_merge_h5_progress_v1';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // 1. User Progress State
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      currentLevel: 1,
      unlockedLevel: 1,
      stars: {},
      highScores: {},
      coins: 200,
      gems: 30,
      energy: 20,
      maxEnergy: 20,
      unlockedTiers: [1],
      unlockedAchievements: [],
    };
  });

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  // Energy Recharge Timer
  const [energyTimer, setEnergyTimer] = useState(10);
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergyTimer((prev) => {
        if (progress.energy >= progress.maxEnergy) return 10;
        if (prev <= 1) {
          setProgress((p) => ({ ...p, energy: Math.min(p.maxEnergy, p.energy + 1) }));
          return 10;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [progress.energy, progress.maxEnergy]);

  // Current Level Config
  const currentLevelConfig = LEVELS.find((l) => l.id === progress.currentLevel) || LEVELS[0];

  // Game Grid State
  const [grid, setGrid] = useState<(Tile | null)[][]>([]);
  const [score, setScore] = useState(0);
  const [levelGoals, setLevelGoals] = useState(currentLevelConfig.goals);
  const [selectedCoord, setSelectedCoord] = useState<{ r: number; c: number } | null>(null);
  const [activeTool, setActiveTool] = useState<'hammer' | 'rainbow' | null>(null);
  const [isLevelComplete, setIsLevelComplete] = useState(false);

  // Floating text FX
  const [floatingTexts, setFloatingTexts] = useState<
    Array<{ id: string; x: number; y: number; text: string; color: string }>
  >([]);

  // Sound Settings
  const [soundSettings, setSoundSettings] = useState<SoundSettings>(() => soundEngine.getSettings());

  // Modals state
  const [activeModal, setActiveModal] = useState<
    'codex' | 'levelSelect' | 'audio' | 'shop' | 'howToPlay' | 'achievements' | null
  >(null);

  // Achievements
  const [achievements, setAchievements] = useState(INITIAL_ACHIEVEMENTS);

  // Floating text trigger helper
  const addFloatingText = (text: string, color: string = 'text-amber-300') => {
    const id = Math.random().toString(36).substr(2, 9);
    setFloatingTexts((prev) => [...prev, { id, x: Math.random() * 80 - 40, y: -10, text, color }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((t) => t.id !== id));
    }, 800);
  };

  // Initializing Grid for Current Level
  const initLevelGrid = useCallback((levelId: number) => {
    const config = LEVELS.find((l) => l.id === levelId) || LEVELS[0];
    const newGrid: (Tile | null)[][] = Array.from({ length: config.rows }, () =>
      Array.from({ length: config.cols }, () => null)
    );

    if (config.initialLayout) {
      config.initialLayout.forEach((item) => {
        if (item.row < config.rows && item.col < config.cols) {
          newGrid[item.row][item.col] = {
            id: Math.random().toString(36).substr(2, 9),
            tier: item.tier || 0,
            type: item.type || 'building',
            hp: item.hp || 1,
          };
        }
      });
    }

    setGrid(newGrid);
    setScore(0);
    setLevelGoals(config.goals.map((g) => ({ ...g, currentCount: 0 })));
    setSelectedCoord(null);
    setActiveTool(null);
    setIsLevelComplete(false);
  }, []);

  useEffect(() => {
    initLevelGrid(progress.currentLevel);
  }, [progress.currentLevel, initLevelGrid]);

  // Check Board Empty Slots
  const getEmptyCoords = (g: (Tile | null)[][]) => {
    const coords: { r: number; c: number }[] = [];
    g.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (!cell) coords.push({ r, c });
      });
    });
    return coords;
  };

  // Spawn Brick Action
  const handleSpawnBrick = () => {
    soundEngine.init();
    if (progress.energy <= 0) {
      soundEngine.playError();
      return;
    }

    const empty = getEmptyCoords(grid);
    if (empty.length === 0) {
      soundEngine.playError();
      addFloatingText('BOARD FULL!', 'text-rose-400');
      return;
    }

    // Spend energy
    setProgress((p) => ({ ...p, energy: p.energy - 1 }));

    // Pick random empty tile
    const randomCoord = empty[Math.floor(Math.random() * empty.length)];
    const newGrid = [...grid.map((r) => [...r])];

    newGrid[randomCoord.r][randomCoord.c] = {
      id: Math.random().toString(36).substr(2, 9),
      tier: 1, // Brick
      type: 'building',
      isNew: true,
    };

    setGrid(newGrid);
    soundEngine.playPop();
  };

  // Clear adjacent crates/ice on merge
  const clearAdjacentObstacles = (g: (Tile | null)[][], r: number, c: number) => {
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    let clearedCount = 0;

    directions.forEach(([dr, dc]) => {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < g.length && nc >= 0 && g[0] && nc < g[0].length) {
        const neighbor = g[nr]?.[nc];
        if (neighbor && (neighbor.type === 'crate' || neighbor.type === 'frozen')) {
          if ((neighbor.hp || 1) <= 1) {
            if (g[nr]) g[nr][nc] = null;
            clearedCount++;
            soundEngine.playCrateBreak();
          } else {
            neighbor.hp = (neighbor.hp || 1) - 1;
            soundEngine.playCrateBreak();
          }
        }
      }
    });

    if (clearedCount > 0) {
      updateGoal('clear_crates', clearedCount);
    }
  };

  // Update level objective progress
  const updateGoal = (type: 'building_tier' | 'score' | 'clear_crates', amount: number, tier?: number) => {
    setLevelGoals((prevGoals) =>
      prevGoals.map((goal) => {
        let current = goal.currentCount || 0;
        if (goal.type === type) {
          if (type === 'building_tier' && goal.targetTier === tier) {
            current += amount;
          } else if (type === 'clear_crates') {
            current += amount;
          }
        }
        return { ...goal, currentCount: current };
      })
    );
  };

  // Check victory condition safely in useEffect
  useEffect(() => {
    if (isLevelComplete || grid.length === 0 || levelGoals.length === 0) return;

    let allCleared = true;
    for (const goal of levelGoals) {
      if (goal.type === 'score') {
        if (score < (goal.targetScore || 1000)) allCleared = false;
      } else {
        if ((goal.currentCount || 0) < (goal.targetCount || 1)) allCleared = false;
      }
    }

    if (allCleared) {
      handleLevelVictory();
    }
  }, [levelGoals, score, isLevelComplete, grid.length]);

  // Handle Victory
  const handleLevelVictory = () => {
    setIsLevelComplete(true);
    soundEngine.playVictory();

    // Reward player
    const rewardCoins = currentLevelConfig.rewardCoins;
    const rewardGems = currentLevelConfig.rewardGems;

    setProgress((p) => {
      const nextUnlocked = Math.max(p.unlockedLevel, p.currentLevel + 1);
      return {
        ...p,
        coins: p.coins + rewardCoins,
        gems: p.gems + rewardGems,
        unlockedLevel: nextUnlocked,
        stars: { ...p.stars, [p.currentLevel]: 3 },
      };
    });
  };

  // Merge / Move Core Handler
  const executeMoveOrMerge = (fromR: number, fromC: number, toR: number, toC: number) => {
    if (fromR === toR && fromC === toC) return;

    const sourceTile = grid[fromR]?.[fromC];
    const targetTile = grid[toR]?.[toC];

    if (!sourceTile) return;

    // Can't move crates or frozen blocks
    if (sourceTile.type === 'crate' || sourceTile.type === 'frozen') {
      soundEngine.playError();
      return;
    }

    const newGrid = [...grid.map((r) => [...r])];

    // CASE 1: Move to Empty Cell
    if (!targetTile) {
      newGrid[toR][toC] = sourceTile;
      newGrid[fromR][fromC] = null;
      setGrid(newGrid);
      soundEngine.playPop();
      setSelectedCoord(null);
      return;
    }

    // CASE 2: Merge Same Building Tier or Rainbow Wildcard
    const isRainbowMerge =
      sourceTile.type === 'rainbow' || targetTile.type === 'rainbow';
    const isMatchingTier =
      sourceTile.type === 'building' &&
      targetTile.type === 'building' &&
      sourceTile.tier === targetTile.tier;

    if (isMatchingTier || isRainbowMerge) {
      const baseTier = isRainbowMerge
        ? (sourceTile.tier || targetTile.tier || 1)
        : sourceTile.tier;
      const nextTier = Math.min(10, baseTier + 1);
      const buildingInfo = BUILDINGS[nextTier];

      newGrid[toR][toC] = {
        id: Math.random().toString(36).substr(2, 9),
        tier: nextTier,
        type: 'building',
        isMerged: true,
      };
      newGrid[fromR][fromC] = null;

      // Clear adjacent crates/ice around merge location
      clearAdjacentObstacles(newGrid, toR, toC);

      setGrid(newGrid);

      // Score & Coin Gain
      const addedScore = buildingInfo.score;
      const addedCoins = buildingInfo.value;

      setScore((s) => s + addedScore);
      setProgress((p) => {
        const tiers = p.unlockedTiers.includes(nextTier)
          ? p.unlockedTiers
          : [...p.unlockedTiers, nextTier];
        return {
          ...p,
          coins: p.coins + addedCoins,
          unlockedTiers: tiers,
        };
      });

      // Sound FX
      soundEngine.playMerge(nextTier);
      addFloatingText(
        `+${addedScore} Pts! ${buildingInfo.emoji}`,
        'text-amber-300 font-black'
      );

      // Update level objectives
      updateGoal('building_tier', 1, nextTier);

      setSelectedCoord(null);
      return;
    }

    // Invalid merge
    soundEngine.playError();
    setSelectedCoord(null);
  };

  // Tile Interaction
  const handleTileClick = (r: number, c: number) => {
    soundEngine.init();
    const clickedTile = grid[r]?.[c];

    // Tool: Hammer
    if (activeTool === 'hammer') {
      if (!clickedTile) return;
      if (progress.coins < 50) {
        soundEngine.playError();
        addFloatingText('Need 50 Coins!', 'text-rose-400');
        setActiveTool(null);
        return;
      }

      // Spend coins & destroy
      setProgress((p) => ({ ...p, coins: p.coins - 50 }));
      const newGrid = [...grid.map((row) => [...row])];
      newGrid[r][c] = null;
      setGrid(newGrid);
      soundEngine.playCrateBreak();
      addFloatingText('Demolished! 🔨', 'text-rose-400');
      setActiveTool(null);
      return;
    }

    // Selection or Target
    if (selectedCoord) {
      executeMoveOrMerge(selectedCoord.r, selectedCoord.c, r, c);
    } else if (clickedTile) {
      if (clickedTile.type === 'building' || clickedTile.type === 'rainbow') {
        setSelectedCoord({ r, c });
        soundEngine.playPop();
      }
    }
  };

  // Powerup 1: Hammer
  const handleUseHammer = () => {
    soundEngine.init();
    if (progress.coins < 50) {
      soundEngine.playError();
      addFloatingText('Need 50 Coins!', 'text-rose-400');
      return;
    }
    setActiveTool(activeTool === 'hammer' ? null : 'hammer');
  };

  // Powerup 2: Auto Merge Magnet
  const handleUseMagnet = () => {
    soundEngine.init();
    if (progress.coins < 80) {
      soundEngine.playError();
      addFloatingText('Need 80 Coins!', 'text-rose-400');
      return;
    }

    // Find lowest matching pair
    let matchPair: [{ r: number; c: number }, { r: number; c: number }] | null = null;
    const tileMap = new Map<number, { r: number; c: number }>();

    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[0].length; c++) {
        const tile = grid[r][c];
        if (tile && tile.type === 'building' && tile.tier < 10) {
          if (tileMap.has(tile.tier)) {
            matchPair = [tileMap.get(tile.tier)!, { r, c }];
            break;
          } else {
            tileMap.set(tile.tier, { r, c });
          }
        }
      }
      if (matchPair) break;
    }

    if (!matchPair) {
      soundEngine.playError();
      addFloatingText('No Matching Pair!', 'text-amber-300');
      return;
    }

    setProgress((p) => ({ ...p, coins: p.coins - 80 }));
    soundEngine.playPowerup();

    executeMoveOrMerge(
      matchPair[0].r,
      matchPair[0].c,
      matchPair[1].r,
      matchPair[1].c
    );
  };

  // Powerup 3: Shuffle
  const handleUseShuffle = () => {
    soundEngine.init();
    if (progress.coins < 40) {
      soundEngine.playError();
      addFloatingText('Need 40 Coins!', 'text-rose-400');
      return;
    }

    const items: Tile[] = [];
    grid.forEach((row) =>
      row.forEach((cell) => {
        if (cell && (cell.type === 'building' || cell.type === 'rainbow')) {
          items.push(cell);
        }
      })
    );

    if (items.length < 2) {
      soundEngine.playError();
      return;
    }

    // Fisher-yates shuffle
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }

    setProgress((p) => ({ ...p, coins: p.coins - 40 }));
    soundEngine.playPowerup();

    let idx = 0;
    const newGrid = [...grid.map((r) => [...r])];
    for (let r = 0; r < newGrid.length; r++) {
      for (let c = 0; c < newGrid[0].length; c++) {
        if (newGrid[r][c] && (newGrid[r][c]!.type === 'building' || newGrid[r][c]!.type === 'rainbow')) {
          newGrid[r][c] = items[idx++];
        }
      }
    }
    setGrid(newGrid);
    addFloatingText('Shuffled! 🔀', 'text-emerald-300');
  };

  // Powerup 4: Rainbow Wildcard Tile
  const handleUseRainbow = () => {
    soundEngine.init();
    if (progress.gems < 10 && progress.coins < 150) {
      soundEngine.playError();
      addFloatingText('Need 10 Gems!', 'text-cyan-300');
      return;
    }

    const empty = getEmptyCoords(grid);
    if (empty.length === 0) {
      soundEngine.playError();
      addFloatingText('BOARD FULL!', 'text-rose-400');
      return;
    }

    if (progress.gems >= 10) {
      setProgress((p) => ({ ...p, gems: p.gems - 10 }));
    } else {
      setProgress((p) => ({ ...p, coins: p.coins - 150 }));
    }

    const randomCoord = empty[Math.floor(Math.random() * empty.length)];
    const newGrid = [...grid.map((r) => [...r])];
    newGrid[randomCoord.r][randomCoord.c] = {
      id: Math.random().toString(36).substr(2, 9),
      tier: 0,
      type: 'rainbow',
      isNew: true,
    };

    setGrid(newGrid);
    soundEngine.playPowerup();
    addFloatingText('Wildcard Spawned! 🌈', 'text-pink-300');
  };

  // Shop purchases
  const handleBuyEnergy = (coinsCost: number) => {
    if (progress.coins >= coinsCost) {
      setProgress((p) => ({
        ...p,
        coins: p.coins - coinsCost,
        energy: p.maxEnergy,
      }));
      soundEngine.playCoin();
    }
  };

  const handleBuyGemsCoins = (gemCost: number, coinGain: number) => {
    if (progress.gems >= gemCost) {
      setProgress((p) => ({
        ...p,
        gems: p.gems - gemCost,
        coins: p.coins + coinGain,
      }));
      soundEngine.playCoin();
    }
  };

  // Claim achievement
  const handleClaimAchievement = (id: string) => {
    setAchievements((prev) =>
      prev.map((a) => {
        if (a.id === id && !a.claimed) {
          setProgress((p) => ({
            ...p,
            coins: p.coins + a.rewardCoins,
            gems: p.gems + a.rewardGems,
            unlockedAchievements: [...p.unlockedAchievements, id],
          }));
          soundEngine.playCoin();
          return { ...a, claimed: true };
        }
        return a;
      })
    );
  };

  const isBoardFull = getEmptyCoords(grid).length === 0;

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-slate-100 flex flex-col justify-between font-sans antialiased overflow-x-hidden selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation Header */}
      <Header
        progress={progress}
        currentLevelName={currentLevelConfig.name}
        soundSettings={soundSettings}
        onToggleSound={() => {
          soundEngine.init();
          setSoundSettings(soundEngine.getSettings());
        }}
        onOpenLevelSelect={() => setActiveModal('levelSelect')}
        onOpenCodex={() => setActiveModal('codex')}
        onOpenShop={() => setActiveModal('shop')}
        onOpenAchievements={() => setActiveModal('achievements')}
        onOpenHowToPlay={() => setActiveModal('howToPlay')}
        onOpenAudioSettings={() => setActiveModal('audio')}
        energyRechargeTime={energyTimer}
      />

      {/* Main Game Stage */}
      <main className="flex-1 w-full max-w-md mx-auto px-3 py-2 flex flex-col justify-center items-center">
        {/* Level Goal Progress Banner */}
        <LevelGoalsBar goals={levelGoals} score={score} />

        {/* Game Canvas Board */}
        <GameBoard
          rows={currentLevelConfig.rows}
          cols={currentLevelConfig.cols}
          grid={grid}
          selectedCoord={selectedCoord}
          activeTool={activeTool}
          onTileClick={handleTileClick}
          onTileDrop={(fromR, fromC, toR, toC) => executeMoveOrMerge(fromR, fromC, toR, toC)}
          floatingTexts={floatingTexts}
        />

        {/* Bottom Control Bar */}
        <ControlBar
          energy={progress.energy}
          maxEnergy={progress.maxEnergy}
          coins={progress.coins}
          gems={progress.gems}
          isBoardFull={isBoardFull}
          activeTool={activeTool}
          onSpawnBrick={handleSpawnBrick}
          onUseHammer={handleUseHammer}
          onUseMagnet={handleUseMagnet}
          onUseShuffle={handleUseShuffle}
          onUseRainbow={handleUseRainbow}
        />
      </main>

      {/* Modals & Overlays */}
      {activeModal === 'codex' && (
        <BuildingCodex
          unlockedTiers={progress.unlockedTiers}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'levelSelect' && (
        <LevelSelectModal
          progress={progress}
          onSelectLevel={(levelId) => {
            setProgress((p) => ({ ...p, currentLevel: levelId }));
            initLevelGrid(levelId);
            setActiveModal(null);
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'audio' && (
        <AudioSettingsModal
          settings={soundSettings}
          onUpdateSettings={(newSettings) => {
            soundEngine.updateSettings(newSettings);
            setSoundSettings(soundEngine.getSettings());
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'shop' && (
        <ShopModal
          progress={progress}
          onBuyEnergy={handleBuyEnergy}
          onBuyGemsCoins={handleBuyGemsCoins}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'howToPlay' && (
        <HowToPlayModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'achievements' && (
        <AchievementsModal
          achievements={achievements}
          onClaim={handleClaimAchievement}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Level Complete Overlay */}
      {isLevelComplete && (
        <LevelCompleteModal
          levelId={progress.currentLevel}
          score={score}
          rewardCoins={currentLevelConfig.rewardCoins}
          rewardGems={currentLevelConfig.rewardGems}
          onNextLevel={() => {
            const nextLvl = Math.min(LEVELS.length, progress.currentLevel + 1);
            setProgress((p) => ({ ...p, currentLevel: nextLvl }));
            initLevelGrid(nextLvl);
            setIsLevelComplete(false);
          }}
          onReplay={() => {
            initLevelGrid(progress.currentLevel);
            setIsLevelComplete(false);
          }}
          onLevelSelect={() => {
            setIsLevelComplete(false);
            setActiveModal('levelSelect');
          }}
        />
      )}

      {/* Initial Resource Loading Screen */}
      <AnimatePresence>
        {isLoading && <LoadingScreen onFinish={() => setIsLoading(false)} />}
      </AnimatePresence>
    </div>
  );
}
