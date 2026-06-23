import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Input } from '@/components/Input';
import { Badge } from '@/components/Badge';
import { toast } from '@/components/Toast';
import { analyzeProfile, generateIdeas } from '@/services/api';
import {
  Sparkles, ArrowRight, ArrowLeft, Check, X,
  Code, Heart, Target, DollarSign, Clock, Briefcase, Lightbulb,
} from 'lucide-react';
import {
  EXPERIENCE_OPTIONS, GOAL_OPTIONS, SUGGESTED_SKILLS, SUGGESTED_INTERESTS,
  STORAGE_KEYS,
} from '@/constants';

const steps = [
  { id: 1, title: 'Skills & Interests', icon: Code },
  { id: 2, title: 'Resources', icon: Briefcase },
  { id: 3, title: 'Your Goal', icon: Target },
];

const slideVariants = (reducedMotion) => ({
  enter: (dir) => reducedMotion
    ? { opacity: 0 }
    : { x: dir > 0 ? 60 : -60, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: (dir) => reducedMotion
    ? { opacity: 0 }
    : { x: dir < 0 ? 60 : -60, opacity: 0 },
});

/* ── Chip Input ── */
function ChipInput({ label, value, onChange, placeholder, icon: Icon, error, suggestions }) {
  const [draft, setDraft] = useState('');
  const chips = value ? value.split(',').map((s) => s.trim()).filter(Boolean) : [];
  const [focused, setFocused] = useState(false);

  const add = (raw) => {
    const t = raw.trim();
    if (t && !chips.includes(t)) onChange({ target: { value: [...chips, t].join(', ') } });
    setDraft('');
  };

  const remove = (idx) => {
    onChange({ target: { value: chips.filter((_, i) => i !== idx).join(', ') } });
  };

  const onKey = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && draft.trim()) { e.preventDefault(); add(draft); }
    if (e.key === 'Backspace' && !draft && chips.length) remove(chips.length - 1);
  };

  const availableSuggestions = suggestions.filter((s) => !chips.includes(s));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-ink flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-primary" />}
          {label}
        </label>
        <span className={`text-xs font-semibold tabular-nums ${chips.length > 0 ? 'text-primary' : 'text-ink-faint'}`}>
          {chips.length} added
        </span>
      </div>

      <div className={`rounded-xl border bg-white p-4 transition-all duration-200 ${
        error
          ? 'border-danger/50'
          : focused
          ? 'border-primary/40 ring-4 ring-primary/10'
          : 'border-border'
      }`}>
        {/* Chips */}
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {chips.map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary/10 to-accent-2/10 border border-primary/20 px-3 py-1.5 text-xs font-medium text-primary"
              >
                {chip}
                <button
                  type="button"
                  onClick={() => remove(chips.indexOf(chip))}
                  aria-label={`Remove ${chip}`}
                  className="h-4 w-4 rounded-full flex items-center justify-center hover:bg-primary/20 text-primary/60 hover:text-danger transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Input */}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); if (draft.trim()) add(draft); }}
          placeholder={chips.length === 0 ? placeholder : 'Add another…'}
          className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
        />

        {/* Suggestions */}
        {focused && availableSuggestions.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-[10px] font-semibold text-ink-faint uppercase tracking-wider mb-2">Suggestions</p>
            <div className="flex flex-wrap gap-1.5">
              {availableSuggestions.slice(0, 8).map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => add(s)}
                  className="rounded-full border border-border bg-slate-50 px-3 py-1 text-xs font-medium text-ink-muted hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all duration-150"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-danger flex items-center gap-1" role="alert"><span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-danger/10 text-[10px]">⚠</span> {error}</p>}
      {chips.length === 0 && !error && (
        <p className="text-xs text-ink-faint flex items-center gap-1">
          <Lightbulb className="h-3 w-3" /> Type your own or pick from suggestions
        </p>
      )}
    </div>
  );
}

/* ── Page ── */
export default function InputPage() {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [form, setForm] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEYS.FORM_DRAFT);
      return saved ? JSON.parse(saved) : {
        skills: '', interests: '', experience_level: 'Intermediate',
        budget: '', time_per_week: '', preferred_industry: '', goal: '',
      };
    } catch {
      return {
        skills: '', interests: '', experience_level: 'Intermediate',
        budget: '', time_per_week: '', preferred_industry: '', goal: '',
      };
    }
  });

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.FORM_DRAFT, JSON.stringify(form));
  }, [form]);

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }));
  };

  const isValid =
    form.skills.trim().length > 0 && form.interests.trim().length > 0 &&
    form.goal.length > 0 && Number(form.budget) > 0 && Number(form.time_per_week) > 0;

  const validate = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.skills.trim()) e.skills = 'Add at least one skill to get started';
      if (!form.interests.trim()) e.interests = 'Add at least one interest to personalize your ideas';
    }
    if (s === 2) {
      if (!form.budget || Number(form.budget) <= 0) e.budget = "Every startup needs a budget — even $1 counts";
      if (!form.time_per_week || Number(form.time_per_week) <= 0) e.time_per_week = 'How many hours can you commit per week?';
    }
    if (s === 3) if (!form.goal) e.goal = 'Pick what resonates most with you';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (!validate(step)) return; setDir(1); setStep((s) => Math.min(s + 1, 3)); };
  const prev = () => { setDir(-1); setStep((s) => Math.max(s - 1, 1)); };

  const submit = async () => {
    if (!validate(3)) return;
    setLoading(true);
    try {
      const profile = {
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        interests: form.interests.split(',').map((s) => s.trim()).filter(Boolean),
        experience_level: form.experience_level, budget: form.budget,
        time_per_week: form.time_per_week, preferred_industry: form.preferred_industry, goal: form.goal,
      };
      const [analysis, ideas] = await Promise.allSettled([
        analyzeProfile(profile),
        generateIdeas(profile),
      ]);
      sessionStorage.removeItem(STORAGE_KEYS.FORM_DRAFT);
      sessionStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      if (analysis.status === 'fulfilled') {
        sessionStorage.setItem(STORAGE_KEYS.PROFILE_ANALYSIS, JSON.stringify(analysis.value));
      }
      if (ideas.status === 'fulfilled') {
        sessionStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(ideas.value));
        navigate('/results');
      } else {
        throw ideas.reason;
      }
    } catch (err) {
      toast(err.message || 'Failed to generate ideas', 'error');
    } finally { setLoading(false); }
  };

  const stepTitles = {
    1: { emoji: '👋', title: "What's in your toolkit?", subtitle: 'Tell us what you know and what excites you. The more specific, the better your ideas will be.' },
    2: { emoji: '💪', title: 'What resources do you have?', subtitle: "Be honest — we'll match ideas to what's realistic for you." },
    3: { emoji: '🎯', title: 'What are you building toward?', subtitle: 'Pick the one that feels right. You can always explore others later.' },
  };

  return (
    <div className="min-h-screen bg-bg pt-24 pb-12 md:pt-28 md:pb-16 relative">
      {/* Background */}
      <div className="orb w-[400px] h-[400px] bg-primary/10 -top-32 -right-32" />
      <div className="orb w-[300px] h-[300px] bg-accent/10 bottom-0 -left-32" />

      <div className="max-w-xl mx-auto px-4 sm:px-6 relative">

        {/* ── Header ── */}
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/15 px-4 py-2 text-xs font-semibold text-primary mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Step {step} of 3
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink mb-3">
            Let's find your <span className="gradient-text">perfect startup</span>
          </h1>
          <p className="text-base text-ink-muted max-w-sm mx-auto">
            Answer a few questions and our AI will generate personalized startup ideas just for you.
          </p>
        </div>

        {/* ── Step indicators ── */}
        <div className="flex items-center justify-center mb-8 md:mb-10 relative">
          {/* Track */}
          <div className="absolute top-6 left-[20%] right-[20%] h-0.5 bg-border" />
          <div
            className="absolute top-6 left-[20%] h-0.5 bg-gradient-to-r from-primary to-accent-2 transition-all duration-500"
            style={{ width: step === 1 ? '0%' : step === 2 ? '30%' : '60%' }}
          />

          {steps.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center flex-1">
              <button
                onClick={() => { if (s.id < step) { setDir(-1); setStep(s.id); } }}
                className={`h-12 w-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step > s.id
                    ? 'bg-success text-white shadow-lg shadow-success/20'
                    : step === s.id
                    ? 'bg-gradient-to-br from-primary to-accent-2 text-white shadow-lg shadow-primary/25'
                    : 'bg-white border-2 border-border text-ink-faint'
                }`}
                aria-label={`Step ${s.id}: ${s.title}`}
                aria-current={step === s.id ? 'step' : undefined}
              >
                {step > s.id ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
              </button>
              <span className={`mt-3 text-xs font-semibold hidden sm:block ${
                step === s.id ? 'text-primary' : step > s.id ? 'text-success' : 'text-ink-faint'
              }`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* ── Form card ── */}
        <form onSubmit={(e) => { e.preventDefault(); if (step < 3) next(); else submit(); }} className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-lg shadow-slate-200/50">
          {/* Step title */}
          <div className="mb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                <h2 className="text-xl sm:text-2xl font-bold text-ink mb-1">
                  {stepTitles[step].emoji} {stepTitles[step].title}
                </h2>
                <p className="text-sm text-ink-muted">{stepTitles[step].subtitle}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={slideVariants(reducedMotion)}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reducedMotion ? 0.01 : 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Step 1: Skills & Interests */}
              {step === 1 && (
                <div className="space-y-6">
                  <ChipInput
                    label="Your Skills"
                    value={form.skills}
                    onChange={(e) => update('skills', e.target.value)}
                    placeholder="e.g. Python, React, Design, AI/ML…"
                    icon={Code}
                    error={errors.skills}
                    suggestions={SUGGESTED_SKILLS}
                  />
                  <ChipInput
                    label="Your Interests"
                    value={form.interests}
                    onChange={(e) => update('interests', e.target.value)}
                    placeholder="e.g. Education, SaaS, Gaming, Health…"
                    icon={Heart}
                    error={errors.interests}
                    suggestions={SUGGESTED_INTERESTS}
                  />
                </div>
              )}

              {/* Step 2: Resources */}
              {step === 2 && (
                <div className="space-y-6">
                  {/* Experience */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-ink flex items-center gap-2">
                      <Code className="h-4 w-4 text-primary" />
                      Experience Level
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {EXPERIENCE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => update('experience_level', opt.value)}
                          className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-200 ${
                            form.experience_level === opt.value
                              ? 'border-primary/40 bg-primary/5 ring-2 ring-primary/10'
                              : 'border-border bg-white hover:border-border-strong'
                          }`}
                        >
                          <span className="text-sm font-semibold text-ink leading-tight">{opt.label}</span>
                          <span className="text-xs text-ink-faint mt-1">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget + Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Budget ($)"
                      type="number"
                      min="1"
                      step="1"
                      value={form.budget}
                      onChange={(e) => update('budget', e.target.value)}
                      icon={DollarSign}
                      error={errors.budget}
                      hint="Even $50 is a start"
                      id="budget-input"
                    />
                    <Input
                      label="Hours / Week"
                      type="number"
                      min="1"
                      step="1"
                      value={form.time_per_week}
                      onChange={(e) => update('time_per_week', e.target.value)}
                      icon={Clock}
                      error={errors.time_per_week}
                      hint="Be realistic"
                      id="time-input"
                    />
                  </div>

                  {/* Industry */}
                  <Input
                    label="Preferred Industry"
                    placeholder="e.g. EdTech, FinTech, HealthTech…"
                    value={form.preferred_industry}
                    onChange={(e) => update('preferred_industry', e.target.value)}
                    icon={Briefcase}
                    hint="Leave blank for broader suggestions"
                    id="industry-input"
                  />
                </div>
              )}

              {/* Step 3: Goal */}
              {step === 3 && (
                <div className="space-y-6">
                  {/* Goal cards */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-ink flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      What Do You Want to Build?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {GOAL_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => update('goal', opt.value)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all duration-200 ${
                            form.goal === opt.value
                              ? 'border-primary/40 bg-primary/5 ring-2 ring-primary/10'
                              : 'border-border bg-white hover:border-border-strong'
                          }`}
                        >
                          <span className={`text-sm font-semibold leading-tight ${
                            form.goal === opt.value ? 'text-primary' : 'text-ink-muted'
                          }`}>
                            {opt.label}
                          </span>
                        </button>
                      ))}
                    </div>
                    {errors.goal && <p className="text-xs text-danger flex items-center gap-1" role="alert"><span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-danger/10 text-[10px]">⚠</span> {errors.goal}</p>}
                  </div>

                  {/* Summary */}
                  {(form.skills || form.interests || form.goal) && (
                    <div className="rounded-xl border border-border bg-slate-50 p-5">
                      <h3 className="text-sm font-bold text-ink mb-4 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-warning" />
                        Quick Summary
                      </h3>
                      <div className="space-y-3 text-sm">
                        {form.skills && (
                          <div className="flex flex-wrap items-start gap-2">
                            <span className="text-ink-faint shrink-0 w-16 text-xs pt-0.5 font-medium">Skills</span>
                            <div className="flex flex-wrap gap-1.5">
                              {form.skills.split(',').map((s) => s.trim()).filter(Boolean).map((s) => (
                                <Badge key={s} variant="gradient" className="text-[11px]">{s}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {form.interests && (
                          <div className="flex flex-wrap items-start gap-2">
                            <span className="text-ink-faint shrink-0 w-16 text-xs pt-0.5 font-medium">Interests</span>
                            <div className="flex flex-wrap gap-1.5">
                              {form.interests.split(',').map((s) => s.trim()).filter(Boolean).map((s) => (
                                <Badge key={s} variant="secondary" className="text-[11px]">{s}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {form.experience_level && (
                          <div className="flex items-center gap-2">
                            <span className="text-ink-faint shrink-0 w-16 text-xs font-medium">Level</span>
                            <span className="text-ink text-xs font-semibold">{form.experience_level}</span>
                          </div>
                        )}
                        {form.budget && (
                          <div className="flex items-center gap-2">
                            <span className="text-ink-faint shrink-0 w-16 text-xs font-medium">Budget</span>
                            <span className="text-ink text-xs font-semibold">${form.budget}</span>
                          </div>
                        )}
                        {form.time_per_week && (
                          <div className="flex items-center gap-2">
                            <span className="text-ink-faint shrink-0 w-16 text-xs font-medium">Time</span>
                            <span className="text-ink text-xs font-semibold">{form.time_per_week}h / week</span>
                          </div>
                        )}
                        {form.goal && (
                          <div className="flex items-center gap-2">
                            <span className="text-ink-faint shrink-0 w-16 text-xs font-medium">Goal</span>
                            <span className="text-primary text-xs font-semibold">{form.goal}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ── Navigation buttons ── */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border gap-3">
            {step > 1 ? (
              <button
                onClick={prev}
                className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-ink-muted hover:text-ink rounded-xl hover:bg-slate-100 transition-all duration-150"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                onClick={next}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent-2 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 btn-press"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={loading || !isValid}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-accent-2 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed btn-press"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Ideas ✨
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        <p className="text-center text-xs text-ink-faint mt-6">
          🔒 Your data stays local. We never store your personal information.
        </p>
      </div>
    </div>
  );
}
