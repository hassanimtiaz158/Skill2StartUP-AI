import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/Badge';
import { toast } from '@/components/Toast';
import { getSavedPlans, deletePlan } from '@/services/api';
import { CardSkeleton } from '@/components/Skeleton';
import {
  Rocket, Trash2, Eye, Sparkles, TrendingUp,
  Loader2, Plus, AlertTriangle, BarChart3, Home,
} from 'lucide-react';
import { STORAGE_KEYS, SCORE_HIGH } from '@/constants';
import { ScoreRing } from '@/components/ScoreRing';
import { stagger } from '@/config/animations';

/* ── Sidebar ── */
function Sidebar({ plans, navigate }) {
  const totalPlans = plans.length;
  const bestScore = totalPlans ? Math.max(...plans.map((p) => p.plan?.opportunity_score || 0)).toFixed(1) : '—';
  const highPotential = plans.filter((p) => (p.plan?.opportunity_score || 0) >= SCORE_HIGH).length;

  return (
    <div className="hidden md:flex md:w-64 md:shrink-0 md:flex-col md:border-r md:border-border md:bg-white md:h-screen md:sticky md:top-0 md:overflow-y-auto">
      <div className="border-b border-border p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent-2 shadow-md shadow-primary/20">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="block text-base font-bold text-ink">Skill2Startup</span>
            <span className="text-xs text-ink-faint">Dashboard</span>
          </div>
        </div>
      </div>
      <nav className="space-y-1 p-4" aria-label="Dashboard navigation">
        <button className="flex w-full items-center gap-3 rounded-xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary">
          <BarChart3 className="h-5 w-5" />
          Dashboard
        </button>
        <button
          onClick={() => navigate('/input')}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-ink-muted transition-colors hover:bg-slate-100 hover:text-ink"
        >
          <Sparkles className="h-5 w-5" />
          New Plan
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-ink-muted transition-colors hover:bg-slate-100 hover:text-ink"
        >
          <Home className="h-5 w-5" />
          Home
        </button>
      </nav>
      {totalPlans > 0 && (
        <div className="px-6 py-4">
          <div className="rounded-xl border border-border bg-gradient-to-br from-primary/5 to-accent-2/5 p-4 space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint">Portfolio</p>
            <div className="flex items-end gap-1.5 h-12">
              {plans.slice(0, 7).map((p, i) => {
                const score = p.plan?.opportunity_score || 0;
                const height = Math.max(15, (score / 10) * 100);
                return (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: i * 0.05, duration: 0.4, ease: 'easeOut' }}
                    className="flex-1 rounded-sm bg-gradient-to-t from-primary/40 to-primary"
                    title={`${p.plan?.startup_name}: ${score.toFixed(1)}`}
                  />
                );
              })}
              {plans.length > 7 && (
                <span className="text-[9px] text-ink-faint ml-1">+{plans.length - 7}</span>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="mt-auto border-t border-border p-6 space-y-5">
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-ink-faint">Total Plans</p>
          <p className="text-2xl font-bold text-ink">{totalPlans}</p>
        </div>
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-ink-faint">Best Score</p>
          <p className="text-2xl font-bold text-primary">{bestScore}</p>
        </div>
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-ink-faint">High Potential</p>
          <p className="text-2xl font-bold text-success">{highPotential}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Mobile bottom nav ── */
function MobileNav({ onNewPlan }) {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white safe-bottom md:hidden"
    >
      <div className="flex items-center justify-around px-2 py-2">
        <button onClick={onNewPlan} className="flex flex-col items-center gap-1 px-6 py-2 text-primary">
          <Sparkles className="h-5 w-5" />
          <span className="text-[10px] font-semibold">New Plan</span>
        </button>
        <a href="/" className="flex flex-col items-center gap-1 px-6 py-2 text-ink-faint">
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-semibold">Home</span>
        </a>
      </div>
    </nav>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const loadPlans = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getSavedPlans();
      setPlans(data.plans || []);
    } catch {
      setError(true);
      toast('Failed to load saved plans', 'error');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadPlans(); }, [loadPlans]);

  const handleDelete = async (planId, startupName) => {
    if (!window.confirm(`Delete "${startupName}"? This cannot be undone.`)) return;
    setDeleting(planId);
    try {
      await deletePlan(planId);
      setPlans((prev) => prev.filter((p) => p._id !== planId));
      toast('Plan deleted', 'success');
    } catch { toast('Failed to delete plan', 'error'); }
    finally { setDeleting(null); }
  };

  const handleView = (doc) => {
    sessionStorage.setItem(STORAGE_KEYS.CURRENT_PLAN, JSON.stringify(doc.plan));
    sessionStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(doc.profile));
    const idea = {
      startup_name: doc.plan.startup_name,
      pitch: doc.plan.pitch,
      problem: doc.plan.problem,
      solution: doc.plan.solution,
      target_users: doc.plan.target_users,
      why_now: doc.plan.why_now,
      opportunity_score: doc.plan.opportunity_score,
    };
    sessionStorage.setItem(STORAGE_KEYS.SELECTED_IDEA, JSON.stringify(idea));
    navigate(`/startup/${encodeURIComponent(doc.plan.startup_name)}`);
  };

  const avgScore = plans.length
    ? (plans.reduce((s, p) => s + (p.plan?.opportunity_score || 0), 0) / plans.length).toFixed(1)
    : '—';
  const bestScore = plans.length
    ? Math.max(...plans.map((p) => p.plan?.opportunity_score || 0)).toFixed(1)
    : '—';

  if (loading) {
    return (
      <div className="min-h-screen bg-bg pt-24 pb-12 md:pt-28 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/15 bg-primary/10">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink">Loading your plans…</h2>
              <p className="text-sm text-ink-muted">Fetching saved startup plans</p>
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg pt-24 pb-12 md:pt-28 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-danger/15 bg-danger/10">
              <AlertTriangle className="h-5 w-5 text-danger" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink">Connection failed</h2>
              <p className="text-sm text-ink-muted">Couldn&apos;t load your saved plans</p>
            </div>
          </div>
          <div className="rounded-2xl border border-danger/20 bg-white py-16 text-center">
            <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-danger/40" />
            <h2 className="mb-2 text-xl font-bold text-ink">Unable to connect</h2>
            <p className="mx-auto mb-6 max-w-xs text-sm text-ink-muted">
              Make sure the backend server is running and try again.
            </p>
            <button
              onClick={loadPlans}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent-2 px-6 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30"
            >
              <Loader2 className="h-4 w-4" /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex overflow-x-hidden">
      <Sidebar plans={plans} navigate={navigate} />

      <div className="flex-1 min-w-0 pb-20 md:pb-0">
        <div className="pt-24 pb-8 md:pt-28 md:pb-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/15 bg-gradient-to-br from-primary/10 to-accent-2/10">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-ink md:text-3xl">Saved Plans</h1>
                  <p className="text-sm text-ink-muted">
                    {plans.length > 0
                      ? `${plans.length} startup ${plans.length === 1 ? 'blueprint' : 'blueprints'} saved`
                      : 'Your saved startup blueprints will appear here.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/input')}
                className="hidden h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent-2 px-5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 md:inline-flex"
              >
                <Plus className="h-4 w-4" /> New Plan
              </button>
            </motion.div>

            {plans.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-8 grid grid-cols-2 gap-4 border-b border-border pb-6 sm:grid-cols-4"
              >
                {[
                  { value: plans.length, label: 'Total', color: 'text-ink' },
                  { value: avgScore, label: 'Avg Score', color: 'text-ink' },
                  { value: bestScore, label: 'Best Score', color: 'text-primary' },
                  { value: plans.filter((p) => (p.plan?.opportunity_score || 0) >= SCORE_HIGH).length, label: 'High Potential', color: 'text-success' },
                ].map((stat, i) => (
                  <div key={i} className="rounded-xl border border-border bg-white p-4 shadow-sm">
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {plans.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-dashed border-border-strong bg-white py-20 text-center"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5">
                  <Rocket className="h-7 w-7 text-ink-faint" />
                </div>
                <h2 className="mb-2 text-xl font-bold text-ink">No saved plans yet</h2>
                <p className="mx-auto mb-8 max-w-xs text-sm text-ink-muted">
                  Generate your first startup idea and save it to see it here.
                </p>
                <button
                  onClick={() => navigate('/input')}
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent-2 px-8 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30"
                >
                  <Sparkles className="h-4 w-4" /> Generate Your First Plan
                </button>
              </motion.div>
            ) : (
              <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-3">
                <AnimatePresence>
                  {plans.map((doc, i) => {
                    const plan = doc.plan;
                    return (
                      <motion.div
                        key={doc._id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: i * 0.03, duration: 0.25 }}
                        className="group rounded-2xl border border-border bg-white p-5 shadow-sm transition-all duration-250 hover:-translate-y-1 hover:border-primary/20 hover:shadow-md"
                      >
                        <div className="flex items-start gap-4">
                          <ScoreRing score={plan.opportunity_score} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h3 className="truncate text-base font-bold text-ink transition-colors duration-200 group-hover:text-primary">
                                  {plan.startup_name}
                                </h3>
                                <p className="mt-0.5 line-clamp-1 text-sm text-ink-muted">{plan.pitch}</p>
                              </div>
                              <div className="flex shrink-0 items-center gap-2">
                                <button
                                  onClick={() => handleView(doc)}
                                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-slate-50 px-4 text-xs font-semibold text-ink-muted transition-all duration-200 hover:border-transparent hover:bg-gradient-to-r hover:from-primary hover:to-accent-2 hover:text-white"
                                  aria-label={`View ${plan.startup_name}`}
                                >
                                  <Eye className="h-3.5 w-3.5" /> View
                                </button>
                                <button
                                  onClick={() => handleDelete(doc._id, plan.startup_name)}
                                  disabled={deleting === doc._id}
                                  aria-label={`Delete ${plan.startup_name}`}
                                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-slate-50 text-ink-faint transition-all duration-200 hover:border-danger/20 hover:text-danger disabled:opacity-40"
                                >
                                  {deleting === doc._id
                                    ? <Loader2 className="h-4 w-4 animate-spin" />
                                    : <Trash2 className="h-4 w-4" />}
                                </button>
                              </div>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              <Badge variant="glow" className="text-[11px]">
                                <TrendingUp className="mr-1 h-3 w-3" /> {(plan.opportunity_score || 0).toFixed(1) || '—'}
                              </Badge>
                              {(plan.target_users || []).slice(0, 2).map((u, j) => (
                                <Badge key={j} variant="secondary" className="text-[11px]">{u}</Badge>
                              ))}
                              {(plan.target_users || []).length > 2 && (
                                <Badge variant="secondary" className="text-[11px]">+{plan.target_users.length - 2}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}

            {plans.length > 0 && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => navigate('/input')}
                  className="text-sm font-medium text-ink-muted transition-colors hover:text-primary"
                >
                  ← Generate more ideas
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <MobileNav onNewPlan={() => navigate('/input')} />
    </div>
  );
}
