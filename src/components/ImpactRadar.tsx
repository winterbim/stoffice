'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { t, type Locale } from '@/lib/i18n';

interface ImpactRadarProps {
  lang: Locale;
}

interface Category {
  id: string;
  labelKey: string;
  color: string;
  savings: number;
  angle: number;
  active: boolean;
}

interface Particle {
  progress: number;
  speed: number;
}

const INITIAL_CATEGORIES: Category[] = [
  { id: 'assets', labelKey: 'radarAssets', color: '#00d4aa', savings: 95000, angle: -55, active: false },
  { id: 'docs', labelKey: 'radarDocs', color: '#60a5fa', savings: 18000, angle: 35, active: false },
  { id: 'garanties', labelKey: 'radarGaranties', color: '#a87ad4', savings: 32000, angle: 145, active: false },
  { id: 'snags', labelKey: 'radarSnags', color: '#d4a843', savings: 22000, angle: -145, active: false },
];

function formatCHF(n: number): string {
  if (n >= 1000) {
    return `CHF ${Math.round(n / 1000).toLocaleString('de-CH')}k`;
  }
  return `CHF ${n.toLocaleString('de-CH')}`;
}

export default function ImpactRadar({ lang }: ImpactRadarProps) {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [displayAmount, setDisplayAmount] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Record<string, Particle[]>>({});
  const animRef = useRef<number>(0);
  const targetAmountRef = useRef(0);

  const totalSavings = categories.reduce((sum, c) => sum + (c.active ? c.savings : 0), 0);
  const anyActive = categories.some(c => c.active);

  // Animate CHF counter
  useEffect(() => {
    targetAmountRef.current = totalSavings;
    const start = displayAmount;
    const target = totalSavings;
    const startTime = performance.now();
    const duration = 600;

    function step(ts: number) {
      const p = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplayAmount(Math.round(start + (target - start) * ease));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSavings]);

  const toggleCategory = useCallback((id: string) => {
    setCategories(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, active: !c.active } : c);
      const cat = updated.find(c => c.id === id)!;
      if (cat.active) {
        particlesRef.current[id] = Array.from({ length: 6 }, (_, i) => ({
          progress: i * 0.16,
          speed: 0.003 + Math.random() * 0.002,
        }));
      } else {
        delete particlesRef.current[id];
      }
      return updated;
    });
  }, []);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const size = canvas.clientWidth;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const outerR = size * 0.46;
    const innerR = size * 0.077;

    function draw() {
      ctx!.clearRect(0, 0, size, size);

      // Draw rings
      const rings = [
        { r: outerR, color: 'rgba(96,165,250,0.06)' },
        { r: size * 0.345, color: 'rgba(168,122,212,0.06)' },
        { r: size * 0.192, color: 'rgba(0,212,170,0.08)' },
      ];
      for (const ring of rings) {
        ctx!.beginPath();
        ctx!.arc(cx, cy, ring.r, 0, Math.PI * 2);
        ctx!.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx!.lineWidth = 1;
        ctx!.stroke();
      }

      // Draw rays and particles
      for (const cat of categories) {
        if (!cat.active) continue;

        const rad = (cat.angle * Math.PI) / 180;

        // Ray line
        ctx!.beginPath();
        ctx!.moveTo(cx + Math.cos(rad) * innerR, cy + Math.sin(rad) * innerR);
        ctx!.lineTo(cx + Math.cos(rad) * outerR, cy + Math.sin(rad) * outerR);
        ctx!.strokeStyle = cat.color + '40';
        ctx!.lineWidth = 4;
        ctx!.stroke();

        // Glow
        ctx!.beginPath();
        ctx!.moveTo(cx + Math.cos(rad) * innerR, cy + Math.sin(rad) * innerR);
        ctx!.lineTo(cx + Math.cos(rad) * outerR, cy + Math.sin(rad) * outerR);
        ctx!.strokeStyle = cat.color + '12';
        ctx!.lineWidth = 18;
        ctx!.stroke();

        // Particles
        const parts = particlesRef.current[cat.id];
        if (parts) {
          for (const p of parts) {
            p.progress += p.speed;
            if (p.progress > 1) p.progress -= 1;

            const r = outerR - (outerR - innerR) * p.progress;
            const px = cx + Math.cos(rad) * r;
            const py = cy + Math.sin(rad) * r;

            const alpha = p.progress < 0.1 ? p.progress / 0.1 :
                          p.progress > 0.9 ? (1 - p.progress) / 0.1 : 1;

            // Particle
            ctx!.beginPath();
            ctx!.arc(px, py, 4, 0, Math.PI * 2);
            ctx!.fillStyle = cat.color;
            ctx!.globalAlpha = alpha * 0.9;
            ctx!.fill();

            // Particle glow
            ctx!.beginPath();
            ctx!.arc(px, py, 9, 0, Math.PI * 2);
            ctx!.fillStyle = cat.color;
            ctx!.globalAlpha = alpha * 0.15;
            ctx!.fill();

            ctx!.globalAlpha = 1;
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [categories]);

  // Button positions for desktop (around the circle)
  const btnPositions: Record<string, string> = {
    assets: 'top-[8%] right-[-8%] sm:right-[-12%]',
    docs: 'bottom-[8%] right-[-8%] sm:right-[-12%]',
    garanties: 'bottom-[8%] left-[-8%] sm:left-[-12%]',
    snags: 'top-[8%] left-[-8%] sm:left-[-12%]',
  };

  return (
    <section className="py-12 sm:py-20">
      {/* Title */}
      <div className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.15em] text-[var(--color-plum)] pb-3 mb-5 border-b border-[rgba(168,122,212,0.25)]">
          <span className="w-2 h-2 rounded-full bg-[var(--color-plum)] shadow-[0_0_8px_rgba(168,122,212,0.5)]" />
          <span>ImpactRadar</span>
        </div>
        <h2 className="font-[var(--font-serif)] text-[clamp(2rem,4vw,3.2rem)] font-normal leading-tight text-[var(--color-text-0)] mb-3">
          {t('radarTitle', lang)}
        </h2>
        <p className="text-[1rem] text-[var(--color-text-2)] max-w-[520px] mx-auto">
          {t('radarSubtitle', lang)}
        </p>
      </div>

      {/* Radar */}
      <div className="flex flex-col items-center">
        <div className="relative w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] lg:w-[520px] lg:h-[520px]">
          {/* Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: 'none' }}
          />

          {/* Ring labels */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Outer ring label */}
            <span className="absolute top-[2%] left-1/2 -translate-x-1/2 font-[var(--font-mono)] text-[9px] uppercase tracking-[0.15em] text-[var(--color-info)] opacity-60">
              Build
            </span>
            {/* Mid ring label */}
            <span className="absolute top-[17%] left-1/2 -translate-x-1/2 font-[var(--font-mono)] text-[9px] uppercase tracking-[0.15em] text-[var(--color-plum)] opacity-60">
              Handover
            </span>
            {/* Inner ring label */}
            <span className="absolute top-[33%] left-1/2 -translate-x-1/2 font-[var(--font-mono)] text-[9px] uppercase tracking-[0.15em] text-[var(--color-accent)] opacity-60">
              FM
            </span>
          </div>

          {/* Center CHF */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
            <div className="font-[var(--font-mono)] text-[9px] uppercase tracking-[0.2em] text-[var(--color-text-3)] mb-1">
              {t('radarSavingsLabel', lang)}
            </div>
            <div
              className="font-[var(--font-serif)] text-[clamp(1.8rem,4vw,2.6rem)] leading-none tracking-tight"
              style={{
                background: anyActive
                  ? 'linear-gradient(135deg, #00d4aa, #34d399)'
                  : 'linear-gradient(135deg, #56616c, #56616c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: anyActive ? 'drop-shadow(0 0 20px rgba(0,212,170,0.2))' : 'none',
                transition: 'filter 0.3s ease',
              }}
            >
              CHF {displayAmount > 0 ? `${Math.round(displayAmount / 1000)}'000` : '0'}
            </div>
            <div className="text-[11px] text-[var(--color-text-3)] mt-1">
              {t('radarPerYear', lang)}
            </div>
          </div>

          {/* Pulse ring when active */}
          <div className={`absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full transition-all duration-500 ${
            anyActive ? 'shadow-[0_0_0_0_rgba(0,212,170,0.2)] animate-[radar-pulse_2s_ease-in-out_infinite]' : ''
          }`} />

          {/* Category buttons — desktop: around circle */}
          <div className="hidden sm:block">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`absolute ${btnPositions[cat.id]} z-20 px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  cat.active
                    ? 'bg-[var(--color-bg-2)] text-[var(--color-text-0)]'
                    : 'bg-[var(--color-bg-1)] border-[var(--color-glass-border)] text-[var(--color-text-3)] hover:text-[var(--color-text-1)] hover:border-[var(--color-bg-4)]'
                }`}
                style={cat.active ? {
                  borderColor: cat.color,
                  boxShadow: `0 0 15px ${cat.color}30`,
                } : undefined}
              >
                <span
                  className="w-2 h-2 rounded-full transition-all"
                  style={{
                    backgroundColor: cat.active ? cat.color : 'currentColor',
                    boxShadow: cat.active ? `0 0 8px ${cat.color}` : 'none',
                  }}
                />
                {t(cat.labelKey, lang)}
              </button>
            ))}
          </div>
        </div>

        {/* Category buttons — mobile: row below */}
        <div className="flex sm:hidden flex-wrap justify-center gap-2 mt-6">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={`px-3 py-2 rounded-xl border text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                cat.active
                  ? 'bg-[var(--color-bg-2)] text-[var(--color-text-0)]'
                  : 'bg-[var(--color-bg-1)] border-[var(--color-glass-border)] text-[var(--color-text-3)]'
              }`}
              style={cat.active ? {
                borderColor: cat.color,
                boxShadow: `0 0 12px ${cat.color}30`,
              } : undefined}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: cat.active ? cat.color : 'currentColor',
                  boxShadow: cat.active ? `0 0 6px ${cat.color}` : 'none',
                }}
              />
              {t(cat.labelKey, lang)}
            </button>
          ))}
        </div>

        {/* Stats chips */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {categories.map(cat => (
            <div
              key={cat.id}
              className={`px-4 py-3 rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-bg-1)] text-center min-w-[90px] transition-all duration-300 ${
                cat.active ? 'opacity-100' : 'opacity-30'
              }`}
              style={cat.active ? { borderColor: cat.color + '30' } : undefined}
            >
              <div className="font-[var(--font-serif)] text-base" style={{ color: cat.color }}>
                {formatCHF(cat.savings)}
              </div>
              <div className="text-[9px] text-[var(--color-text-3)] font-[var(--font-mono)] uppercase tracking-wider mt-1">
                {t(cat.labelKey, lang)}
              </div>
            </div>
          ))}
        </div>

        {/* Instruction */}
        <p className="text-center text-xs text-[var(--color-text-3)] mt-8 max-w-[400px]">
          {t('radarInstruction', lang)}
        </p>
      </div>

      {/* Keyframes for pulse */}
      <style>{`
        @keyframes radar-pulse {
          0% { box-shadow: 0 0 0 0 rgba(0,212,170,0.15); }
          70% { box-shadow: 0 0 0 20px rgba(0,212,170,0); }
          100% { box-shadow: 0 0 0 0 rgba(0,212,170,0); }
        }
      `}</style>
    </section>
  );
}
