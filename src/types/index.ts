export type EnergyMode = 'chill' | 'garba' | 'dhoom';

export interface DancerData {
  id: string;
  name: string;
  gujaratiName: string;
  gender: 'female' | 'male';
  role: 'taali_garba' | 'dandiya' | 'raas_spinner';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  skinTone: string;
  pattern: 'bandhani' | 'patola' | 'mirror_work' | 'leheriya';
  baseAngle: number; // 0 - 360 deg
  orbitRadius: number;
  scale: number;
  animationOffset: number; // phase delay in seconds
  quote: string;
  specialMove: 'spin' | 'jump_clap' | 'dandiya_twirl';
}

export interface SongData {
  id: string;
  title: string;
  gujaratiTitle?: string;
  artist: string;
  duration: number; // in seconds
  bpm: number;
  mood: 'energetic' | 'festive' | 'traditional' | 'dhamaka' | 'chill';
  style: '2-taali' | '3-taali' | 'sanedo' | 'dandiya-raas';
  src: string; // audio source path or procedural id or blob url
  cover: string;
  isUserUpload?: boolean;
}

export interface ParticleItem {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  shape: 'circle' | 'petal' | 'spark' | 'star';
  rotation: number;
  vRot: number;
  life: number;
  maxLife: number;
}

export interface GroundRipple {
  id: string;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
}

export interface BeatInfo {
  isBeat: boolean;
  intensity: number;
  bpm: number;
  timestamp: number;
}
