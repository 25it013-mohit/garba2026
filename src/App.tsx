import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EnergyMode, SongData, BeatInfo } from './types';
import { INITIAL_SONGS } from './data/songsData';
import { INITIAL_DANCERS } from './data/dancersData';
import { audioEngine } from './utils/audioEngine';
import { GarbaScene } from './components/GarbaScene';
import { MusicPlayer } from './components/MusicPlayer';
import { HeaderNav } from './components/HeaderNav';
import { ControlsPanel } from './components/ControlsPanel';
import { IntroAnimation } from './components/IntroAnimation';

export const App: React.FC = () => {
  // App State
  const [introCompleted, setIntroCompleted] = useState(false);
  const [songs, setSongs] = useState<SongData[]>(INITIAL_SONGS);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);

  // Beat Sync State
  const [detectedBpm, setDetectedBpm] = useState(124);
  const [isBeatActive, setIsBeatActive] = useState(false);

  // Ground & Energy Settings
  const [energyMode, setEnergyMode] = useState<EnergyMode>('garba');
  const [danceSpeed, setDanceSpeed] = useState(1.0);
  // Default responsive count: 8 on mobile, 12 on tablet, 14 on desktop
  const [dancerCount, setDancerCount] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) return 8;
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return 12;
    return 14;
  });
  const [showLights, setShowLights] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [soundFxEnabled, setSoundFxEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Throttled Energy for UI display (changes gently, doesn't re-render 60 times/sec)
  const [energy, setEnergy] = useState(0.35);
  const [burstTrigger, setBurstTrigger] = useState<{ x: number; y: number; count?: number; color?: string } | null>(null);

  const prevEnergyRef = useRef(0.35);
  const beatTimeoutRef = useRef<number | null>(null);

  // Next Song Handler
  const handleNextSong = useCallback(() => {
    const nextIdx = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIdx);
    if (isPlaying) {
      audioEngine.play(songs[nextIdx]);
    }
  }, [currentSongIndex, songs, isPlaying]);

  // Prev Song Handler
  const handlePrevSong = useCallback(() => {
    const prevIdx = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(prevIdx);
    if (isPlaying) {
      audioEngine.play(songs[prevIdx]);
    }
  }, [currentSongIndex, songs, isPlaying]);

  // Audio Engine Callbacks
  useEffect(() => {
    audioEngine.setCallbacks(
      (time, dur) => {
        setCurrentTime(time);
        setDuration(dur);
      },
      () => {
        handleNextSong();
      },
      (beat: BeatInfo) => {
        if (beat.isBeat) {
          setIsBeatActive(true);
          setDetectedBpm(beat.bpm);
          if (beatTimeoutRef.current) clearTimeout(beatTimeoutRef.current);
          beatTimeoutRef.current = window.setTimeout(() => setIsBeatActive(false), 140);
        }
      }
    );
  }, [handleNextSong]);

  // Play / Pause
  const handlePlayPause = () => {
    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      audioEngine.play(songs[currentSongIndex]);
      setIsPlaying(true);
    }
  };

  const handleSelectSong = (index: number) => {
    setCurrentSongIndex(index);
    audioEngine.play(songs[index]);
    setIsPlaying(true);
  };

  const handleSeek = (seconds: number) => {
    audioEngine.seek(seconds);
    setCurrentTime(seconds);
  };

  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    setIsMuted(vol === 0);
    audioEngine.setVolume(vol);
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      audioEngine.setVolume(volume || 0.85);
    } else {
      setIsMuted(true);
      audioEngine.setVolume(0);
    }
  };

  // Upload Local Device Audio File
  const handleFileUpload = async (file: File) => {
    try {
      const userSong = await audioEngine.loadUserAudioFile(file);
      setSongs(prev => [userSong, ...prev]);
      setCurrentSongIndex(0);
      audioEngine.play(userSong);
      setIsPlaying(true);

      // Celebratory spark burst when new song is loaded
      setBurstTrigger({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2 - 40,
        count: 50,
        color: '#10b981',
      });
    } catch (err) {
      console.error('Error loading device song:', err);
    }
  };

  // Switch Energy Mode
  const handleSetEnergyMode = (mode: EnergyMode) => {
    setEnergyMode(mode);
    if (mode === 'chill') {
      setDanceSpeed(0.65);
    } else if (mode === 'garba') {
      setDanceSpeed(1.0);
    } else if (mode === 'dhoom') {
      setDanceSpeed(1.4);
    }
  };

  // High Performance Beat Detection & Energy Monitor Loop
  // Updates CSS variables on root element, throttles React state updates to 10 FPS
  useEffect(() => {
    let animId: number;
    let lastStateUpdateTime = 0;

    const tick = (now: number) => {
      // 1. Run real-time beat detector
      audioEngine.updateBeatDetection();

      // 2. Compute audio energy level
      const baseEnergy = energyMode === 'chill' ? 0.15 : energyMode === 'dhoom' ? 0.75 : 0.4;
      const audioEnergy = isPlaying ? audioEngine.getEnergyLevel() : 0.05;
      const target = Math.min(1.0, baseEnergy * 0.45 + audioEnergy * 0.75);

      const current = prevEnergyRef.current + (target - prevEnergyRef.current) * 0.12;
      prevEnergyRef.current = current;

      // Update CSS variable directly on root (zero React render overhead!)
      document.documentElement.style.setProperty('--garba-energy', current.toFixed(2));

      // 3. Throttle React state update to ~10 FPS for non-critical UI meters
      if (now - lastStateUpdateTime > 100) {
        lastStateUpdateTime = now;
        setEnergy(current);
        const bpm = audioEngine.getCurrentBpm();
        if (bpm > 0) setDetectedBpm(bpm);
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, energyMode]);

  // Sync SFX toggle
  useEffect(() => {
    audioEngine.setSfxEnabled(soundFxEnabled);
  }, [soundFxEnabled]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNextSong();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevSong();
      } else if (e.code === 'KeyM') {
        handleToggleMute();
      } else if (e.code === 'Digit1') {
        handleSetEnergyMode('chill');
      } else if (e.code === 'Digit2') {
        handleSetEnergyMode('garba');
      } else if (e.code === 'Digit3') {
        handleSetEnergyMode('dhoom');
      } else if (e.code === 'KeyC') {
        handleCelebration();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Ae Halo Celebration Trigger
  const handleCelebration = () => {
    audioEngine.playClapFX();
    audioEngine.playBellFX();

    setBurstTrigger({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2 - 30,
      count: 40,
      color: '#ffd700',
    });

    setEnergy(1.0);
  };

  return (
    <div className={`garba-app ${reducedMotion ? 'reduced-motion' : ''}`}>
      {/* Cinematic Intro Animation */}
      {!introCompleted && (
        <IntroAnimation
          onComplete={() => {
            setIntroCompleted(true);
            audioEngine.play(songs[0]);
            setIsPlaying(true);
          }}
        />
      )}

      {/* Header with Title and Energy Indicator */}
      <HeaderNav
        energy={energy}
        energyMode={energyMode}
        onCelebrationTrigger={handleCelebration}
      />

      {/* Main Living Garba Ground Scene */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        <GarbaScene
          dancers={INITIAL_DANCERS}
          dancerCount={dancerCount}
          danceSpeed={danceSpeed}
          energy={energy}
          isPlaying={isPlaying}
          bpm={detectedBpm}
          isBeatActive={isBeatActive}
          showLights={showLights}
          showParticles={showParticles && !reducedMotion}
          burstTrigger={burstTrigger}
          onTriggerBurst={setBurstTrigger}
        />
      </main>

      {/* Settings & Ground Controls Panel */}
      <ControlsPanel
        energyMode={energyMode}
        onSetEnergyMode={handleSetEnergyMode}
        danceSpeed={danceSpeed}
        onSetDanceSpeed={setDanceSpeed}
        dancerCount={dancerCount}
        onSetDancerCount={setDancerCount}
        showLights={showLights}
        onToggleLights={() => setShowLights(!showLights)}
        showParticles={showParticles}
        onToggleParticles={() => setShowParticles(!showParticles)}
        soundFxEnabled={soundFxEnabled}
        onToggleSoundFx={() => setSoundFxEnabled(!soundFxEnabled)}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion(!reducedMotion)}
      />

      {/* Redesigned Minimalist Horizontal Dock Music Player */}
      <MusicPlayer
        songs={songs}
        currentSongIndex={currentSongIndex}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        detectedBpm={detectedBpm}
        isBeatActive={isBeatActive}
        onPlayPause={handlePlayPause}
        onPrev={handlePrevSong}
        onNext={handleNextSong}
        onSelectSong={handleSelectSong}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onToggleMute={handleToggleMute}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
};

export default App;
