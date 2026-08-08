import React from 'react';
import { X, Volume2, VolumeX, Music, Bell } from 'lucide-react';
import { SoundSettings } from '../types';
import { soundEngine } from '../utils/soundEngine';

interface AudioSettingsModalProps {
  settings: SoundSettings;
  onUpdateSettings: (newSettings: Partial<SoundSettings>) => void;
  onClose: () => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-5 shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-extrabold text-amber-400">Audio & Sound FX</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Background Music Section */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-200">
                <Music className="w-4 h-4 text-purple-400" />
                <span>Background Music (BGM)</span>
              </div>
              <button
                onClick={() => {
                  soundEngine.init();
                  onUpdateSettings({ bgmEnabled: !settings.bgmEnabled });
                }}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all ${
                  settings.bgmEnabled
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                {settings.bgmEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* BGM Volume Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Music Volume</span>
                <span>{Math.round(settings.bgmVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.bgmVolume}
                onChange={(e) => {
                  soundEngine.init();
                  onUpdateSettings({ bgmVolume: parseFloat(e.target.value) });
                }}
                disabled={!settings.bgmEnabled}
                className="w-full accent-amber-400 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Track Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                Music Genre / Style
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'chill', label: '☕ Chill Lofi' },
                  { id: 'upbeat', label: '🎵 Upbeat Pop' },
                  { id: 'chiptune', label: '👾 8-Bit Retro' },
                ].map((track) => (
                  <button
                    key={track.id}
                    onClick={() => {
                      soundEngine.init();
                      onUpdateSettings({ selectedTrack: track.id as SoundSettings['selectedTrack'] });
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                      settings.selectedTrack === track.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {track.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sound Effects Section */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-200">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Sound Effects (SFX)</span>
              </div>
              <button
                onClick={() => {
                  soundEngine.init();
                  onUpdateSettings({ sfxEnabled: !settings.sfxEnabled });
                }}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all ${
                  settings.sfxEnabled
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                {settings.sfxEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* SFX Volume Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>SFX Volume</span>
                <span>{Math.round(settings.sfxVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.sfxVolume}
                onChange={(e) => {
                  soundEngine.init();
                  onUpdateSettings({ sfxVolume: parseFloat(e.target.value) });
                }}
                disabled={!settings.sfxEnabled}
                className="w-full accent-amber-400 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Test Sound SFX Buttons */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                Sound Test Preview
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => soundEngine.playMerge(5)}
                  className="flex-1 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                >
                  ✨ Merge
                </button>
                <button
                  onClick={() => soundEngine.playCoin()}
                  className="flex-1 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-semibold text-yellow-300"
                >
                  🪙 Coin
                </button>
                <button
                  onClick={() => soundEngine.playVictory()}
                  className="flex-1 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-semibold text-emerald-300"
                >
                  🏆 Victory
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
