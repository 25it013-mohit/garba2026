# 🪔 Garba Raat • Interactive Navratri Night Experience

> An interactive, playful, and visually energetic web experience capturing a **living Gujarati Navratri Garba ground at night**.

Built with **React**, **TypeScript**, **Vite**, **Tailwind CSS v4**, **Web Audio API**, and **HTML5 Canvas**.

---

## ✨ Features

* **Sacred Central Garbo / Garbi:**
  * Beautifully illuminated terracotta *Matka* with traditional perforations (*chhidra*) casting golden light.
  * Flickering multi-layered *Akhand Jyot* flame with a breathing sacred halo.
  * Topped with *Kalash*, *Shreefal* (coconut with *Moli* thread), and green *Amba na Paan* (mango leaves).
  * Surrounded by fresh orange and yellow Marigold (*Genda Phool*) garlands.
  * **Interactive:** Clicking the Garbo plays an Aarti temple bell chime, expands radial illumination, and showers the ground with flower petals.

* **16 Articulated Cartoon Garba Dancers:**
  * **Women:** Traditional *Chaniya Choli* with multi-tier mirror-work borders, flowing *Dupattas*, jasmine flower *Gajras*, *Maang Tikka*, swinging *Jhumka* earrings, and glass bangles.
  * **Men:** Pleated flared *Kediyu* with Kutchi mirror-work vests, *Churidar* pyjamas, embroidered *Mojari* shoes, and traditional Saurashtra/Kutchi *Paghadis* (turbans).
  * **Authentic Kinematics:** Side-to-side footwork, knee dips, skirt/frill cloth inertia, 2-Taali / 3-Taali claps, and striking wooden *Dandiyas*.
  * **Wave Propagation:** Progressive phase offsets between dancers create a natural wave of movement around the circle.
  * **Interactive:** Click on any dancer for a celebratory spin, jump-clap, spark burst, and Gujarati speech bubble (*"Ae Halo!"*, *"Sanedo!"*).

* **🎵 Minimalist Floating Music Player & Beat Sync:**
  * Sleek horizontal capsule dock inspired by modern media players.
  * Spinning circular vinyl disc thumbnail on playback.
  * Scrubbable timeline progress bar with live timestamps.
  * **Device Song Upload:** Tap **"Add Your Song"** to select any audio file (`.mp3`, `.wav`, `.m4a`, `.aac`, `.flac`) directly from your device!
  * **Real-time Sub-Bass Beat Detection:** Detects drum kicks in real-time (40Hz–150Hz), dynamically computes BPM, and synchronizes dancer steps/claps to the music!
  * **Built-in Procedural Folk Synthesizer:** Includes authentic Dhol bass, *Chhant* treble slaps, *Ghunghroo* bells, *Manjira*, and *Harmonium* drone chords.

* **⚡ Ultra-Smooth 60+ FPS Performance:**
  * Zero-React-render animation loop using direct DOM `translate3d` transforms and GPU compositor CSS keyframes.
  * Dynamic energy system powered by CSS custom properties (`--garba-energy`).
  * Optimized canvas particle engine for embers and flower petals.

* **📱 Mobile Responsive & Accessible:**
  * Percentage-based perimeter Diyas and adaptive elliptical ground geometry.
  * Dynamic dancer count (8 on phone, 12 on tablet, 14 on desktop).
  * Touch-friendly controls (min 44px tap targets).
  * Full keyboard shortcuts (`Space` to play/pause, `Arrows` for songs, `1`/`2`/`3` for energy modes, `C` for Ae Halo celebration).

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <REPO_URL>
   cd garba2026
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173/` in your browser.

### Build for Production

```bash
npm run build
```

---

## 🛠️ Tech Stack

* **Framework:** React 19 + TypeScript
* **Build Tool:** Vite
* **Styling:** Tailwind CSS v4 + Custom GPU CSS Keyframes
* **Audio:** Web Audio API (`AudioContext`, `AnalyserNode`, procedural oscillator networks)
* **Effects:** HTML5 Canvas particle system
* **Icons:** Lucide React

---

## 📜 License

MIT License. Celebrate Navratri with joy and music! 🪔✨
