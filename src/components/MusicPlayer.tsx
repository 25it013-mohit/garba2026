import React, { useState, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ListMusic,
  Shuffle,
  Repeat,
  Upload,
  Radio,
  Sparkles,
  X,
  Music,
  Check
} from 'lucide-react';
import { SongData } from '../types';
import { AudioVisualizer } from './AudioVisualizer';

interface MusicPlayerProps {
  songs: SongData[];
  currentSongIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  detectedBpm: number;
  isBeatActive: boolean;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelectSong: (index: number) => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onFileUpload: (file: File) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  songs,
  currentSongIndex,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  detectedBpm,
  isBeatActive,
  onPlayPause,
  onPrev,
  onNext,
  onSelectSong,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onFileUpload,
}) => {
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentSong = songs[currentSongIndex] || songs[0];

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onSeek((val / 100) * duration);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
      // reset input value so re-uploading the same file works
      e.target.value = '';
    }
  };

  return (
    <div className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 w-full max-w-xl px-2.5 sm:px-4 z-40 select-none">
      {/* Hidden File Input for Device Songs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac"
        className="hidden"
      />

      {/* Floating Companion Action Pills Row (inspired by reference image) */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-2">
        {/* Upload Custom Audio Pill */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="companion-pill px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer shadow-md group"
          title="Upload songs from your device to dance in sync"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-colors">
            <Upload size={12} />
          </div>
          <span className="hidden xs:inline">Add Your Song</span>
          <span className="xs:hidden">Add Song</span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-mono">
            MP3/Audio
          </span>
        </button>

        {/* Live Beat Detection Indicator Pill */}
        <div
          className={`companion-pill px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
            isBeatActive
              ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-[0_0_10px_rgba(255,193,7,0.4)]'
              : 'text-neutral-300'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full transition-transform ${
              isBeatActive ? 'bg-amber-400 scale-125' : 'bg-emerald-400 animate-pulse'
            }`}
          />
          <span className="text-[11px] font-mono">
            {detectedBpm} BPM Sync
          </span>
        </div>

        {/* Playlist Toggle Pill */}
        <button
          onClick={() => setShowPlaylist(!showPlaylist)}
          className={`companion-pill px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
            showPlaylist ? 'bg-amber-400 text-black border-amber-300' : 'text-neutral-300'
          }`}
        >
          <ListMusic size={13} />
          <span className="hidden sm:inline">Playlist</span>
          <span className="text-[10px] opacity-80">({songs.length})</span>
        </button>
      </div>

      {/* Main Redesigned Player Dock (Matching Reference Image) */}
      <div className="player-dock-glass rounded-2xl sm:rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-2.5 sm:gap-4 shadow-2xl relative">
        {/* Left: Album Artwork Thumbnail */}
        <div
          className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full sm:rounded-full flex items-center justify-center border border-amber-400/60 shrink-0 cursor-pointer overflow-hidden shadow-md bg-neutral-900 ${
            isPlaying ? 'spin-slow' : ''
          }`}
          onClick={onPlayPause}
          title="Toggle Play/Pause"
        >
          <div className="absolute inset-1 rounded-full border border-neutral-700/50" />
          <span className="text-lg sm:text-xl select-none relative z-10">
            {currentSong.cover || '🪔'}
          </span>
        </div>

        {/* Center: Track Details & Thin Timeline Progress */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {/* Top Line: Title & Artist */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <div className="min-w-0 pr-1">
              <h4 className="font-semibold text-xs sm:text-sm text-white truncate leading-tight">
                {currentSong.title}
              </h4>
              <p className="text-[10px] sm:text-[11px] text-neutral-400 truncate leading-tight mt-0.5">
                {currentSong.artist}
                {currentSong.isUserUpload && (
                  <span className="ml-1 text-emerald-400 font-medium">• Uploaded</span>
                )}
              </p>
            </div>

            {/* Embedded Tiny Visualizer Bars */}
            <div className="hidden sm:block shrink-0">
              <AudioVisualizer isPlaying={isPlaying} barCount={6} />
            </div>
          </div>

          {/* Bottom Line: Timeline Progress Bar */}
          <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
            <span className="w-7 text-left">{formatTime(currentTime)}</span>
            <div className="relative flex-1 flex items-center group py-1">
              <input
                type="range"
                min="0"
                max="100"
                value={progressPct}
                onChange={handleSeekChange}
                className="w-full cursor-pointer h-1 accent-amber-400 bg-neutral-700/60 rounded-full"
                aria-label="Progress scrub slider"
              />
            </div>
            <span className="w-7 text-right">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Circular Control Buttons (Exact Match to Reference Style) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Previous Song */}
          <button
            onClick={onPrev}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white flex items-center justify-center transition-transform active:scale-90"
            title="Previous Song"
            aria-label="Previous song"
          >
            <SkipBack size={14} className="sm:size-4" />
          </button>

          {/* Play/Pause Button - Highlighted Vibrant Circle (Inspired by Reference Image!) */}
          <button
            onClick={onPlayPause}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-teal-200 text-black flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-transform active:scale-95 cursor-pointer"
            title={isPlaying ? 'Pause Garba Beats' : 'Play Garba Beats'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={17} className="fill-black stroke-black" />
            ) : (
              <Play size={17} className="fill-black stroke-black ml-0.5" />
            )}
          </button>

          {/* Next Song */}
          <button
            onClick={onNext}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white flex items-center justify-center transition-transform active:scale-90"
            title="Next Song"
            aria-label="Next song"
          >
            <SkipForward size={14} className="sm:size-4" />
          </button>

          {/* Volume Control Icon / Popover */}
          <div className="relative">
            <button
              onClick={() => setShowVolumePopup(!showVolumePopup)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
              title="Volume"
              aria-label="Volume settings"
            >
              {isMuted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>

            {/* Volume Floating Slider */}
            {showVolumePopup && (
              <div className="absolute bottom-11 right-0 p-3 rounded-2xl glass-panel shadow-2xl flex flex-col items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={isMuted ? 0 : volume}
                  onChange={e => onVolumeChange(parseFloat(e.target.value))}
                  className="w-24 h-1.5 accent-amber-400 cursor-pointer"
                />
                <button
                  onClick={onToggleMute}
                  className="text-[10px] text-amber-300 hover:underline"
                >
                  {isMuted ? 'Unmute' : 'Mute'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Playlist Drawer (Smooth Slide-up) */}
      {showPlaylist && (
        <div className="mt-2 glass-panel rounded-2xl p-3 sm:p-4 text-white shadow-2xl max-h-64 sm:max-h-72 overflow-y-auto animate-in fade-in slide-in-from-bottom-3 duration-200 border border-amber-400/35">
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-amber-300">
              <Radio size={14} />
              Garba Raat Playlist ({songs.length})
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 text-[11px] rounded-full bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-400/40 flex items-center gap-1"
                title="Choose file from computer/phone"
              >
                <Upload size={11} /> Upload Device Audio
              </button>
              <button
                onClick={() => setShowPlaylist(false)}
                className="p-1 text-neutral-400 hover:text-white"
                title="Close"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          <div className="space-y-1">
            {songs.map((song, idx) => {
              const isActive = idx === currentSongIndex;
              return (
                <div
                  key={song.id}
                  onClick={() => onSelectSong(idx)}
                  className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-all ${
                    isActive
                      ? 'bg-amber-400/20 border border-amber-400/60 text-white font-medium'
                      : 'hover:bg-white/5 text-neutral-300'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center text-xs shrink-0">
                    {isActive && isPlaying ? (
                      <div className="flex gap-0.5 h-3 items-end">
                        <span className="w-0.5 h-full bg-emerald-400 animate-pulse" />
                        <span className="w-0.5 h-2 bg-emerald-400 animate-pulse" />
                        <span className="w-0.5 h-3 bg-emerald-400 animate-pulse" />
                      </div>
                    ) : (
                      <span>{song.cover || '🎵'}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-xs font-medium truncate text-white flex items-center gap-1.5">
                      {song.title}
                      {song.isUserUpload && (
                        <span className="text-[9px] px-1 rounded bg-emerald-400/20 text-emerald-300 font-normal">
                          Device
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate">
                      {song.artist} • {song.bpm} BPM
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-neutral-400">
                    {formatTime(song.duration)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
