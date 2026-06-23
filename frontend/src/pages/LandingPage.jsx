import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import {
  Lightbulb, Target, Rocket, BarChart3, Users, Zap,
  ArrowRight, Sparkles, Loader2, Star, Brain,
  Code, Play,
} from 'lucide-react';
import { fadeUp, stagger } from '@/config/animations';

/* ── Container ── */
const Section = ({ children, className = '', id }) => (
  <section id={id} className={`py-16 md:py-20 lg:py-24 ${className}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  </section>
);

/* ── Section heading ── */
const SectionHeading = ({ badge, title, highlight, description, light = false }) => (
  <motion.div
    initial="hidden" whileInView="visible"
    viewport={{ once: true, margin: '-60px' }}
    variants={stagger}
    className="text-center mb-12 lg:mb-16"
  >
    {badge && (
      <motion.div variants={fadeUp} custom={0} className="section-label mb-4">
        {badge}
      </motion.div>
    )}
    <motion.h2
      variants={fadeUp}
      custom={1}
      className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-4 ${light ? 'text-white' : 'text-ink'}`}
    >
      {title}{' '}
      {highlight && <span className={light ? 'text-white/60' : 'text-ink-faint'}>{highlight}</span>}
    </motion.h2>
    {description && (
      <motion.p
        variants={fadeUp}
        custom={2}
        className={`text-base sm:text-lg max-w-xl mx-auto leading-relaxed ${light ? 'text-white/70' : 'text-ink-muted'}`}
      >
        {description}
      </motion.p>
    )}
  </motion.div>
);

/* ── Typing animation for hero preview ── */
const TYPING_WORDS = ['SkillPath AI', 'CodeMentor', 'DevMatch', 'PixelForge', 'DataLens'];

function useTypingCycle(words, interval = 3000) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[index];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayed(word.slice(0, displayed.length + 1));
        if (displayed.length === word.length) {
          setTimeout(() => setIsDeleting(true), interval);
        }
      } else {
        setDisplayed(word.slice(0, displayed.length - 1));
        if (displayed.length === 0) {
          setIsDeleting(false);
          setIndex((i) => (i + 1) % words.length);
        }
      }
    }, isDeleting ? 60 : 120);
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, index, words, interval]);

  return displayed;
}

/* ── Feature cards ── */
const features = [
  { icon: Lightbulb, title: 'AI-Powered Ideas', desc: 'Personalized startup ideas built around your unique skills, interests, and goals.', color: 'from-violet-500 to-purple-600' },
  { icon: Target, title: 'Opportunity Scoring', desc: 'Each idea scored on feasibility, market demand, monetization, and founder fit.', color: 'from-blue-500 to-cyan-500' },
  { icon: BarChart3, title: 'Competitor Analysis', desc: 'Map competitor weaknesses and find market gaps before you write a line of code.', color: 'from-pink-500 to-rose-500' },
  { icon: Rocket, title: 'MVP Roadmap', desc: 'A 4-week execution plan to go from concept to launch-ready MVP.', color: 'from-amber-500 to-orange-500' },
  { icon: Zap, title: 'Revenue Strategy', desc: 'Pricing models, monetization paths, and your first customer strategy.', color: 'from-emerald-500 to-teal-500' },
  { icon: Users, title: 'Pitch Content', desc: 'Hackathon pitches, elevator pitches, and investor-ready summaries.', color: 'from-indigo-500 to-blue-500' },
];

/* ── Steps ── */
const steps = [
  { title: 'Enter your skills', desc: 'What you know, what you love, what you want to build.', icon: Sparkles, color: 'from-violet-500 to-purple-600' },
  { title: 'AI generates opportunities', desc: 'Your founder profile, startup ideas, and opportunity scores.', icon: Zap, color: 'from-blue-500 to-cyan-500' },
  { title: 'Pick your best idea', desc: 'Competitor analysis, market gaps, scored side by side.', icon: Target, color: 'from-pink-500 to-rose-500' },
  { title: 'Launch with a full plan', desc: 'MVP roadmap, revenue model, SWOT, pitch — ready to build.', icon: Rocket, color: 'from-amber-500 to-orange-500' },
];


/* ── Hero Preview Card (signature element) ── */
function HeroPreviewCard() {
  const displayed = useTypingCycle(TYPING_WORDS);
  const [score] = useState(8.7);
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
      whileHover={reducedMotion ? {} : { y: -4, rotateX: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow ring behind card */}
      <div className="absolute -inset-3 -z-10 rounded-3xl bg-gradient-to-br from-primary/15 via-accent-2/10 to-accent/10 blur-xl" />

      <div className="rounded-2xl border border-border bg-gradient-to-b from-white to-slate-50/50 p-6 shadow-xl shadow-slate-200/50">
        {/* Card header */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent-2 shadow-md shadow-primary/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-ink-faint">AI Output Preview</span>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-success/40 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              <span className="text-xs text-ink-faint">Generating</span>
            </div>
          </div>
        </div>

        {/* Idea card with typing name */}
        <div className="rounded-xl border border-border bg-slate-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-ink min-h-[1.25rem]">
              {displayed}
              <span className="ml-0.5 inline-block w-0.5 h-4 bg-primary animate-pulse" />
            </p>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: 'spring', stiffness: 300 }}
              className="inline-flex items-center gap-1 rounded-full border border-success/20 bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success shadow-sm shadow-success/20"
            >
              {score.toFixed(1)} / 10
            </motion.span>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-3 text-sm leading-relaxed text-ink-muted"
          >
            An AI mentor that turns student skills into personalized career and startup roadmaps.
          </motion.p>
          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gradient-to-r from-slate-100 to-slate-200 shadow-inner">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent-2"
                initial={{ width: 0 }}
                animate={{ width: `${(score / 10) * 100}%` }}
                transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
              />
            </div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="font-mono text-xs font-bold text-primary"
            >
              {score.toFixed(1)}
            </motion.span>
          </div>
        </div>

        {/* Tag grid */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { label: 'MVP Plan', icon: BarChart3, color: 'text-primary/60' },
            { label: 'Competitors', icon: Target, color: 'text-accent/60' },
            { label: 'Roadmap', icon: Rocket, color: 'text-accent-2/60' },
          ].map((tag, i) => (
            <motion.div
              key={tag.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.1 }}
              whileHover={reducedMotion ? {} : { y: -2, borderColor: 'rgba(99,102,241,0.3)' }}
              className="rounded-lg border border-border bg-slate-50 p-2.5 text-center transition-colors duration-200 hover:bg-primary/5"
            >
              <span className="flex items-center justify-center gap-1 text-[11px] font-medium text-ink-faint">
                <tag.icon className={`h-3 w-3 ${tag.color}`} />
                {tag.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Audience badges */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {[
            { tag: 'Students', cls: 'border-violet-200 text-violet-600' },
            { tag: 'Freelancers', cls: 'border-cyan-200 text-cyan-600' },
            { tag: 'Hackathon', cls: 'border-pink-200 text-pink-600' },
          ].map((item, i) => (
            <motion.span
              key={item.tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8 + i * 0.08 }}
              whileHover={reducedMotion ? {} : { scale: 1.05, backgroundColor: 'rgba(99,102,241,0.08)' }}
              className={`inline-flex items-center rounded-full border ${item.cls} bg-slate-100 px-3 py-1 text-[11px] font-medium transition-all duration-200`}
            >
              {item.tag}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Decorative layers */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="absolute -inset-x-3 -inset-y-3 -z-10 rounded-2xl border border-primary/10 bg-primary/5"
        style={{ top: 12, left: 12, right: 12, bottom: 12 }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute -z-10 rounded-2xl border border-accent-2/10 bg-accent-2/5"
        style={{ top: 24, left: 24, right: 24, bottom: 24 }}
      />
    </motion.div>
  );
}

/* ── Main page ── */
export default function LandingPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const reducedMotion = useReducedMotion();

  const handleGenerateClick = (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    navigate('/input');
  };

  return (
    <div className="min-h-screen bg-bg overflow-x-hidden">

      {/* ═══════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════ */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background mesh */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.12),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_80%,rgba(236,72,153,0.08),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_20%_60%,rgba(139,92,246,0.07),transparent)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>
        <div className="orb w-[500px] h-[500px] bg-primary/20 top-[-120px] left-[-100px]" />
        <div className="orb w-[400px] h-[400px] bg-accent/15 bottom-[-60px] right-[-60px]" />
        <div className="orb w-[300px] h-[300px] bg-cyan/10 top-[30%] right-[15%]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Copy */}
            <motion.div className="lg:col-span-7">
              <motion.div initial="hidden" animate="visible" variants={stagger}>

                {/* Badge (1b) */}
                <motion.div variants={fadeUp} custom={0} className="mb-6">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-accent-2/10 border border-primary/15 px-4 py-2 text-xs font-semibold text-primary shadow-sm shadow-primary/10 hover:shadow-primary/20 transition-shadow">
                    <Sparkles className="h-3 w-3" />
                    AI-Powered Startup Incubator
                  </span>
                </motion.div>

                {/* Title (1c) */}
                <motion.h1
                  variants={fadeUp}
                  custom={1}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold tracking-tight leading-[1.15] mb-6 text-ink"
                  style={{ textShadow: '0 2px 30px rgba(99,102,241,0.08)' }}
                >
                  Turn Your Skills{' '}
                  <span className="gradient-text">Into a Startup</span>
                </motion.h1>

                {/* Description */}
                <motion.p
                  variants={fadeUp}
                  custom={2}
                  className="text-base sm:text-lg text-ink-muted mb-8 max-w-xl leading-relaxed"
                >
                  Describe your skills, interests, and goals. Our AI generates personalized startup ideas,
                  full MVP plans, competitor analysis, and pitch content — in seconds.
                </motion.p>

                {/* CTA buttons */}
                <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <motion.button
                    onClick={handleGenerateClick}
                    disabled={isLoading}
                    whileHover={reducedMotion ? {} : { scale: 1.02, y: -1 }}
                    whileTap={reducedMotion ? {} : { scale: 0.97 }}
                    className="relative overflow-hidden group inline-flex h-14 min-w-[200px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent-2 px-8 text-base font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-60 disabled:cursor-not-allowed animate-pulse-glow btn-press"
                  >
                    <span className="pointer-events-none absolute inset-0 rounded-xl overflow-hidden">
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer-btn_0.8s_ease-in-out]" />
                    </span>
                    {isLoading ? (
                      <><Loader2 className="h-5 w-5 animate-spin" /> Loading…</>
                    ) : (
                      <>Generate My Startup <ArrowRight className="h-5 w-5" /></>
                    )}
                  </motion.button>
                  <a
                    href="#how-it-works"
                    className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-border bg-white px-8 text-base font-semibold text-ink shadow-sm transition-all duration-200 hover:border-primary/30 hover:bg-primary/5"
                  >
                    <Play className="h-4 w-4 text-primary" />
                    See How It Works
                    <ArrowRight className="h-3.5 w-3.5 text-ink-faint hover:translate-x-0.5 transition-transform" />
                  </a>
                </motion.div>

                {/* Trust badges (1f) */}
                <motion.div variants={fadeUp} custom={4} className="mt-8 flex flex-wrap items-center gap-4">
                  <div className="flex -space-x-2">
                    {['SC', 'MJ', 'PP', 'AK'].map((i) => (
                      <div key={i} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-primary/20 to-accent-2/20 shadow-sm ring-2 ring-white hover:ring-primary/30 hover:scale-110 transition-all duration-200 cursor-default">
                        <span className="text-[10px] font-bold text-primary">{i}</span>
                      </div>
                    ))}
                  </div>
                  <motion.div
                    className="flex flex-col"
                    whileHover={reducedMotion ? {} : { x: 2 }}
                  >
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-4 w-4 fill-warning text-warning" />
                      ))}
                      <span className="ml-0.5 text-sm font-semibold text-ink">4.9/5</span>
                    </div>
                    <p className="text-xs text-ink-faint">from 2,000+ builders</p>
                  </motion.div>
                </motion.div>

              </motion.div>
            </motion.div>

            {/* Preview card — desktop only */}
            <div className="hidden lg:block lg:col-span-5">
              <HeroPreviewCard />
            </div>
          </div>
        </div>

        {/* Scroll fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════
          PIPELINE — skills → startup (distinctive banner)
          ═══════════════════════════════════════════ */}
      <section className="border-y border-border bg-gradient-to-r from-white via-slate-50/80 to-white py-12 md:py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} custom={0} className="flex justify-center mb-6">
              <span className="section-label">How It Works</span>
            </motion.div>
            <motion.div variants={fadeUp} custom={1} className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 flex-wrap">
              {[
                { label: 'Your Skills', icon: Code, color: 'from-violet-500 to-purple-600' },
                { label: 'AI Analysis', icon: Brain, color: 'from-blue-500 to-cyan-500' },
                { label: 'Startup Ideas', icon: Lightbulb, color: 'from-pink-500 to-rose-500' },
                { label: 'Launch Plan', icon: Rocket, color: 'from-amber-500 to-orange-500' },
              ].map((step, i) => (
                <motion.div
                  key={step.label}
                  variants={fadeUp}
                  custom={i + 2}
                  className="flex items-center gap-3 sm:gap-4"
                >
                  <motion.div
                    whileHover={reducedMotion ? {} : { scale: 1.1, rotate: 3 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${step.color} shadow-md`}
                  >
                    <step.icon className="h-5 w-5 text-white" />
                  </motion.div>
                  <span className="text-sm font-semibold text-ink">{step.label}</span>
                  {i < 3 && (
                    <motion.div
                      animate={reducedMotion ? {} : { x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut', delay: i * 0.3 }}
                    >
                      <ArrowRight className="h-4 w-4 text-primary/40 shrink-0 hidden sm:block" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PROBLEM
          ═══════════════════════════════════════════ */}
      <Section className="bg-bg">
        <SectionHeading
          badge="The Problem"
          title="Talented people, no clear path"
          highlight=""
          description="Skilled builders with no startup idea. Too many options, no way to validate. Even with an idea, no roadmap to go from concept to MVP."
        />

        <motion.div
          initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="mx-auto max-w-2xl"
        >
          {[
            { marker: '01', title: 'No clear direction', desc: 'Skills exist but no startup idea to apply them to.', color: 'from-violet-500 to-purple-600' },
            { marker: '02', title: 'Analysis paralysis', desc: 'Too many options, no way to validate which is the best one.', color: 'from-blue-500 to-cyan-500' },
            { marker: '03', title: 'Execution gap', desc: 'Even with an idea, no roadmap to go from concept to MVP.', color: 'from-pink-500 to-rose-500' },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeUp} custom={i} className="group relative overflow-hidden">
              {/* Left accent bar (4b) */}
              <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-gradient-to-b from-primary to-accent-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start gap-5 py-6 md:py-8 pl-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} shadow-lg shadow-slate-200/50 transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/20`}>
                  <span className="text-sm font-bold text-white">{item.marker}</span>
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <h3 className="mb-1.5 text-lg font-semibold text-ink transition-colors duration-200 group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="text-base leading-relaxed text-ink-muted">{item.desc}</p>
                </div>
              </div>
              {i < 2 && <div className="section-divider" />}
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════ */}
      <Section id="how-it-works" className="relative bg-white">
        <SectionHeading
          badge="How It Works"
          title="Four steps to your startup"
          description="From input to full execution plan in under a minute."
        />

        <motion.div
          initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="relative grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8"
        >
          {/* Connecting gradient line with travelling shimmer (5c) */}
          <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-7 hidden h-0.5 bg-gradient-to-r from-primary/20 via-accent-2/20 to-primary/20 md:block overflow-hidden">
            <motion.div
              className="h-full w-1/3 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
              animate={reducedMotion ? {} : { x: ['-100%', '400%'] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', repeatDelay: 1 }}
            />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              className="relative flex flex-col items-center gap-4 rounded-2xl border border-transparent bg-white p-4 transition-all duration-200 group hover:border-primary/15 hover:bg-gradient-to-b hover:from-white hover:to-primary/5 hover:shadow-[0_8px_24px_rgba(99,102,241,0.08)]"
            >
              {/* Step counter (5a) */}
              <span className="absolute top-3 right-3 text-[10px] font-bold text-ink-faint/40 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} shadow-lg transition-transform duration-200 group-hover:scale-110`}>
                <step.icon className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0 text-center">
                <h3 className="mb-1.5 text-sm font-semibold text-ink">{step.title}</h3>
                <p className="text-xs leading-relaxed text-ink-muted">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
          FEATURES
          ═══════════════════════════════════════════ */}
      <Section id="features" className="bg-bg">
        <SectionHeading
          badge="Features"
          title="Everything you need to launch"
          description="AI-powered tools that cover the entire startup journey."
        />

        <motion.div
          initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              className="group relative overflow-hidden flex h-full flex-col rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-250 hover:-translate-y-1 hover:border-primary/20 hover:shadow-md"
            >
              {/* Top gradient strip on hover (6a) */}
              <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-primary via-accent-2 to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className={`mb-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} shadow-lg transition-transform duration-200 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-${f.color.includes('violet') ? 'violet' : f.color.includes('blue') ? 'blue' : f.color.includes('pink') ? 'pink' : f.color.includes('amber') ? 'amber' : f.color.includes('emerald') ? 'emerald' : 'indigo'}-500/20`}>
                <f.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-ink transition-colors duration-200 group-hover:text-primary">
                {f.title}
              </h3>
              <p className="flex-1 text-sm leading-relaxed text-ink-muted">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-16 md:py-20 lg:py-24">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent-2/5 to-accent/5" />
        <div className="orb w-[400px] h-[400px] bg-primary/10 top-[-100px] left-[20%]" />
        <div className="orb w-[300px] h-[300px] bg-accent/10 bottom-[-50px] right-[15%]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Decorative card behind CTA (8a) */}
          <div className="relative mx-auto max-w-3xl rounded-3xl border border-primary/10 bg-white/60 backdrop-blur-sm p-10 md:p-16 shadow-xl shadow-primary/5">
            {/* Top gradient stripe */}
            <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-3xl bg-gradient-to-r from-primary via-accent-2 to-accent" />

            <motion.div
              initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="text-center"
            >
              <motion.div variants={fadeUp} custom={0} className="section-label mb-4">Get Started</motion.div>
              <motion.h2 variants={fadeUp} custom={1} className="mb-4 text-2xl font-bold tracking-tight leading-tight text-ink sm:text-3xl md:text-4xl">
                Ready to find your startup?
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
                Enter your skills and let AI generate personalized startup opportunities with full execution plans.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <motion.button
                  whileHover={reducedMotion ? {} : { scale: 1.02, y: -1 }}
                  whileTap={reducedMotion ? {} : { scale: 0.97 }}
                  className="relative overflow-hidden group inline-flex h-14 min-w-[200px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent-2 px-10 text-base font-semibold text-white shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 animate-pulse-glow btn-press"
                >
                  <span className="pointer-events-none absolute inset-0 rounded-xl overflow-hidden">
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer-btn_0.8s_ease-in-out]" />
                  </span>
                  Start Free
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
                <Link
                  to="/signin"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-border bg-white px-10 text-base font-semibold text-ink shadow-sm transition-all duration-200 hover:border-primary/30 hover:bg-primary/5"
                >
                  Sign In
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════ */}
      <footer className="border-t border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            {/* Logo (9a) */}
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent-2 shadow-md shadow-primary/20">
                <Rocket className="h-4 w-4 text-white hover:rotate-12 transition-transform duration-300" />
              </div>
              <span className="text-base font-bold text-ink">Skill2Startup</span>
            </Link>

            {/* Nav (9b) */}
            <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <a href="#features" className="relative text-sm font-medium text-ink-faint transition-colors hover:text-primary after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full">Features</a>
              <a href="#how-it-works" className="relative text-sm font-medium text-ink-faint transition-colors hover:text-primary after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full">How It Works</a>
              <Link to="/dashboard" className="relative text-sm font-medium text-ink-faint transition-colors hover:text-primary after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full">Dashboard</Link>
              <Link to="/signin" className="relative text-sm font-medium text-ink-faint transition-colors hover:text-primary after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full">Sign In</Link>
            </nav>

            {/* Copyright */}
            <p className="text-sm text-ink-faint">© 2026 Skill2Startup</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
