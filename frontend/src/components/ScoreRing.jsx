import { motion } from 'framer-motion';
import { SCORE_COLORS } from '@/constants';

/**
 * ScoreRing — SVG circular progress indicator
 * @param {number} score — 0–10
 * @param {number} size — px width/height (default 44)
 */
export function ScoreRing({ score, size = 44 }) {
  const safe = typeof score === 'number' && !isNaN(score) ? score : 0;
  const r = (size - 5) / 2;
  const c = 2 * Math.PI * r;
  const p = (safe / 10) * c;
  const color = safe >= 8 ? SCORE_COLORS.high : safe >= 6 ? SCORE_COLORS.medium : SCORE_COLORS.low;

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Score: ${safe.toFixed(1)}/10`}
    >
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth="2.5" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="2.5"
          strokeLinecap="round" strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - p }}
          transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-xs font-semibold text-ink">{safe.toFixed(1)}</span>
      </div>
    </div>
  );
}

/**
 * ScoreGauge — larger variant with "/ 10" label (for detail page hero)
 * @param {number} score — 0–10
 */
export function ScoreGauge({ score }) {
  const safe = typeof score === 'number' && !isNaN(score) ? score : 0;
  const r = 36;
  const c = 2 * Math.PI * r;
  const p = (safe / 10) * c;
  const color = safe >= 8 ? SCORE_COLORS.high : safe >= 6 ? SCORE_COLORS.medium : SCORE_COLORS.low;

  return (
    <div
      className="relative w-20 h-20 shrink-0"
      role="img"
      aria-label={`Score: ${safe.toFixed(1)}/10`}
    >
      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--border)" strokeWidth="5" />
        <motion.circle
          cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeLinecap="round" strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - p }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-lg font-semibold text-ink">{safe.toFixed(1)}</span>
        <span className="text-[9px] text-ink-faint">/ 10</span>
      </div>
    </div>
  );
}
