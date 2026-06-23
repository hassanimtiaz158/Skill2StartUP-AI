import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Badge } from '@/components/Badge';
import { CardSkeleton } from '@/components/Skeleton';
import {
  ArrowRight, TrendingUp, AlertTriangle, Star, PartyPopper, ArrowLeft, Loader2,
} from 'lucide-react';
import { STORAGE_KEYS, SCORE_HIGH, SCORE_MEDIUM, SCORE_LABELS } from '@/constants';
import { User, Award } from 'lucide-react';
import { ScoreRing } from '@/components/ScoreRing';
import { fadeUp, stagger } from '@/config/animations';

function getDifficulty(score) {
  if (score >= SCORE_HIGH) return { label: SCORE_LABELS.high, variant: 'success' };
  if (score >= SCORE_MEDIUM) return { label: SCORE_LABELS.medium, variant: 'warning' };
  return { label: SCORE_LABELS.low, variant: 'danger' };
}

/* ── Celebration ── */
function CelebrationBurst() {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 'var(--z-celebration)' }}
    >
      {Array.from({ length: 24 }, (_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.4;
        const duration = 1.2 + Math.random() * 0.8;
        const color = ['#6366F1', '#8B5CF6', '#EC4899', '#06B6D4'][i % 4];
        const size = 4 + Math.random() * 4;

        return (
          <motion.div
            key={i}
            className="absolute rounded-sm"
            style={{ left: `${left}%`, top: '-8px', width: size, height: size * 1.5, backgroundColor: color }}
            initial={{ y: 0, opacity: 1, rotate: 0 }}
            animate={{ y: '100vh', opacity: 0, rotate: 360 * (i % 2 === 0 ? 1 : -1) }}
            transition={{ duration, delay, ease: 'easeIn' }}
          />
        );
      })}
    </div>
  );
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const [showCelebration, setShowCelebration] = useState(true);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEYS.PROFILE_ANALYSIS);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const [ideas, setIdeas] = useState(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEYS.IDEAS);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      const list = Array.isArray(parsed?.ideas) ? parsed.ideas : [];
      return list.map((idea, idx) => ({
        startup_name: idea.startup_name || `Startup Idea ${idx + 1}`,
        pitch: idea.pitch || '',
        problem: idea.problem || '',
        solution: idea.solution || '',
        target_users: Array.isArray(idea.target_users) ? idea.target_users : [],
        why_now: idea.why_now || '',
        opportunity_score: typeof idea.opportunity_score === 'number' ? idea.opportunity_score : 0,
      }));
    } catch { return []; }
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => setShowCelebration(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-bg pt-24 pb-12 md:pt-28 md:pb-16 relative">
        <div className="container relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink">Preparing your ideas…</h2>
              <p className="text-sm text-ink-muted">Loading generated startup blueprints</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  if (!ideas.length) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center pt-24">
        <div className="max-w-sm text-center p-8">
          <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
          <h2 className="text-xl font-bold text-ink mb-2">No ideas found</h2>
          <p className="text-ink-muted text-sm mb-6">Go back and enter your skills first.</p>
          <button
            onClick={() => navigate('/input')}
            className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-primary to-accent-2 text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-200"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  const best = ideas.reduce((a, b) => (a.opportunity_score > b.opportunity_score ? a : b));

  return (
    <div className="min-h-screen bg-bg pt-24 pb-12 md:pt-28 md:pb-16 relative">
      <div className="orb w-[400px] h-[400px] bg-primary/10 -top-32 right-0" />
      {showCelebration && <CelebrationBurst />}

      <div className="container relative">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center mb-10 md:mb-12">
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 rounded-full bg-success/10 border border-success/15 px-4 py-2 text-xs font-semibold text-success mb-4">
            <PartyPopper className="h-4 w-4" />
            {ideas.length} Ideas Generated
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink mb-3">
            Your Ideas Are <span className="gradient-text">Ready! 🎉</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-base text-ink-muted max-w-md mx-auto">
            We analyzed your profile and found these opportunities. Click any idea to see the full execution plan.
          </motion.p>
        </motion.div>

        {/* Founder Profile Card */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <div className="rounded-2xl border border-primary/20 bg-white p-5 md:p-6 shadow-lg shadow-slate-200/50">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-accent-2 flex items-center justify-center shrink-0 shadow-md shadow-primary/20">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-ink-faint font-medium mb-0.5">Your Founder Profile</p>
                  <h3 className="text-lg font-bold text-ink">{analysis.founder_type || 'Startup Builder'}</h3>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {analysis.best_startup_categories?.length > 0 && (
                  <div className="rounded-xl border border-border bg-slate-50 p-4">
                    <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-2">Best Categories</p>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.best_startup_categories.map((cat, j) => (
                        <Badge key={j} variant="glow" className="text-[11px]">{cat}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {analysis.strengths?.length > 0 && (
                  <div className="rounded-xl border border-success/15 bg-success/5 p-4">
                    <p className="text-xs font-semibold text-success uppercase tracking-wider mb-2">Strengths</p>
                    <ul className="space-y-1">
                      {analysis.strengths.slice(0, 3).map((s, j) => (
                        <li key={j} className="text-xs text-ink-muted flex items-start gap-1.5">
                          <Award className="h-3.5 w-3.5 text-success mt-0.5 shrink-0" />{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysis.weaknesses?.length > 0 && (
                  <div className="rounded-xl border border-warning/15 bg-warning/5 p-4">
                    <p className="text-xs font-semibold text-warning uppercase tracking-wider mb-2">Growth Areas</p>
                    <ul className="space-y-1">
                      {analysis.weaknesses.slice(0, 3).map((w, j) => (
                        <li key={j} className="text-xs text-ink-muted flex items-start gap-1.5">
                          <span className="text-warning mt-0.5 shrink-0">•</span>{w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Ideas grid */}
        <motion.div
          initial="hidden" animate="visible"
          variants={stagger}
          className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          {ideas.map((idea, i) => {
            const isBest = idea === best;
            const diff = getDifficulty(idea.opportunity_score);

            return (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className={`relative rounded-2xl border bg-white p-6 transition-all duration-300 card-hover ${
                  isBest ? 'border-primary/30 shadow-lg shadow-primary/10' : 'border-border'
                }`}
              >
                {isBest && (
                  <div className="absolute -top-3 left-5">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent-2 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-primary/20">
                      <Star className="h-3 w-3" /> Top Pick
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4 mb-4">
                  <ScoreRing score={idea.opportunity_score} size={60} />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-ink mb-1 truncate">{idea.startup_name}</h3>
                    <p className="text-sm text-primary line-clamp-2 font-medium">{idea.pitch}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  <div>
                    <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-1">Problem</p>
                    <p className="text-sm text-ink-muted leading-relaxed line-clamp-2">{idea.problem}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider mb-1">Solution</p>
                    <p className="text-sm text-ink-muted leading-relaxed line-clamp-2">{idea.solution}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  <Badge variant={diff.variant}>
                    <TrendingUp className="h-3 w-3 mr-1" /> {diff.label}
                  </Badge>
                  {(idea.target_users || []).slice(0, 2).map((u, j) => (
                    <Badge key={j} variant="secondary">{u}</Badge>
                  ))}
                </div>

                <button
                  onClick={() => {
                    sessionStorage.setItem(STORAGE_KEYS.SELECTED_IDEA, JSON.stringify(idea));
                    navigate(`/startup/${encodeURIComponent(idea.startup_name)}`);
                  }}
                  aria-label={`View full plan for ${idea.startup_name}`}
                  className="w-full flex items-center justify-center gap-2 h-11 border border-border bg-slate-50 text-sm font-semibold text-ink-muted hover:bg-gradient-to-r hover:from-primary hover:to-accent-2 hover:text-white hover:border-transparent transition-all duration-200 rounded-xl"
                >
                  View Full Plan
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer links */}
        <div className="text-center mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <button onClick={() => navigate('/input')} className="text-sm text-ink-muted hover:text-primary transition-colors flex items-center gap-2 font-medium">
            <ArrowLeft className="h-4 w-4" /> Generate different ideas
          </button>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-ink-muted hover:text-primary transition-colors font-medium">
            View saved plans →
          </button>
        </div>
      </div>
    </div>
  );
}
