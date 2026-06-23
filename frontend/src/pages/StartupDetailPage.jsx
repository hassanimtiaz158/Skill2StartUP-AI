import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Badge } from '@/components/Badge';
import { toast } from '@/components/Toast';
import { generatePlan, savePlan } from '@/services/api';
import { CardSkeleton } from '@/components/Skeleton';
import {
  Sparkles, ArrowLeft, Save, Copy, Target, Users, TrendingUp,
  AlertTriangle, CheckCircle, Rocket, DollarSign, BarChart3, Zap,
  Shield, Swords, TrendingDown, Map, Clock, Star, Check, X, Loader2,
} from 'lucide-react';
import { STORAGE_KEYS, SCORE_HIGH, SCORE_MEDIUM } from '@/constants';
import { ScoreGauge } from '@/components/ScoreRing';
import { fadeUp, stagger } from '@/config/animations';

function KPICard({ icon: Icon, label, value, color = 'primary' }) {
  const colors = {
    primary: 'bg-primary/5 border-primary/15 text-primary',
    success: 'bg-success/5 border-success/15 text-success',
    warning: 'bg-warning/5 border-warning/15 text-warning',
    neutral: 'bg-slate-50 border-border text-ink-muted',
  };
  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-white/80 border border-current/10 flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] text-ink-faint font-medium truncate">{label}</p>
          <p className="text-sm font-bold text-ink truncate">{value}</p>
        </div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children, color = 'primary' }) {
  const iconColors = {
    primary: 'text-primary bg-primary/10 border-primary/15',
    success: 'text-success bg-success/10 border-success/15',
    warning: 'text-warning bg-warning/10 border-warning/15',
    danger: 'text-danger bg-danger/10 border-danger/15',
    neutral: 'text-ink-muted bg-slate-100 border-border',
  };
  return (
    <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-border flex items-center gap-3">
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center border ${iconColors[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="font-bold text-ink">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function StartupDetailPage() {
  const navigate = useNavigate();
  const { name } = useParams();
  const reducedMotion = useReducedMotion();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const profile = (() => { try { return JSON.parse(sessionStorage.getItem(STORAGE_KEYS.PROFILE) || '{}'); } catch { return {}; } })();
  const idea = (() => { try { return JSON.parse(sessionStorage.getItem(STORAGE_KEYS.SELECTED_IDEA) || '{}'); } catch { return {}; } })();
  const existingPlan = (() => { try { return JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CURRENT_PLAN) || 'null'); } catch { return null; } })();

  useEffect(() => {
    if (existingPlan) {
      setPlan(existingPlan);
      if (existingPlan._id) setSaved(true);
      setLoading(false);
      return;
    }
    if (!idea.startup_name) { navigate('/results'); return; }
    const urlName = decodeURIComponent(name || '');
    if (urlName !== idea.startup_name) {
      sessionStorage.removeItem(STORAGE_KEYS.CURRENT_PLAN);
    }
    loadPlan();
  }, []);

  const loadPlan = async () => {
    setLoading(true); setError(null);
    try {
      const result = await generatePlan(profile, idea);
      setPlan(result);
      sessionStorage.setItem(STORAGE_KEYS.CURRENT_PLAN, JSON.stringify(result));
    } catch (err) { setError(err.message); toast('Failed to generate plan. Try again.', 'error'); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!plan || saved) return;
    if (plan._id) { setSaved(true); toast('This plan is already saved.', 'success'); return; }
    setSaving(true);
    try { await savePlan(profile, plan); setSaved(true); toast('Plan saved!', 'success'); }
    catch { toast('Failed to save plan', 'error'); }
    finally { setSaving(false); }
  };

  const handleCopy = () => {
    if (!plan) return;
    const lines = [
      `# ${plan.startup_name || 'Startup Plan'}`, '', `Pitch: ${plan.pitch || ''}`, '',
      '## Problem', plan.problem || '', '', '## Solution', plan.solution || '', '',
      '## Target Users', ...(plan.target_users || []).map((u) => `- ${u}`), '',
      '## Competitors', ...(plan.competitors || []).map((c) => `- ${c.name || 'Unknown'}: ${c.weaknesses?.join(', ') || ''}`), '',
      '## Competitor Limitations', ...(plan.competitor_limitations || []).map((l) => `- ${l}`), '',
      '## Our Advantages', ...(plan.our_advantages || []).map((a) => `- ${a}`), '',
      '## Market Gaps', ...(plan.market_gaps || []).map((g) => `- ${g}`), '',
      '## MVP Features', ...(plan.mvp_features || []).map((f) => `- ${f}`), '',
      '## Revenue Model', `Pricing: ${plan.revenue_model?.pricing_model || 'N/A'}`, `Recommendation: ${plan.revenue_model?.recommendation || 'N/A'}`, '',
      '## SWOT', 'Strengths:', ...(plan.swot?.strengths || []).map((s) => `- ${s}`),
      'Weaknesses:', ...(plan.swot?.weaknesses || []).map((w) => `- ${w}`),
      'Opportunities:', ...(plan.swot?.opportunities || []).map((o) => `- ${o}`),
      'Threats:', ...(plan.swot?.threats || []).map((t) => `- ${t}`), '',
      '## Pitch', plan.hackathon_pitch || '',
    ];
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      toast('Copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast('Failed to copy — please select and copy manually', 'error');
    });
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-bg overflow-x-hidden pt-32 md:pt-40 lg:pt-48 pb-16 md:pb-20 lg:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink">Generating your plan...</h2>
              <p className="text-sm text-ink-muted">AI is building your startup blueprint</p>
            </div>
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-4"
          >
            <motion.div variants={fadeUp} className="h-40 rounded-2xl bg-white border border-border shadow-sm animate-pulse" />
            <div className="grid sm:grid-cols-2 gap-4">
              <motion.div variants={fadeUp}><CardSkeleton /></motion.div>
              <motion.div variants={fadeUp}><CardSkeleton /></motion.div>
            </div>
            <motion.div variants={fadeUp}><CardSkeleton /></motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="min-h-screen bg-bg overflow-x-hidden flex items-center justify-center pt-32 md:pt-40 lg:pt-48">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-sm text-center p-8"
        >
          <div className="h-14 w-14 rounded-2xl bg-danger/10 border border-danger/15 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="h-7 w-7 text-danger" />
          </div>
          <h2 className="text-xl font-bold text-ink mb-2">Generation failed</h2>
          <p className="text-ink-muted text-sm mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setError(null); loadPlan(); }}
              className="h-12 px-6 rounded-xl bg-gradient-to-r from-primary to-accent-2 text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 flex items-center gap-2"
            >
              <Loader2 className="h-4 w-4" /> Retry
            </button>
            <button onClick={() => navigate('/results')} className="h-12 px-6 border border-border bg-white text-sm text-ink-muted hover:text-ink hover:border-border-strong transition-all duration-200 rounded-xl">Back</button>
          </div>
          <p className="text-xs text-ink-faint mt-4">If this keeps happening, try going back and generating new ideas.</p>
        </motion.div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-bg overflow-x-hidden flex items-center justify-center pt-32 md:pt-40 lg:pt-48">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-sm text-center p-8"
        >
          <div className="h-14 w-14 rounded-2xl bg-warning/10 border border-warning/15 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="h-7 w-7 text-warning" />
          </div>
          <h2 className="text-xl font-bold text-ink mb-2">Plan not found</h2>
          <p className="text-ink-muted text-sm mb-6">The startup plan could not be loaded.</p>
          <button onClick={() => navigate('/results')} className="h-12 px-6 rounded-xl bg-gradient-to-r from-primary to-accent-2 text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-200">Back to Results</button>
        </motion.div>
      </div>
    );
  }

  const swot = [
    { key: 'strengths', label: 'Strengths', color: 'success', icon: Shield, bg: 'bg-success/5 border-success/15', text: 'text-success' },
    { key: 'weaknesses', label: 'Weaknesses', color: 'danger', icon: TrendingDown, bg: 'bg-danger/5 border-danger/15', text: 'text-danger' },
    { key: 'opportunities', label: 'Opportunities', color: 'primary', icon: TrendingUp, bg: 'bg-primary/5 border-primary/15', text: 'text-primary' },
    { key: 'threats', label: 'Threats', color: 'warning', icon: AlertTriangle, bg: 'bg-warning/5 border-warning/15', text: 'text-warning' },
  ];

  return (
    <div className="min-h-screen bg-bg overflow-x-hidden relative">
      {/* Background orbs */}
      <div className="orb w-[400px] h-[400px] bg-primary/8 -top-32 right-0" />
      <div className="orb w-[300px] h-[300px] bg-accent-2/6 bottom-24 -left-24" />

      {/* ── Hero Section ── */}
      <section className="pt-32 md:pt-40 lg:pt-48 pb-16 md:pb-20 lg:pb-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Top bar */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-between mb-8 flex-wrap gap-3"
          >
            <button onClick={() => navigate('/results')} className="flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors shrink-0 font-medium">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 h-9 px-4 border border-border bg-white text-xs text-ink-muted hover:bg-slate-50 hover:border-border-strong transition-all duration-150 rounded-lg font-medium"
                aria-label="Copy plan"
              >
                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleSave}
                disabled={saving || saved}
                className={`flex items-center gap-2 h-9 px-4 text-xs font-semibold transition-all duration-150 rounded-lg ${
                  saved ? 'bg-success/10 border border-success/15 text-success' : 'bg-gradient-to-r from-primary to-accent-2 text-white hover:shadow-lg hover:shadow-primary/20'
                }`}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                {saved ? 'Saved' : 'Save'}
              </button>
            </div>
          </motion.div>

          {/* Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-border bg-white p-6 md:p-8 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <ScoreGauge score={plan.opportunity_score} />
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ink mb-2 truncate">{plan.startup_name}</h1>
                <p className="text-base text-ink-muted leading-relaxed mb-4 line-clamp-2">{plan.pitch}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="glow"><Zap className="h-3 w-3 mr-1" /> {(plan.opportunity_score || 0).toFixed(1)} / 10</Badge>
                  {(plan.target_users || []).slice(0, 3).map((u, i) => <Badge key={i} variant="secondary">{u}</Badge>)}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── KPIs Section ── */}
      <section className="pb-16 md:pb-20 lg:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <motion.div variants={fadeUp}><KPICard icon={Target} label="Problem" value="Defined" color="primary" /></motion.div>
            <motion.div variants={fadeUp}><KPICard icon={Rocket} label="MVP Features" value={`${(plan.mvp_features || []).length}`} color="success" /></motion.div>
            <motion.div variants={fadeUp}><KPICard icon={Swords} label="Competitors" value={`${(plan.competitors || []).length} analyzed`} color="warning" /></motion.div>
            <motion.div variants={fadeUp}><KPICard icon={Map} label="Market Gaps" value={`${(plan.market_gaps || []).length} found`} color="neutral" /></motion.div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider max-w-xs mx-auto" />

      {/* ── Overview Section ── */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="section-label mb-5">Overview</div>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-4">
            <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-4">
              <Section icon={Target} title="Problem" color="primary"><p className="text-sm text-ink-muted leading-relaxed">{plan.problem}</p></Section>
              <Section icon={Zap} title="Solution" color="success"><p className="text-sm text-ink-muted leading-relaxed">{plan.solution}</p></Section>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Section icon={Users} title="Target Users" color="neutral">
                <div className="flex flex-wrap gap-2">
                  {(plan.target_users || []).map((u, i) => <Badge key={i} variant="secondary" className="text-xs px-3 py-1">{u}</Badge>)}
                </div>
              </Section>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider max-w-xs mx-auto" />

      {/* ── Market Analysis Section ── */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="section-label mb-5">Market Analysis</div>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-4">
            <motion.div variants={fadeUp}>
              <Section icon={Swords} title="Competitor Analysis" color="warning">
                <div className="grid sm:grid-cols-2 gap-4">
                  {(plan.competitors || []).map((comp, i) => (
                    <div key={i} className="rounded-xl border border-border bg-slate-50 p-4 space-y-3">
                      <h4 className="font-bold text-sm text-ink truncate">{comp.name || 'Unknown'}</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold text-ink-faint uppercase tracking-wider mb-1.5">Strengths</p>
                          <ul className="space-y-1">
                            {(comp.strengths || []).map((s, j) => (
                              <li key={j} className="text-xs text-ink-muted flex items-start gap-1.5">
                                <Check className="h-3.5 w-3.5 text-success mt-0.5 shrink-0" /><span className="line-clamp-1">{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold text-ink-faint uppercase tracking-wider mb-1.5">Weaknesses</p>
                          <ul className="space-y-1">
                            {(comp.weaknesses || []).map((w, j) => (
                              <li key={j} className="text-xs text-ink-muted flex items-start gap-1.5">
                                <X className="h-3.5 w-3.5 text-danger mt-0.5 shrink-0" /><span className="line-clamp-1">{w}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            </motion.div>

            <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-4">
              <Section icon={AlertTriangle} title="Competitor Limitations" color="warning">
                <div className="space-y-2">
                  {(plan.competitor_limitations || []).map((l, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-warning/5 border border-warning/15">
                      <TrendingDown className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                      <span className="text-sm text-ink-muted">{l}</span>
                    </div>
                  ))}
                </div>
              </Section>
              <Section icon={Shield} title="Our Advantages" color="success">
                <div className="space-y-2">
                  {(plan.our_advantages || []).map((a, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-success/5 border border-success/15">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                      <span className="text-sm text-ink-muted">{a}</span>
                    </div>
                  ))}
                </div>
              </Section>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Section icon={Map} title="Market Gaps" color="neutral">
                <div className="flex flex-wrap gap-2">
                  {(plan.market_gaps || []).map((g, i) => <Badge key={i} variant="gradient" className="text-xs px-3 py-1">{g}</Badge>)}
                </div>
              </Section>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider max-w-xs mx-auto" />

      {/* ── MVP & Roadmap Section ── */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="section-label mb-5">MVP & Roadmap</div>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-4">
            <motion.div variants={fadeUp}>
              <Section icon={Rocket} title="MVP Features" color="primary">
                <div className="grid sm:grid-cols-2 gap-3">
                  {(plan.mvp_features || []).map((f, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/15">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-sm text-ink-muted">{f}</span>
                    </div>
                  ))}
                </div>
              </Section>
            </motion.div>

            {(plan.mvp_v1_scope || (plan.mvp_v2_features || []).length > 0) && (
              <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-4">
                {plan.mvp_v1_scope && (
                  <Section icon={Target} title="Version 1 Scope" color="primary">
                    <p className="text-sm text-ink-muted leading-relaxed">{plan.mvp_v1_scope}</p>
                  </Section>
                )}
                {(plan.mvp_v2_features || []).length > 0 && (
                  <Section icon={Rocket} title="Version 2 Features" color="neutral">
                    <div className="space-y-2">
                      {plan.mvp_v2_features.map((f, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Star className="h-3.5 w-3.5 text-ink-faint mt-0.5 shrink-0" />
                          <span className="text-sm text-ink-muted">{f}</span>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}
              </motion.div>
            )}

            <motion.div variants={fadeUp}>
              <Section icon={Clock} title="4-Week Roadmap" color="neutral">
                <div className="relative pl-14 space-y-5">
                  {/* Vertical line */}
                  <div aria-hidden="true" className="absolute left-[22px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary/30 via-accent-2/20 to-transparent" />
                  {(plan.roadmap || []).map((item, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-14 top-0 h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-accent-2 flex items-center justify-center shadow-md shadow-primary/20">
                        <span className="font-mono text-[10px] font-bold text-white">W{item.week || i + 1}</span>
                      </div>
                      <div className="rounded-xl border border-border bg-slate-50 p-4">
                        <h4 className="font-bold text-sm text-ink mb-2">{item.title}</h4>
                        <ul className="space-y-1">
                          {(item.tasks || []).map((t, j) => (
                            <li key={j} className="text-xs text-ink-muted flex items-start gap-2">
                              <span className="text-ink-faint shrink-0">{'•'}</span>{t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider max-w-xs mx-auto" />

      {/* ── Revenue & Strategy Section ── */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="section-label mb-5">Revenue & Strategy</div>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-4">
            <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-4">
              <Section icon={DollarSign} title="Revenue Model" color="success">
                <div className="space-y-4">
                  {[
                    ['Pricing Model', plan.revenue_model?.pricing_model],
                    ['Recommendation', plan.revenue_model?.recommendation],
                    ['First Customer Strategy', plan.revenue_model?.first_customer_strategy],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-[10px] font-semibold text-ink-faint uppercase tracking-wider mb-1">{label}</p>
                      <p className="text-sm text-ink-muted">{value || 'N/A'}</p>
                    </div>
                  ))}
                  <div>
                    <p className="text-[10px] font-semibold text-ink-faint uppercase tracking-wider mb-2">Monetization</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(plan.revenue_model?.monetization_methods || []).map((m, i) => (
                        <Badge key={i} variant="secondary" className="text-[11px]">{m}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Section>

              <Section icon={BarChart3} title="SWOT Analysis" color="neutral">
                <div className="grid grid-cols-2 gap-3">
                  {swot.map(({ key, label, icon: SwotIcon, bg, text }) => (
                    <div key={key} className={`rounded-lg border p-3 ${bg}`}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <SwotIcon className={`h-3.5 w-3.5 ${text}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${text}`}>{label}</span>
                      </div>
                      <ul className="space-y-1">
                        {(plan.swot?.[key] || []).map((item, i) => (
                          <li key={i} className="text-[11px] text-ink-muted leading-relaxed line-clamp-2">{'•'} {item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Section>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Section icon={AlertTriangle} title="Risks" color="warning">
                <div className="space-y-2">
                  {(plan.risks || []).map((r, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-warning/5 border border-warning/15">
                      <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                      <span className="text-sm text-ink-muted">{r}</span>
                    </div>
                  ))}
                </div>
              </Section>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider max-w-xs mx-auto" />

      {/* ── Pitch Section ── */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="section-label mb-5">Pitch</div>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
            <motion.div variants={fadeUp}>
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent-2 flex items-center justify-center shadow-md shadow-primary/20">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-bold text-ink">Hackathon Pitch</h3>
                </div>
                <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-line">{plan.hackathon_pitch}</p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={handleSave}
                disabled={saving || saved}
                className={`flex items-center justify-center gap-2 h-14 px-8 text-sm font-bold transition-all duration-200 rounded-xl ${
                  saved ? 'bg-success/10 border border-success/15 text-success' : 'bg-gradient-to-r from-primary to-accent-2 text-white hover:shadow-lg hover:shadow-primary/25'
                }`}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                {saved ? 'Plan Saved' : 'Save This Plan'}
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center justify-center gap-2 h-14 px-8 border border-border bg-white text-sm font-semibold text-ink hover:bg-slate-50 hover:border-border-strong transition-all duration-200 rounded-xl"
              >
                View Dashboard
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
