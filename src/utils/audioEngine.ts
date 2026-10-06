import { SongData, BeatInfo } from '../types';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isSynthesizing = false;
  private currentStep = 0;
  private timerId: number | null = null;
  private currentSong: SongData | null = null;
  private isPlaying = false;
  private currentTime = 0;
  private duration = 180;
  private bpm = 120;
  private volume = 0.85;
  private sfxEnabled = true;
  private audioElement: HTMLAudioElement | null = null;
  private audioSourceNode: MediaElementAudioSourceNode | null = null;
  private onTimeUpdateCallback: ((time: number, duration: number) => void) | null = null;
  private onEndedCallback: (() => void) | null = null;
  private onBeatCallback: ((info: BeatInfo) => void) | null = null;

  // Real-Time Beat Detection State
  private energyHistory: number[] = new Array(35).fill(0.1);
  private lastBeatTime = 0;
  private beatIntervals: number[] = [];
  private estimatedBpm = 120;

  constructor() {
    // Lazy initialization on first user interaction
  }

  public initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.7;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.volume * 0.85;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
      this.sfxGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setCallbacks(
    onTimeUpdate: (time: number, duration: number) => void,
    onEnded: () => void,
    onBeat?: (info: BeatInfo) => void
  ) {
    this.onTimeUpdateCallback = onTimeUpdate;
    this.onEndedCallback = onEnded;
    if (onBeat) this.onBeatCallback = onBeat;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
  }

  public setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
  }

  // --- Real-time Beat Detection Engine ---
  // Analyzes bass & transient spikes in both local audio files and procedural rhythms
  public updateBeatDetection(): BeatInfo {
    const now = performance.now();
    if (!this.isPlaying) {
      return { isBeat: false, intensity: 0, bpm: this.estimatedBpm, timestamp: now };
    }

    let instantEnergy = 0.1;

    if (this.analyser) {
      const buffer = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(buffer as unknown as Uint8Array<ArrayBuffer>);

      // Bass range for beat detection (bins 0 to 4 ~ 40Hz - 150Hz)
      let bassSum = 0;
      const bassBins = Math.min(5, buffer.length);
      for (let i = 0; i < bassBins; i++) {
        bassSum += buffer[i];
      }
      instantEnergy = bassSum / (bassBins * 255);
    }

    // Rolling average energy
    let sum = 0;
    for (let i = 0; i < this.energyHistory.length; i++) {
      sum += this.energyHistory[i];
    }
    const avgEnergy = sum / this.energyHistory.length;

    // Shift history
    this.energyHistory.push(instantEnergy);
    this.energyHistory.shift();

    // Beat condition: instantaneous energy spikes over dynamic threshold
    // Minimum 240ms between beats (corresponds to max 250 BPM)
    const threshold = Math.max(0.18, avgEnergy * 1.32);
    const timeSinceLastBeat = now - this.lastBeatTime;
    const isBeat = instantEnergy > threshold && timeSinceLastBeat > 240;

    if (isBeat) {
      if (this.lastBeatTime > 0 && timeSinceLastBeat < 1200) {
        // Track interval for BPM estimate
        this.beatIntervals.push(timeSinceLastBeat);
        if (this.beatIntervals.length > 8) this.beatIntervals.shift();

        const avgInterval = this.beatIntervals.reduce((a, b) => a + b, 0) / this.beatIntervals.length;
        if (avgInterval > 0) {
          const calculatedBpm = Math.round(60000 / avgInterval);
          if (calculatedBpm >= 70 && calculatedBpm <= 180) {
            this.estimatedBpm = calculatedBpm;
          }
        }
      }
      this.lastBeatTime = now;

      const beatInfo: BeatInfo = {
        isBeat: true,
        intensity: Math.min(1.0, (instantEnergy - avgEnergy) * 3 + 0.4),
        bpm: this.estimatedBpm,
        timestamp: now,
      };

      if (this.onBeatCallback) {
        this.onBeatCallback(beatInfo);
      }

      return beatInfo;
    }

    return {
      isBeat: false,
      intensity: instantEnergy,
      bpm: this.estimatedBpm,
      timestamp: now,
    };
  }

  // --- User Local Audio File Loader ---
  public async loadUserAudioFile(file: File): Promise<SongData> {
    this.initContext();

    // Create persistent Blob URL
    const objectUrl = URL.createObjectURL(file);

    // Clean display title from file name
    const cleanTitle = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Estimate initial duration or probe with Audio object
    return new Promise(resolve => {
      const probeAudio = new Audio();
      probeAudio.src = objectUrl;

      const onLoadedMetadata = () => {
        const fileDuration = probeAudio.duration && !isNaN(probeAudio.duration) ? probeAudio.duration : 210;
        const newSong: SongData = {
          id: `user-${Date.now()}`,
          title: cleanTitle || 'My Local Song',
          artist: 'Device Audio • Live Beat Sync',
          duration: Math.round(fileDuration),
          bpm: 124, // will adapt dynamically with beat detector
          mood: 'dhamaka',
          style: '3-taali',
          src: objectUrl,
          cover: '🎵',
          isUserUpload: true,
        };
        probeAudio.removeEventListener('loadedmetadata', onLoadedMetadata);
        resolve(newSong);
      };

      probeAudio.addEventListener('loadedmetadata', onLoadedMetadata);
      probeAudio.addEventListener('error', () => {
        // Fallback on error
        resolve({
          id: `user-${Date.now()}`,
          title: cleanTitle || 'Local Audio Track',
          artist: 'Device Audio',
          duration: 180,
          bpm: 124,
          mood: 'energetic',
          style: '2-taali',
          src: objectUrl,
          cover: '🎵',
          isUserUpload: true,
        });
      });
    });
  }

  // --- Sound Effects (Taali, Dandiya, Bell) ---
  public playClapFX() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    for (let i = 0; i < 2; i++) {
      const offset = i * 0.01;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.05);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < bufferSize; j++) {
        data[j] = (Math.random() * 2 - 1) * Math.exp(-j / (bufferSize * 0.35));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200 + Math.random() * 300, t + offset);
      filter.Q.setValueAtTime(2.0, t + offset);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.05);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      noise.start(t + offset);
      noise.stop(t + offset + 0.06);
    }
  }

  public playDandiyaFX() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2100, t);
    osc.frequency.exponentialRampToValueAtTime(420, t + 0.035);

    gain.gain.setValueAtTime(0.65, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.045);
  }

  public playBellFX() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const freqs = [1046.5, 2093, 3135];
    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      const decay = 0.9 - idx * 0.15;
      gain.gain.setValueAtTime(0.22 / (idx + 1), t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + decay);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + decay);
    });
  }

  // Procedural Instrument Triggers
  private triggerDholBass(time: number, velocity = 1.0) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(50, time + 0.08);

    gain.gain.setValueAtTime(0.85 * velocity, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.32);
  }

  private triggerDholTreble(time: number, velocity = 0.75) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.06);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1500, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4 * velocity, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.07);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + 0.08);
  }

  private triggerGhunghroo(time: number, velocity = 0.35) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(3600, time);

    gain.gain.setValueAtTime(0.07 * velocity, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.06);
  }

  private triggerManjira(time: number, velocity = 0.45) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(3490, time);

    gain.gain.setValueAtTime(0.2 * velocity, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.4);
  }

  private triggerLeadMelody(time: number, noteIndex: number, style: SongData['style']) {
    if (!this.ctx || !this.masterGain) return;
    const scale = [349.23, 392.0, 415.3, 466.16, 523.25, 554.37, 622.25, 698.46];
    const freq = scale[noteIndex % scale.length];

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = style === 'sanedo' ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, time);

    gain.gain.setValueAtTime(0.1, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.22);
  }

  private playDroneChord() {
    if (!this.ctx || !this.masterGain) return;
    const droneFreqs = [174.61, 261.63];
    droneFreqs.forEach(freq => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(420, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.035, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      setTimeout(() => {
        try {
          osc.stop();
        } catch {}
      }, 10000);
    });
  }

  // --- Procedural Sequencer for Authentic Garba Beats ---
  private stepBeat() {
    if (!this.isPlaying || !this.isSynthesizing || !this.ctx) return;

    const t = this.ctx.currentTime + 0.05;
    const step = this.currentStep % 16;
    const style = this.currentSong?.style || '2-taali';

    if (style === '2-taali') {
      if (step === 0 || step === 8) {
        this.triggerDholBass(t, 1.0);
        this.triggerGhunghroo(t, 0.4);
      }
      if (step === 4 || step === 12) {
        this.triggerDholTreble(t, 0.8);
        this.playClapFX();
      }
      if (step === 2 || step === 6 || step === 10 || step === 14) {
        this.triggerGhunghroo(t, 0.3);
      }
      if (step === 4 || step === 12) {
        this.triggerManjira(t, 0.55);
      }
    } else if (style === '3-taali') {
      if (step === 0) {
        this.triggerDholBass(t, 1.0);
      }
      if (step === 3 || step === 6 || step === 9) {
        this.playClapFX();
        this.triggerDholTreble(t, 0.85);
        this.triggerManjira(t, 0.5);
      }
      if (step === 12 || step === 14) {
        this.triggerDholBass(t, 0.75);
        this.triggerGhunghroo(t, 0.45);
      }
    } else if (style === 'sanedo') {
      if (step % 4 === 0) {
        this.triggerDholBass(t, 0.95);
        this.triggerManjira(t, 0.5);
      }
      if (step % 2 === 1) {
        this.triggerDholTreble(t, 0.7);
        this.triggerGhunghroo(t, 0.35);
      }
    } else {
      if (step % 4 === 0) {
        this.triggerDholBass(t, 0.9);
      }
      if (step % 4 === 2) {
        this.playDandiyaFX();
        this.triggerDholTreble(t, 0.8);
      }
      this.triggerGhunghroo(t, 0.25);
    }

    const melodyPattern = [0, 2, 4, 3, 5, 4, 2, 1, 0, 4, 5, 7, 5, 4, 2, 0];
    if (step % 2 === 0) {
      const note = melodyPattern[(step + Math.floor(this.currentStep / 16) * 2) % melodyPattern.length];
      this.triggerLeadMelody(t, note, style);
    }

    if (this.currentStep % 64 === 0) {
      this.playDroneChord();
    }

    this.currentStep++;
    this.currentTime += 60 / this.bpm / 4;

    if (this.currentTime >= this.duration) {
      this.currentTime = 0;
      if (this.onEndedCallback) {
        this.onEndedCallback();
      }
    }

    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(this.currentTime, this.duration);
    }

    const stepInterval = (60 / this.bpm / 4) * 1000;
    this.timerId = window.setTimeout(() => this.stepBeat(), stepInterval);
  }

  // --- Main Playback Methods ---
  public play(song: SongData) {
    this.initContext();
    this.currentSong = song;
    this.bpm = song.bpm || 120;
    this.estimatedBpm = this.bpm;
    this.duration = song.duration || 180;
    this.isPlaying = true;

    // Check if song has real audio file to stream (or user uploaded blob)
    if (song.src && !song.src.startsWith('synth:')) {
      if (!this.audioElement) {
        this.audioElement = new Audio();
        this.audioElement.crossOrigin = 'anonymous';
        if (this.ctx && this.analyser) {
          try {
            this.audioSourceNode = this.ctx.createMediaElementSource(this.audioElement);
            this.audioSourceNode.connect(this.analyser);
          } catch {
            // Already connected
          }
        }
        this.audioElement.addEventListener('timeupdate', () => {
          if (this.audioElement && this.onTimeUpdateCallback) {
            this.onTimeUpdateCallback(this.audioElement.currentTime, this.audioElement.duration || this.duration);
          }
        });
        this.audioElement.addEventListener('ended', () => {
          if (this.onEndedCallback) this.onEndedCallback();
        });
      }

      this.audioElement.src = song.src;
      this.audioElement.volume = this.volume;
      this.audioElement.play().catch(err => {
        console.warn('Audio element play failed, falling back to Navratri Synth:', err);
        this.startSynth();
      });
      this.isSynthesizing = false;
    } else {
      if (this.audioElement) {
        this.audioElement.pause();
      }
      this.startSynth();
    }
  }

  private startSynth() {
    this.isSynthesizing = true;
    if (this.timerId) clearTimeout(this.timerId);
    this.playDroneChord();
    this.stepBeat();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

  public resume() {
    if (!this.currentSong) return;
    this.initContext();
    this.isPlaying = true;
    if (this.isSynthesizing) {
      this.stepBeat();
    } else if (this.audioElement) {
      this.audioElement.play().catch(() => this.startSynth());
    }
  }

  public seek(targetSeconds: number) {
    this.currentTime = Math.max(0, Math.min(this.duration, targetSeconds));
    if (this.audioElement && !this.isSynthesizing) {
      this.audioElement.currentTime = this.currentTime;
    }
    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(this.currentTime, this.duration);
    }
  }

  public getFrequencyData(dataArray: Uint8Array): void {
    if (this.analyser && this.isPlaying) {
      this.analyser.getByteFrequencyData(dataArray as unknown as Uint8Array<ArrayBuffer>);
    } else {
      dataArray.fill(0);
    }
  }

  public getEnergyLevel(): number {
    if (!this.isPlaying || !this.analyser) {
      return 0.15;
    }

    const buffer = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(buffer as unknown as Uint8Array<ArrayBuffer>);

    let bassSum = 0;
    const bins = Math.min(6, buffer.length);
    for (let i = 0; i < bins; i++) {
      bassSum += buffer[i];
    }

    const averageBass = bassSum / (bins * 255);
    return Math.min(1.0, averageBass * 1.55);
  }

  public getCurrentBpm(): number {
    return this.estimatedBpm || this.bpm;
  }

  public getPlaybackState() {
    return {
      isPlaying: this.isPlaying,
      currentTime: this.currentTime,
      duration: this.duration,
      currentSong: this.currentSong,
      volume: this.volume,
      bpm: this.estimatedBpm,
    };
  }
}

export const audioEngine = new AudioEngine();
