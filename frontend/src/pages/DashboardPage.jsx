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
  return (
    <div className="hidden md:flex flex-col w-64 shrink-0 border-r border-border bg-white h-screen sticky top-0 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent-2 flex items-center justify-center shadow-md shadow-primary/20">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-ink block">Skill2Startup</span>
            <span className="text-xs text-ink-faint">Dashboard</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="p-4 space-y-1" aria-label="Dashboard navigation">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-primary bg-primary/5 rounded-xl border border-primary/10">
          <BarChart3 className="h-5 w-5" />
          Dashboard
        </button>
        <button
          onClick={() => navigate('/input')}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-ink-muted hover:text-ink hover:bg-slate-100 rounded-xl transition-colors"
        >
          <Sparkles className="h-5 w-5" />
          New Plan
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-ink-muted hover:text-ink hover:bg-slate-100 rounded-xl transition-colors"
        >
          <Home className="h-5 w-5" />
          Home
        </button>
      </nav>

      {/* Stats */}
      <div className="mt-auto p-6 border-t border-border space-y-5">
        <div>
          <p className="text-[10px] text-ink-faint uppercase tracking-wider font-semibold mb-1">Total Plans</p>
          <p className="text-2xl font-extrabold text-ink">{plans.length}</p>
        </div>
        <div>
          <p className="text-[10px] text-ink-faint uppercase tracking-wider font-semibold mb-1">Best Score</p>
          <p className="text-2xl font-extrabold text-primary">
            {plans.length ? Math.max(...plans.map((p) => p.plan?.opportunity_score || 0)).toFixed(1) : '—'}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-ink-faint uppercase tracking-wider font-semibold mb-1">High Potential</p>
          <p className="text-2xl font-extrabold text-success">
            {plans.filter((p) => (p.plan?.opportunity_score || 0) >= SCORE_HIGH).length}
          </p>
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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-white safe-bottom"
      style={{ zIndex: 'var(--z-sticky)' }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        <button
          onClick={onNewPlan}
          className="flex flex-col items-center gap-1 px-6 py-2 text-primary"
        >
          <Sparkles className="h-5 w-5" />
          <span className="text-[10px] font-semibold">New Plan</span>
        </button>
        <a
          href="/"
          className="flex flex-col items-center gap-1 px-6 py-2 text-ink-faint"
        >
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

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-bg pt-24 pb-12 md:pt-28 md:pb-16">
        <div className="container">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
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

  /* ── Error ── */
  if (error) {
    return (
      <div className="min-h-screen bg-bg pt-24 pb-12 md:pt-28 md:pb-16">
        <div className="container">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-danger/10 border border-danger/15 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-danger" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink">Connection failed</h2>
              <p className="text-sm text-ink-muted">Couldn't load your saved plans</p>
            </div>
          </div>
          <div className="text-center py-16 rounded-2xl border border-danger/20 bg-white">
            <AlertTriangle className="h-12 w-12 text-danger/40 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-ink mb-2">Unable to connect</h2>
            <p className="text-sm text-ink-muted mb-6 max-w-xs mx-auto">
              Make sure the backend server is running and try again.
            </p>
            <button
              onClick={loadPlans}
              className="inline-flex items-center gap-2 h-12 px-6 bg-gradient-to-r from-primary to-accent-2 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-200"
            >
              <Loader2 className="h-4 w-4" /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar plans={plans} navigate={navigate} />

      {/* Main content */}
      <div className="flex-1 min-w-0 pb-20 md:pb-0">
        <div className="pt-24 pb-8 md:pt-28 md:pb-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent-2/10 border border-primary/15 flex items-center justify-center">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-ink">Saved Plans</h1>
                  <p className="text-sm text-ink-muted">
                    {plans.length > 0
                      ? `${plans.length} startup ${plans.length === 1 ? 'blueprint' : 'blueprints'} saved`
                      : 'Your saved startup blueprints will appear here.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/input')}
                className="hidden md:flex items-center gap-2 h-10 px-5 bg-gradient-to-r from-primary to-accent-2 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-200"
              >
                <Plus className="h-4 w-4" /> New Plan
              </button>
            </motion.div>

            {/* Stats */}
            {plans.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 pb-6 border-b border-border">
                {[
                  { value: plans.length, label: 'Total', color: 'text-ink' },
                  { value: avgScore, label: 'Avg Score', color: 'text-ink' },
                  { value: bestScore, label: 'Best Score', color: 'text-primary' },
                  { value: plans.filter((p) => (p.plan?.opportunity_score || 0) >= SCORE_HIGH).length, label: 'High Potential', color: 'text-success' },
                ].map((stat, i) => (
                  <div key={i} className="rounded-xl border border-border bg-white p-4 shadow-sm">
                    <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Empty state */}
            {plans.length === 0 ? (
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 rounded-2xl border border-dashed border-border-strong bg-white">
                <div className="h-16 w-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mx-auto mb-5">
                  <Rocket className="h-7 w-7 text-ink-faint" />
                </div>
                <h2 className="text-xl font-bold text-ink mb-2">No saved plans yet</h2>
                <p className="text-sm text-ink-muted mb-8 max-w-xs mx-auto">
                  Generate your first startup idea and save it to see it here.
                </p>
                <button
                  onClick={() => navigate('/input')}
                  className="inline-flex items-center gap-2 h-12 px-8 bg-gradient-to-r from-primary to-accent-2 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-200"
                >
                  <Sparkles className="h-4 w-4" /> Generate Your First Plan
                </button>
              </motion.div>
            ) : (
              /* Plan list */
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
                        className="group rounded-2xl border border-border bg-white p-5 hover:border-primary/30 card-hover"
                      >
                        <div className="flex items-start gap-4">
                          <ScoreRing score={plan.opportunity_score} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-1">
                              <div className="min-w-0">
                                <h3 className="font-bold text-base text-ink group-hover:text-primary transition-colors duration-200 truncate">
                                  {plan.startup_name}
                                </h3>
                                <p className="text-sm text-ink-muted mt-0.5 line-clamp-1">{plan.pitch}</p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={() => handleView(doc)}
                                  className="flex items-center gap-2 h-9 px-4 border border-border bg-slate-50 text-xs font-semibold text-ink-muted hover:bg-gradient-to-r hover:from-primary hover:to-accent-2 hover:text-white hover:border-transparent transition-all duration-200 rounded-lg"
                                  aria-label={`View ${plan.startup_name}`}
                                >
                                  <Eye className="h-3.5 w-3.5" /> View
                                </button>
                                <button
                                  onClick={() => handleDelete(doc._id, plan.startup_name)}
                                  disabled={deleting === doc._id}
                                  aria-label={`Delete ${plan.startup_name}`}
                                  className="flex items-center justify-center h-9 w-9 border border-border bg-slate-50 text-ink-faint hover:text-danger hover:border-danger/20 transition-all duration-200 rounded-lg disabled:opacity-40"
                                >
                                  {deleting === doc._id
                                    ? <Loader2 className="h-4 w-4 animate-spin" />
                                    : <Trash2 className="h-4 w-4" />}
                                </button>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              <Badge variant="glow" className="text-[11px]">
                                <TrendingUp className="h-3 w-3 mr-1" /> {(plan.opportunity_score || 0).toFixed(1) || '—'}
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
              <div className="text-center mt-10">
                <button
                  onClick={() => navigate('/input')}
                  className="text-sm text-ink-muted hover:text-primary transition-colors font-medium"
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
