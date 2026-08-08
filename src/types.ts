export interface BuildingItem {
  tier: number; // 1 to 10
  name: string;
  emoji: string;
  value: number; // coin generation on merge
  score: number; // points awarded on merge
  color: string;
  gradient: string;
  description: string;
}

export type TileType = 'building' | 'crate' | 'frozen' | 'rainbow' | 'empty';

export interface Tile {
  id: string;
  tier: number; // 1 to 10 if building, 0 if crate/rainbow/frozen
  type: TileType;
  isNew?: boolean;
  isMerged?: boolean;
  isLocked?: boolean; // crate or frozen
  hp?: number; // for crates (e.g., 1 or 2 hit to destroy)
}

export interface LevelGoal {
  type: 'building_tier' | 'score' | 'clear_crates';
  targetTier?: number;
  targetCount?: number;
  currentCount?: number;
  targetScore?: number;
  description: string;
  icon: string;
}

export interface LevelConfig {
  id: number;
  name: string;
  rows: number;
  cols: number;
  goals: LevelGoal[];
  movesLimit?: number; // optional move limit or energy limit
  initialLayout?: Array<{ row: number; col: number; tier?: number; type?: TileType; hp?: number }>;
  rewardCoins: number;
  rewardGems: number;
  unlockedMaxTier: number;
}

export interface PowerUp {
  id: 'hammer' | 'magnet' | 'shuffle' | 'rainbow' | 'energy';
  name: string;
  description: string;
  costCoins: number;
  costGems: number;
  icon: string;
  count: number;
}

export interface UserProgress {
  currentLevel: number;
  unlockedLevel: number;
  stars: Record<number, number>; // levelId -> stars (1-3)
  highScores: Record<number, number>;
  coins: number;
  gems: number;
  energy: number;
  maxEnergy: number;
  unlockedTiers: number[]; // e.g. [1, 2, 3...]
  unlockedAchievements: string[];
}

export interface SoundSettings {
  bgmEnabled: boolean;
  sfxEnabled: boolean;
  bgmVolume: number; // 0 to 1
  sfxVolume: number; // 0 to 1
  selectedTrack: 'chill' | 'upbeat' | 'chiptune';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  rewardGems: number;
  icon: string;
  progress: number;
  target: number;
  claimed: boolean;
}
