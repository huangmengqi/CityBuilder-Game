import { SoundSettings } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isBgmPlaying = false;
  private bgmTimer: number | null = null;
  private settings: SoundSettings = {
    bgmEnabled: true,
    sfxEnabled: true,
    bgmVolume: 0.4,
    sfxVolume: 0.7,
    selectedTrack: 'chill',
  };

  constructor() {
    // Lazy init context on first user interaction
  }

  public init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);

    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.value = this.settings.bgmEnabled ? this.settings.bgmVolume : 0;
    this.bgmGain.connect(this.masterGain);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = this.settings.sfxEnabled ? this.settings.sfxVolume : 0;
    this.sfxGain.connect(this.masterGain);

    if (this.settings.bgmEnabled) {
      this.startBgm();
    }
  }

  public updateSettings(newSettings: Partial<SoundSettings>) {
    this.settings = { ...this.settings, ...newSettings };

    if (this.bgmGain) {
      this.bgmGain.gain.value = this.settings.bgmEnabled ? this.settings.bgmVolume : 0;
    }
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.settings.sfxEnabled ? this.settings.sfxVolume : 0;
    }

    if (this.settings.bgmEnabled && !this.isBgmPlaying) {
      this.startBgm();
    } else if (!this.settings.bgmEnabled && this.isBgmPlaying) {
      this.stopBgm();
    }
  }

  public getSettings(): SoundSettings {
    return { ...this.settings };
  }

  // BGM SYNTHESIZER LOOPS
  private startBgm() {
    if (!this.ctx || this.isBgmPlaying) return;
    this.isBgmPlaying = true;
    this.loopBgmStep(0);
  }

  private stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      window.clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  private loopBgmStep(step: number) {
    if (!this.settings.bgmEnabled || !this.isBgmPlaying || !this.ctx || !this.bgmGain) {
      return;
    }

    const track = this.settings.selectedTrack;
    let tempo = 120;
    let nextDelay = 500;

    if (track === 'chill') {
      tempo = 85;
      nextDelay = (60 / tempo) * 1000;
      this.playChillNote(step);
    } else if (track === 'upbeat') {
      tempo = 130;
      nextDelay = (60 / tempo) * 500; // 8th notes
      this.playUpbeatNote(step);
    } else if (track === 'chiptune') {
      tempo = 140;
      nextDelay = (60 / tempo) * 250; // 16th notes
      this.playChiptuneNote(step);
    }

    this.bgmTimer = window.setTimeout(() => {
      this.loopBgmStep(step + 1);
    }, nextDelay);
  }

  // Track 1: Chill Lofi Chords + Melody
  private playChillNote(step: number) {
    if (!this.ctx || !this.bgmGain) return;
    const now = this.ctx.currentTime;

    // Chords: Cmaj7 - Am7 - Fmaj7 - G7
    const chordIndex = Math.floor(step / 4) % 4;
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 349.23], // G7
    ];

    if (step % 4 === 0) {
      const chord = chords[chordIndex];
      chord.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

        osc.connect(gain);
        gain.connect(this.bgmGain!);
        osc.start(now);
        osc.stop(now + 1.9);
      });
    }

    // Gentle random melody note from pentatonic
    const melodyScale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.5];
    const freq = melodyScale[(step * 3) % melodyScale.length];
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.bgmGain);
    osc.start(now);
    osc.stop(now + 0.45);
  }

  // Track 2: Upbeat Pop Synth
  private playUpbeatNote(step: number) {
    if (!this.ctx || !this.bgmGain) return;
    const now = this.ctx.currentTime;

    const bassLine = [130.81, 130.81, 174.61, 174.61, 220.0, 220.0, 196.0, 196.0];
    const melody = [523.25, 659.25, 783.99, 659.25, 880.0, 783.99, 659.25, 587.33];

    // Bass
    const bFreq = bassLine[step % bassLine.length];
    const bOsc = this.ctx.createOscillator();
    const bGain = this.ctx.createGain();
    bOsc.type = 'triangle';
    bOsc.frequency.setValueAtTime(bFreq, now);
    bGain.gain.setValueAtTime(0.06, now);
    bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    bOsc.connect(bGain);
    bGain.connect(this.bgmGain);
    bOsc.start(now);
    bOsc.stop(now + 0.23);

    // Arp Melody
    const mFreq = melody[(step * 2) % melody.length];
    const mOsc = this.ctx.createOscillator();
    const mGain = this.ctx.createGain();
    mOsc.type = 'sine';
    mOsc.frequency.setValueAtTime(mFreq, now);
    mGain.gain.setValueAtTime(0.03, now);
    mGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    mOsc.connect(mGain);
    mGain.connect(this.bgmGain);
    mOsc.start(now);
    mOsc.stop(now + 0.19);
  }

  // Track 3: Retro Chiptune
  private playChiptuneNote(step: number) {
    if (!this.ctx || !this.bgmGain) return;
    const now = this.ctx.currentTime;

    const notes = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63, 440.0, 523.25, 659.25, 523.25, 392.0, 293.66, 349.23, 440.0, 587.33, 440.0];
    const freq = notes[step % notes.length];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.bgmGain);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  // SFX METHODS
  public playPop() {
    if (!this.settings.sfxEnabled) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.06);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  public playMerge(tier: number) {
    if (!this.settings.sfxEnabled) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    // Base frequency increases with building tier (tier 1 to 10)
    const baseFreq = 300 + tier * 70;
    const frequencies = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 2];

    frequencies.forEach((f, index) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = tier >= 8 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(f, now + index * 0.04);

      gain.gain.setValueAtTime(0.25, now + index * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.04 + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + index * 0.04);
      osc.stop(now + index * 0.04 + 0.22);
    });
  }

  public playCoin() {
    if (!this.settings.sfxEnabled) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const notes = [987.77, 1318.51]; // B5 to E6 chime

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0.2, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.22);
    });
  }

  public playCombo(combo: number) {
    if (!this.settings.sfxEnabled) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const baseFreq = 500 + combo * 100;
    const chord = [baseFreq, baseFreq * 1.25, baseFreq * 1.5];

    chord.forEach((f) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.36);
    });
  }

  public playPowerup() {
    if (!this.settings.sfxEnabled) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.25);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  public playCrateBreak() {
    if (!this.settings.sfxEnabled) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  public playVictory() {
    if (!this.settings.sfxEnabled) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const victoryChord = [523.25, 659.25, 783.99, 1046.5]; // C Major Triad + High C

    victoryChord.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0.3, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.65);
    });
  }

  public playError() {
    if (!this.settings.sfxEnabled) return;
    this.init();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.setValueAtTime(130, now + 0.08);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.22);
  }
}

export const soundEngine = new SoundEngine();
