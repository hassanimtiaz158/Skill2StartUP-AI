import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion, useInView, useMotionValue, useSpring } from 'framer-motion';
import {
  Lightbulb, Target, Rocket, BarChart3, Users, Zap,
  ArrowRight, Sparkles, Loader2, Quote, Star, Brain,
  Code, TrendingUp, Shield, Play, Check,
} from 'lucide-react';
import { fadeUp, stagger } from '@/config/animations';

/* ── Animated Counter ── */
function AnimatedCounter({ value, suffix = '', prefix = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const count = useMotionValue(0);
  const rounded = useSpring(count, { stiffness: 40, damping: 20 });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!isInView) return;
    const num = parseInt(value.replace(/\D/g, ''), 10) || 0;
    count.set(num);
    const unsub = rounded.on('change', (v) => {
      setDisplay(`${prefix}${Math.round(v).toLocaleString()}${suffix}`);
    });
    return unsub;
  }, [isInView, value, prefix, suffix, count, rounded]);

  return <span ref={ref}>{display}</span>;
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
  { marker: '01', title: 'Enter your skills', desc: 'What you know, what you love, what you want to build.', icon: Sparkles, color: 'from-violet-500 to-purple-600' },
  { marker: '02', title: 'AI generates opportunities', desc: 'Your founder profile, startup ideas, and opportunity scores.', icon: Zap, color: 'from-blue-500 to-cyan-500' },
  { marker: '03', title: 'Pick your best idea', desc: 'Competitor analysis, market gaps, scored side by side.', icon: Target, color: 'from-pink-500 to-rose-500' },
  { marker: '04', title: 'Launch with a full plan', desc: 'MVP roadmap, revenue model, SWOT, pitch — ready to build.', icon: Rocket, color: 'from-amber-500 to-orange-500' },
];

/* ── Testimonials ── */
const testimonials = [
  { name: 'Sarah Chen', role: 'Hackathon Winner', text: 'Skill2Startup helped me find a unique idea that won first place at HackMIT. The roadmap was a game-changer.', avatar: 'SC', color: 'from-violet-400 to-purple-500' },
  { name: 'Marcus Johnson', role: 'Solo Founder', text: 'I had skills but no direction. Within 10 minutes I had 3 validated startup ideas with full execution plans.', avatar: 'MJ', color: 'from-blue-400 to-cyan-500' },
  { name: 'Priya Patel', role: 'CS Student', text: 'The competitor analysis feature is incredible. It showed me exactly where the market gaps were.', avatar: 'PP', color: 'from-pink-400 to-rose-500' },
];

/* ── Stats data ── */
const stats = [
  { value: '10000', suffix: '+', label: 'Ideas Generated', icon: Brain },
  { value: '500', suffix: '+', label: 'Hackathon Pitches', icon: Code },
  { value: '95', suffix: '%', label: 'User Satisfaction', icon: TrendingUp },
  { value: '50', suffix: '+', label: 'Tech Stacks', icon: Shield },
];

/* ── Main page ── */
export default function LandingPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -30]);

  const handleGenerateClick = (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    navigate('/input');
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* ═══ HERO ═══ */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-white to-pink-50/60" />

        {/* Gradient orbs */}
        <div className="orb w-[500px] h-[500px] bg-primary/20 top-[-100px] left-[-100px]" />
        <div className="orb w-[400px] h-[400px] bg-accent/15 bottom-[-50px] right-[-50px]" />
        <div className="orb w-[300px] h-[300px] bg-cyan/10 top-[30%] right-[20%]" />

        <div className="container relative">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Copy */}
            <motion.div style={{ opacity: heroOpacity, y: heroY }} className="lg:col-span-7">
              <motion.div initial="hidden" animate="visible" variants={stagger}>
                <motion.div variants={fadeUp} custom={0} className="mb-6">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/15 px-4 py-2 text-xs font-semibold text-primary">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                    </span>
                    AI-Powered Startup Incubator
                  </span>
                </motion.div>

                <motion.h1
                  variants={fadeUp}
                  custom={1}
                  className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-ink"
                >
                  Turn Your Skills{' '}
                  <span className="gradient-text">Into a Startup</span>
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  custom={2}
                  className="text-lg text-ink-muted mb-8 max-w-lg leading-relaxed"
                >
                  Describe your skills, interests, and goals. Our AI generates personalized startup ideas,
                  full MVP plans, competitor analysis, and pitch content — in seconds.
                </motion.p>

                <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleGenerateClick}
                    disabled={isLoading}
                    className="h-14 px-8 bg-gradient-to-r from-primary to-accent-2 text-white text-base font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-primary/25 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed animate-pulse-glow btn-press"
                  >
                    {isLoading ? (
                      <><Loader2 className="h-5 w-5 animate-spin" /> Loading…</>
                    ) : (
                      <>Generate My Startup <ArrowRight className="h-5 w-5" /></>
                    )}
                  </button>
                  <a href="#how-it-works" className="h-14 px-8 bg-white border border-border text-ink text-base font-semibold rounded-xl flex items-center justify-center gap-2 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 shadow-sm">
                    <Play className="h-4 w-4 text-primary" />
                    See How It Works
                  </a>
                </motion.div>

                {/* Trust badges */}
                <motion.div variants={fadeUp} custom={4} className="flex items-center gap-4 mt-8">
                  <div className="flex -space-x-2">
                    {['SC', 'MJ', 'PP', 'AK'].map((i) => (
                      <div key={i} className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-accent-2/20 border-2 border-white flex items-center justify-center shadow-sm">
                        <span className="text-[9px] font-bold text-primary">{i}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className="h-3.5 w-3.5 fill-warning text-warning" />
                      ))}
                      <span className="text-sm font-medium text-ink-muted ml-1">4.9/5</span>
                    </div>
                    <p className="text-xs text-ink-faint">from 2,000+ builders</p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Preview card — desktop only */}
            <div className="hidden lg:block lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="rounded-2xl border border-border bg-white p-6 shadow-xl shadow-slate-200/50">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent-2 flex items-center justify-center shadow-md shadow-primary/20">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-ink-faint uppercase tracking-wider">AI Output Preview</span>
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/40" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                        </span>
                        <p className="text-xs text-ink-faint">Live generation</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-xl border border-border bg-slate-50 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-sm text-ink">SkillPath AI</p>
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1, type: 'spring', stiffness: 300 }}
                          className="inline-flex items-center gap-1 rounded-full bg-success/10 border border-success/20 px-2.5 py-0.5 text-xs font-semibold text-success"
                        >
                          8.7 / 10
                        </motion.span>
                      </div>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-sm text-ink-muted leading-relaxed mb-3"
                      >
                        An AI mentor that turns student skills into personalized career and startup roadmaps.
                      </motion.p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-accent-2"
                            initial={{ width: 0 }}
                            animate={{ width: '87%' }}
                            transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
                          />
                        </div>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.2 }}
                          className="font-mono text-xs font-bold text-primary"
                        >
                          8.7
                        </motion.span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {['MVP Plan', 'Competitors', 'Roadmap'].map((tag, i) => (
                        <motion.div
                          key={tag}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.4 + i * 0.1 }}
                          className="rounded-lg border border-border bg-slate-50 p-2.5 text-center hover:border-primary/20 hover:bg-primary/5 transition-colors duration-200"
                        >
                          <span className="text-[11px] font-medium text-ink-faint">{tag}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      {['Students', 'Freelancers', 'Hackathon'].map((tag, i) => (
                        <motion.span
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.8 + i * 0.08 }}
                          className="inline-flex items-center rounded-full bg-slate-100 border border-border px-3 py-1 text-[11px] font-medium text-ink-muted"
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Decorative layers */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="absolute -z-10 top-3 left-3 right-3 bottom-3 rounded-2xl border border-primary/10 bg-primary/5"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute -z-20 top-6 left-6 right-6 bottom-6 rounded-2xl border border-accent-2/10 bg-accent-2/5"
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg to-transparent" />
      </section>

      {/* ═══ STATS ═══ */}
      <section className="py-16 md:py-20 border-b border-border bg-white">
        <div className="container">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/10 to-accent-2/10 border border-primary/10 mb-4">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-3xl sm:text-4xl font-extrabold text-ink mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-ink-faint font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ PROBLEM ═══ */}
      <section className="section bg-bg">
        <div className="container">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="text-center mb-12 md:mb-16"
          >
            <motion.div variants={fadeUp} custom={0} className="section-label mb-4">The Problem</motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink mb-4">
              Talented people, <span className="text-ink-faint">no clear path</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-ink-muted max-w-lg mx-auto">
              Skilled builders with no startup idea. Too many options, no way to validate.
              Even with an idea, no roadmap to go from concept to MVP.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="max-w-2xl mx-auto"
          >
            {[
              { marker: '01', title: 'No clear direction', desc: 'Skills exist but no startup idea to apply them to.', color: 'from-violet-500 to-purple-600' },
              { marker: '02', title: 'Analysis paralysis', desc: 'Too many options, no way to validate which is the best one.', color: 'from-blue-500 to-cyan-500' },
              { marker: '03', title: 'Execution gap', desc: 'Even with an idea, no roadmap to go from concept to MVP.', color: 'from-pink-500 to-rose-500' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="group">
                <div className="flex items-start gap-5 py-6">
                  <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0 shadow-lg shadow-slate-200/50 group-hover:scale-105 transition-transform duration-200`}>
                    <span className="text-sm font-bold text-white">{item.marker}</span>
                  </div>
                  <div className="min-w-0 pt-1">
                    <h3 className="text-lg font-bold text-ink mb-1 group-hover:text-primary transition-colors duration-200">
                      {item.title}
                    </h3>
                    <p className="text-base text-ink-muted leading-relaxed">{item.desc}</p>
                  </div>
                </div>
                {i < 2 && <div className="section-divider" />}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="section bg-white relative">
        <div className="container relative">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="text-center mb-12 md:mb-16"
          >
            <motion.div variants={fadeUp} custom={0} className="section-label mb-4">How It Works</motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink mb-4">
              Four steps from skills to startup
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-ink-muted max-w-md mx-auto">
              From input to full execution plan in under a minute.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 relative"
          >
            {/* Connecting line — desktop only */}
            <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary/20 via-accent-2/20 to-primary/20" />

            {steps.map((step, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="relative flex flex-col items-center gap-4 p-3 group">
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shrink-0 z-10 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                  <step.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-center min-w-0">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">{step.marker}</span>
                  <h3 className="text-sm font-bold text-ink mb-1">{step.title}</h3>
                  <p className="text-xs text-ink-muted leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="section bg-bg">
        <div className="container">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="text-center mb-12 md:mb-16"
          >
            <motion.div variants={fadeUp} custom={0} className="section-label mb-4">Features</motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink mb-4">
              Everything you need to launch
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-ink-muted max-w-md mx-auto">
              AI-powered tools that cover the entire startup journey.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className="group rounded-2xl border border-border bg-white p-6 card-hover"
              >
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                  <f.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-2 group-hover:text-primary transition-colors duration-200">
                  {f.title}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="section bg-white">
        <div className="container">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="text-center mb-12 md:mb-16"
          >
            <motion.div variants={fadeUp} custom={0} className="section-label mb-4">What Builders Say</motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink mb-4">
              Loved by founders
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className="rounded-2xl border border-border bg-white p-6 card-hover"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <Quote className="h-6 w-6 text-primary/20 mb-3" />
                <p className="text-sm text-ink-muted leading-relaxed mb-5">{t.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center shrink-0 shadow-md`}>
                    <span className="text-xs font-bold text-white">{t.avatar}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{t.name}</p>
                    <p className="text-xs text-ink-faint truncate">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="section bg-gradient-to-br from-primary/5 via-accent-2/5 to-accent/5 relative overflow-hidden">
        <div className="orb w-[400px] h-[400px] bg-primary/10 top-[-100px] left-[20%]" />
        <div className="orb w-[300px] h-[300px] bg-accent/10 bottom-[-50px] right-[15%]" />
        <div className="container relative">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="text-center"
          >
            <motion.div variants={fadeUp} custom={0} className="section-label mb-4">Get Started</motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink mb-4">
              Ready to find your startup?
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-ink-muted mb-10 max-w-md mx-auto">
              Enter your skills and let AI generate personalized startup opportunities with full execution plans.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/input" className="h-14 px-10 bg-gradient-to-r from-primary to-accent-2 text-white text-base font-semibold inline-flex items-center gap-2 rounded-xl hover:shadow-xl hover:shadow-primary/25 transition-all duration-200 animate-pulse-glow btn-press">
                Start Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/signin" className="h-14 px-10 bg-white border border-border text-ink text-base font-semibold inline-flex items-center gap-2 rounded-xl hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 shadow-sm">
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-border py-10 bg-white">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-accent-2 flex items-center justify-center shadow-md shadow-primary/20">
                <Rocket className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-bold text-ink">Skill2Startup</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-sm text-ink-faint hover:text-primary transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="text-sm text-ink-faint hover:text-primary transition-colors font-medium">How It Works</a>
              <Link to="/dashboard" className="text-sm text-ink-faint hover:text-primary transition-colors font-medium">Dashboard</Link>
              <Link to="/signin" className="text-sm text-ink-faint hover:text-primary transition-colors font-medium">Sign In</Link>
            </div>
            <p className="text-sm text-ink-faint">© 2026 Skill2Startup</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
