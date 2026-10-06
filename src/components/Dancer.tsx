import React, { useState } from 'react';
import { DancerData } from '../types';

interface DancerProps {
  dancer: DancerData;
  onDancerClick: (dancer: DancerData) => void;
  isBeatActive?: boolean;
}

export const Dancer: React.FC<DancerProps> = ({
  dancer,
  onDancerClick,
  isBeatActive = false,
}) => {
  const [showQuote, setShowQuote] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSpinning(true);
    setShowQuote(true);
    onDancerClick(dancer);

    setTimeout(() => setIsSpinning(false), 850);
    setTimeout(() => setShowQuote(false), 2600);
  };

  return (
    <div
      className={`relative select-none ${isSpinning ? 'rotate-[360deg] scale-110 transition-transform duration-700' : ''} ${
        isBeatActive ? 'beat-kicked' : ''
      }`}
      onClick={handleClick}
      title={`${dancer.name} (${dancer.gujaratiName}) - Click to interact!`}
      style={{
        ['--anim-delay' as string]: `-${dancer.animationOffset}s`,
      }}
    >
      {/* Speech Bubble Quote on Click */}
      {showQuote && (
        <div className="garba-quote-bubble">
          <div className="font-bold">{dancer.name}: "{dancer.quote}"</div>
          <div className="text-[8px] opacity-90">{dancer.gujaratiName}</div>
        </div>
      )}

      {/* Ground Cast Shadow */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-3.5 rounded-[50%] bg-black/40 blur-[2px] pointer-events-none" />

      {/* Character Visual Rig (Driven by GPU CSS Keyframes) */}
      <div className="relative w-24 h-38 sm:w-28 sm:h-44 anim-torso">
        {dancer.gender === 'female' ? (
          // ================= FEMALE DANCER (Chaniya Choli, Dupatta, Bangles, Gajra) =================
          <svg viewBox="0 0 120 180" className="w-full h-full">
            <defs>
              <linearGradient id={`skirtGrad-${dancer.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={dancer.primaryColor} />
                <stop offset="65%" stopColor={dancer.primaryColor} />
                <stop offset="100%" stopColor={dancer.secondaryColor} />
              </linearGradient>
            </defs>

            {/* Feet with Anklets */}
            <ellipse cx="50" cy="172" rx="5.5" ry="3" fill={dancer.skinTone} />
            <ellipse cx="70" cy="172" rx="5.5" ry="3" fill={dancer.skinTone} />
            <path d="M44,169 Q50,172 56,169" stroke="#ffd700" strokeWidth="1.2" fill="none" />
            <path d="M64,169 Q70,172 76,169" stroke="#ffd700" strokeWidth="1.2" fill="none" />

            {/* Flared Chaniya Skirt (GPU keyframe flutter) */}
            <g className="anim-skirt">
              <path
                d="M42,102 C30,125 12,155 16,168 C35,174 85,174 104,168 C108,155 90,125 78,102 Z"
                fill={`url(#skirtGrad-${dancer.id})`}
                stroke="#ffd700"
                strokeWidth="1"
              />
              {/* Skirt Borders */}
              <path d="M23,150 Q60,162 97,150" stroke={dancer.secondaryColor} strokeWidth="6" fill="none" />
              <path d="M17,164 Q60,174 103,164" stroke="#ffd700" strokeWidth="4.5" fill="none" />
              {/* Mirror Dots */}
              {[32, 48, 60, 72, 88].map((mx, idx) => (
                <circle key={idx} cx={mx} cy="150" r="2" fill="#ffffff" stroke="#ffeb3b" strokeWidth="0.6" />
              ))}
            </g>

            {/* Torso & Choli Blouse */}
            <path d="M46,92 L74,92 L72,104 L48,104 Z" fill={dancer.skinTone} />
            <path
              d="M42,65 Q60,68 78,65 L76,92 Q60,95 44,92 Z"
              fill={dancer.primaryColor}
              stroke="#ffd700"
              strokeWidth="1.2"
            />
            {/* Mirror Spangles on Blouse */}
            <circle cx="60" cy="78" r="2.8" fill="#ffffff" stroke="#ffd700" strokeWidth="0.8" />
            <circle cx="50" cy="80" r="1.8" fill="#ffd700" />
            <circle cx="70" cy="80" r="1.8" fill="#ffd700" />

            {/* Translucent Gujarati Dupatta */}
            <path
              d="M40,64 C50,75 75,95 98,138 L90,142 C70,105 45,80 36,68 Z"
              fill={dancer.secondaryColor}
              opacity="0.88"
              stroke="#ffd700"
              strokeWidth="0.8"
            />

            {/* Arms & Hands (Animated Garba Sway / Clap / Dandiya) */}
            {dancer.role === 'dandiya' ? (
              <>
                <g className="anim-arms-left">
                  <path d="M42,70 Q30,85 24,96" stroke={dancer.skinTone} strokeWidth="5" strokeLinecap="round" fill="none" />
                  <line x1="12" y1="110" x2="36" y2="82" stroke="#ffeb3b" strokeWidth="3" strokeLinecap="round" />
                  <line x1="12" y1="110" x2="36" y2="82" stroke="#ff1744" strokeWidth="3" strokeDasharray="3 3" strokeLinecap="round" />
                </g>
                <g className="anim-arms-right">
                  <path d="M78,70 Q90,85 96,96" stroke={dancer.skinTone} strokeWidth="5" strokeLinecap="round" fill="none" />
                  <line x1="108" y1="110" x2="84" y2="82" stroke="#00e5ff" strokeWidth="3" strokeLinecap="round" />
                  <line x1="108" y1="110" x2="84" y2="82" stroke="#ffea00" strokeWidth="3" strokeDasharray="3 3" strokeLinecap="round" />
                </g>
              </>
            ) : (
              <>
                <g className="anim-arms-left">
                  <path d="M42,70 Q45,90 55,88" stroke={dancer.skinTone} strokeWidth="5.5" strokeLinecap="round" fill="none" />
                  <circle cx="52" cy="86" r="3" stroke="#ffd700" strokeWidth="1.8" fill="none" />
                </g>
                <g className="anim-arms-right">
                  <path d="M78,70 Q75,90 65,88" stroke={dancer.skinTone} strokeWidth="5.5" strokeLinecap="round" fill="none" />
                  <circle cx="68" cy="86" r="3" stroke="#ffd700" strokeWidth="1.8" fill="none" />
                </g>
              </>
            )}

            {/* Neck & Necklace */}
            <path d="M55,54 L65,54 L64,66 L56,66 Z" fill={dancer.skinTone} />
            <path d="M52,62 Q60,70 68,62" stroke="#ffd700" strokeWidth="1.8" fill="none" />

            {/* Head & Joyful Face */}
            <ellipse cx="60" cy="34" rx="18" ry="16" fill="#1a120b" />
            <path d="M42,32 Q60,18 78,32" stroke="#ffffff" strokeWidth="4" strokeDasharray="4 3" fill="none" />
            <path d="M42,32 Q60,18 78,32" stroke="#ff9800" strokeWidth="1.8" strokeDasharray="4 3" fill="none" />
            <ellipse cx="60" cy="38" rx="14" ry="15" fill={dancer.skinTone} />

            {/* Eyes & Lashes */}
            <ellipse cx="54" cy="36" rx="2.4" ry="2.8" fill="#1b120c" />
            <circle cx="53.3" cy="35" r="0.8" fill="#ffffff" />
            <ellipse cx="66" cy="36" rx="2.4" ry="2.8" fill="#1b120c" />
            <circle cx="65.3" cy="35" r="0.8" fill="#ffffff" />

            {/* Cheeks & Smile */}
            <circle cx="50" cy="41" r="2.8" fill="#ff4081" opacity="0.4" />
            <circle cx="70" cy="41" r="2.8" fill="#ff4081" opacity="0.4" />
            <path d="M56,43 Q60,47 64,43" stroke="#c2185b" strokeWidth="1.6" strokeLinecap="round" fill="none" />

            {/* Bindi & Maang Tikka */}
            <circle cx="60" cy="32" r="1.6" fill="#d50000" />
            <line x1="60" y1="23" x2="60" y2="30" stroke="#ffd700" strokeWidth="1" />
            <circle cx="60" cy="30" r="1.4" fill="#ffd700" />

            {/* Jhumkas */}
            <polygon points="45,40 42,46 48,46" fill="#ffd700" />
            <polygon points="75,40 72,46 78,46" fill="#ffd700" />
          </svg>
        ) : (
          // ================= MALE DANCER (Kediyu, Churidar, Turban/Paghadi, Dandiya) =================
          <svg viewBox="0 0 120 180" className="w-full h-full">
            <defs>
              <linearGradient id={`kediyuGrad-${dancer.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={dancer.primaryColor} />
                <stop offset="100%" stopColor={dancer.secondaryColor} />
              </linearGradient>
            </defs>

            {/* Churidar Legs & Mojaris */}
            <path d="M47,125 L49,168 L44,171" stroke="#f5f5f5" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M73,125 L71,168 L76,171" stroke="#f5f5f5" strokeWidth="6" strokeLinecap="round" fill="none" />
            <ellipse cx="44" cy="172" rx="6" ry="3" fill="#d50000" stroke="#ffd700" strokeWidth="0.8" />
            <ellipse cx="76" cy="172" rx="6" ry="3" fill="#d50000" stroke="#ffd700" strokeWidth="0.8" />

            {/* Flared Kediyu Jacket (GPU keyframe flutter) */}
            <g className="anim-skirt">
              <path
                d="M40,90 C26,105 18,124 22,132 C38,136 82,136 98,132 C102,124 94,105 80,90 Z"
                fill={`url(#kediyuGrad-${dancer.id})`}
                stroke="#ffd700"
                strokeWidth="1.2"
              />
              <path d="M38,98 L30,132" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
              <path d="M50,95 L46,134" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
              <path d="M60,95 L60,135" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
              <path d="M70,95 L74,134" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
              <path d="M82,98 L90,132" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
              {[25, 40, 55, 65, 80, 95].map((px, idx) => (
                <circle key={idx} cx={px} cy="132" r="2" fill={idx % 2 === 0 ? '#ffeb3b' : '#ff1744'} />
              ))}
            </g>

            {/* Torso & Embroidered Chest Vest */}
            <path
              d="M38,62 Q60,65 82,62 L80,92 Q60,96 40,92 Z"
              fill={dancer.primaryColor}
              stroke="#ffd700"
              strokeWidth="1.2"
            />
            <path d="M48,64 L48,92 L72,92 L72,64 Z" fill={dancer.secondaryColor} opacity="0.9" />
            <circle cx="60" cy="74" r="2.8" fill="#ffffff" stroke="#ffd700" strokeWidth="0.8" />
            <circle cx="54" cy="84" r="1.8" fill="#ffd700" />
            <circle cx="66" cy="84" r="1.8" fill="#ffd700" />

            {/* Arms & Hands (Animated Garba Sway / Clap / Dandiya) */}
            {dancer.role === 'dandiya' ? (
              <>
                <g className="anim-arms-left">
                  <path d="M38,66 Q26,82 22,94" stroke={dancer.skinTone} strokeWidth="5.5" strokeLinecap="round" fill="none" />
                  <line x1="8" y1="108" x2="34" y2="82" stroke="#ff6d00" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="8" y1="108" x2="34" y2="82" stroke="#ffd600" strokeWidth="3.5" strokeDasharray="3 3" strokeLinecap="round" />
                </g>
                <g className="anim-arms-right">
                  <path d="M82,66 Q94,82 98,94" stroke={dancer.skinTone} strokeWidth="5.5" strokeLinecap="round" fill="none" />
                  <line x1="112" y1="108" x2="86" y2="82" stroke="#00e5ff" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="112" y1="108" x2="86" y2="82" stroke="#e91e63" strokeWidth="3.5" strokeDasharray="3 3" strokeLinecap="round" />
                </g>
              </>
            ) : (
              <>
                <g className="anim-arms-left">
                  <path d="M38,66 Q42,88 54,86" stroke={dancer.skinTone} strokeWidth="6" strokeLinecap="round" fill="none" />
                  <circle cx="52" cy="84" r="2.8" fill="#ff9800" />
                </g>
                <g className="anim-arms-right">
                  <path d="M82,66 Q78,88 66,86" stroke={dancer.skinTone} strokeWidth="6" strokeLinecap="round" fill="none" />
                  <circle cx="68" cy="84" r="2.8" fill="#ff9800" />
                </g>
              </>
            )}

            {/* Neck & Kanthi Mala */}
            <path d="M54,52 L66,52 L65,64 L55,64 Z" fill={dancer.skinTone} />
            <path d="M51,60 Q60,67 69,60" stroke="#ffd700" strokeWidth="2" fill="none" />

            {/* Head & Smiling Face */}
            <ellipse cx="60" cy="38" rx="14" ry="15" fill={dancer.skinTone} />
            <ellipse cx="54" cy="37" rx="2.4" ry="2.8" fill="#1b120c" />
            <circle cx="53.3" cy="36" r="0.8" fill="#ffffff" />
            <ellipse cx="66" cy="37" rx="2.4" ry="2.8" fill="#1b120c" />
            <circle cx="65.3" cy="36" r="0.8" fill="#ffffff" />
            <path d="M53,42 Q60,40 67,42 Q60,45 53,42" fill="#1b120c" />
            <path d="M56,44 Q60,48 64,44" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" fill="none" />

            {/* Traditional Kutchi / Kathiyawadi Paghadi (Turban) */}
            <ellipse cx="60" cy="24" rx="20" ry="12" fill={dancer.secondaryColor} stroke="#ffd700" strokeWidth="1" />
            <path d="M41,26 Q60,14 79,26" stroke={dancer.primaryColor} strokeWidth="4.5" fill="none" />
            <path d="M43,21 Q60,11 77,21" stroke="#ffd700" strokeWidth="2.5" fill="none" />
            <polygon points="60,14 52,-2 68,-2" fill={dancer.primaryColor} stroke="#ffd700" strokeWidth="0.8" />
            <circle cx="60" cy="16" r="2.8" fill="#ff1744" stroke="#ffd700" strokeWidth="0.8" />
          </svg>
        )}
      </div>
    </div>
  );
};

