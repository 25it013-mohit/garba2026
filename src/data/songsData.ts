import { SongData } from '../types';

export const INITIAL_SONGS: SongData[] = [
  {
    id: 'song-1',
    title: 'Dholida Na Dhol Vaage',
    gujaratiTitle: 'ઢોલીડા ના ઢોલ વાગે',
    artist: 'Traditional Gujarati Folk / Navratri Beats',
    duration: 215,
    bpm: 126,
    mood: 'dhamaka',
    style: '3-taali',
    src: 'synth:dholida', // Automatically falls back to high-res synthesized Garba dhol if file not present
    cover: '🥁'
  },
  {
    id: 'song-2',
    title: 'Sanedo Sanedo Lal Lal Sanedo',
    gujaratiTitle: 'સનેડો સનેડો લાલ લાલ સનેડો',
    artist: 'Patan Folk Ensemble',
    duration: 198,
    bpm: 114,
    mood: 'festive',
    style: 'sanedo',
    src: 'synth:sanedo',
    cover: '🪕'
  },
  {
    id: 'song-3',
    title: 'Chogada Tara Rang Chhe',
    gujaratiTitle: 'ચોગડા તારા રંગ છે',
    artist: 'Vadodara Raas Mandali',
    duration: 240,
    bpm: 128,
    mood: 'energetic',
    style: '2-taali',
    src: 'synth:chogada',
    cover: '✨'
  },
  {
    id: 'song-4',
    title: 'Tara Vina Shyam Mane',
    gujaratiTitle: 'તારા વિના શ્યામ મને',
    artist: 'Hemant Chauhan Traditional Tribute',
    duration: 260,
    bpm: 102,
    mood: 'traditional',
    style: '2-taali',
    src: 'synth:taravinashyam',
    cover: '🦚'
  },
  {
    id: 'song-5',
    title: 'Kesariya Garba - Dakla Beats',
    gujaratiTitle: 'કેસરિયા ગરબા - ડાકલા બીટ્સ',
    artist: 'Maa Ambe Dhol Tasha Troupe',
    duration: 185,
    bpm: 136,
    mood: 'dhamaka',
    style: '3-taali',
    src: 'synth:kesariya',
    cover: '🔥'
  },
  {
    id: 'song-6',
    title: 'Dandiya Raas Tarana',
    gujaratiTitle: 'દાંડિયા રાસ તરાના',
    artist: 'Saurashtra Folk Beats',
    duration: 220,
    bpm: 122,
    mood: 'energetic',
    style: 'dandiya-raas',
    src: 'synth:dandiya',
    cover: '🥢'
  }
];
