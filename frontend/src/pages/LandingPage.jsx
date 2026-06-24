import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Code, Lightbulb, Play, Rocket, Search, ShieldCheck, Sparkles, Target, TrendingUp } from 'lucide-react';
import { AppNav, BrandLink } from '../components/PageShell.jsx';

const steps = [
  { title: 'Enter Your Skills', desc: 'List what you know, what you like, and how much time you can spend.' },
  { title: 'AI Reads Fit', desc: 'Gemini analyzes founder fit, categories, constraints, and market angles.' },
  { title: 'Review Ideas', desc: 'Compare startup opportunities with feasibility and demand scores.' },
  { title: 'Launch Plan', desc: 'Generate an MVP scope, competitors, roadmap, revenue model, and pitches.' },
];

const features = [
  { title: 'Founder Analysis', desc: 'Understand your strengths, gaps, and best startup categories.', icon: Brain },
  { title: 'Startup Ideas', desc: 'Generate structured ideas scored against opportunity and founder fit.', icon: Lightbulb },
  { title: 'Competitor Mapping', desc: 'See competitors, limitations, advantages, and market gaps.', icon: Search },
  { title: 'MVP Scope', desc: 'Turn an idea into buildable v1 features and later v2 expansion.', icon: Target },
  { title: 'Revenue Models', desc: 'Get pricing, monetization methods, and first-customer strategy.', icon: TrendingUp },
  { title: 'Pitch Content', desc: 'Create hackathon and thirty-second pitches for fast validation.', icon: Sparkles },
];

function Section({ id, className = '', children }) {
  return (
    <section id={id} className={`py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">{children}</div>
    </section>
  );
}

function SectionHeading({ badge, title, description }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-12">
      <span className="section-label mb-4">{badge}</span>
      <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[-0.02em] leading-none text-[#0A0A0A] mb-4">
        {title}
      </h2>
      <p className="text-sm md:text-base text-[#6A6A6A] font-medium leading-relaxed">{description}</p>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [displayed, setDisplayed] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const preview = 'SKILLPATH AI';

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed(preview.slice(0, i + 1));
      i = i + 1;
      if (i >= preview.length) clearInterval(timer);
    }, 90);
    return () => clearInterval(timer);
  }, []);

  function handleGenerateClick() {
    setIsLoading(true);
    setTimeout(() => navigate('/input'), 250);
  }

  return (
    <main className="min-h-screen bg-[#F5F3EE] text-[#0A0A0A]">
      <AppNav />

      <section className="relative pt-36 pb-20 bg-[#F5F3EE] border-b-2 border-[#0A0A0A]">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(#0A0A0A 1px, transparent 1px), linear-gradient(90deg, #0A0A0A 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 border-2 border-[#0A0A0A] px-3 py-1 mb-8 bg-white">
                <div className="h-2 w-2 bg-[#0A0A0A]" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#0A0A0A]">AI-Powered Startup Incubator</span>
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-[-0.03em] leading-[0.95] mb-8 text-[#0A0A0A] uppercase">
                Turn Your<br />
                Skills Into<br />
                <span className="relative inline-block">
                  A Startup.
                  <span className="absolute bottom-1 left-0 right-0 h-[5px] bg-[#0A0A0A]" />
                </span>
              </h1>
              <p className="text-base text-[#3A3A3A] mb-10 max-w-md leading-relaxed font-medium border-l-4 border-[#0A0A0A] pl-4">
                Describe your skills, interests, and goals. Our AI generates personalized startup ideas,
                full MVP plans, competitor analysis, and pitch content in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGenerateClick}
                  disabled={isLoading}
                  className="h-14 px-10 bg-[#0A0A0A] text-[#F5F3EE] text-sm font-black uppercase tracking-widest border-2 border-[#0A0A0A] flex items-center justify-center gap-3 hover:bg-[#F5F3EE] hover:text-[#0A0A0A] transition-colors duration-150 disabled:opacity-50"
                >
                  {isLoading ? 'Generating...' : <>Generate My Startup <ArrowRight className="h-4 w-4" /></>}
                </button>
                <a href="#how-it-works" className="h-14 px-10 bg-transparent text-[#0A0A0A] text-sm font-black uppercase tracking-widest border-2 border-[#0A0A0A] flex items-center justify-center gap-3 hover:bg-[#0A0A0A] hover:text-[#F5F3EE] transition-colors duration-150">
                  <Play className="h-4 w-4" /> See How It Works
                </a>
              </div>
              <div className="mt-10 flex items-center gap-6">
                <div className="flex -space-x-px">
                  {['SC', 'MJ', 'PP', 'AK'].map((initials) => (
                    <div key={initials} className="h-9 w-9 border-2 border-[#0A0A0A] bg-white flex items-center justify-center">
                      <span className="text-[9px] font-black text-[#0A0A0A]">{initials}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-black text-[#0A0A0A]">4.9 / 5</p>
                  <p className="text-xs text-[#6A6A6A] font-medium">from 2,000+ builders</p>
                </div>
              </div>
            </div>
            <div className="hidden lg:block lg:col-span-5">
              <div className="border-2 border-[#0A0A0A] bg-white p-6">
                <div className="border-b-2 border-[#0A0A0A] pb-4 mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#6A6A6A]">AI Output Preview</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-2 w-2 bg-[#0A0A0A]" />
                      <span className="text-xs font-bold text-[#0A0A0A]">Generating</span>
                    </div>
                  </div>
                  <div className="bg-[#0A0A0A] px-2 py-1">
                    <span className="text-xs font-black text-[#F5F3EE]">8.7 / 10</span>
                  </div>
                </div>
                <p className="text-lg font-black text-[#0A0A0A] mb-1 uppercase tracking-tight">
                  {displayed}<span>_</span>
                </p>
                <p className="text-xs text-[#6A6A6A] leading-relaxed mb-4 border-l-2 border-[#0A0A0A] pl-3">
                  An AI mentor that turns student skills into personalized career and startup roadmaps.
                </p>
                <div className="h-2 w-full bg-[#F5F3EE] border border-[#0A0A0A] overflow-hidden mb-4">
                  <motion.div className="h-full bg-[#0A0A0A]" initial={{ width: 0 }} animate={{ width: '87%' }} transition={{ delay: 0.8, duration: 1.2, ease: 'easeOut' }} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['MVP Plan', 'Competitors', 'Roadmap'].map((tag) => (
                    <div key={tag} className="border-2 border-[#0A0A0A] bg-[#F5F3EE] p-2 text-center hover:bg-[#0A0A0A] hover:text-[#F5F3EE] transition-colors cursor-default">
                      <span className="text-[10px] font-black uppercase tracking-wide">{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0A0A0A] py-10 border-b-2 border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 text-center mb-6">How It Works</p>
          <div className="flex items-center justify-center gap-0 flex-wrap">
            {[
              { label: 'Your Skills', icon: Code },
              { label: 'AI Analysis', icon: Brain },
              { label: 'Startup Ideas', icon: Lightbulb },
              { label: 'Launch Plan', icon: Rocket },
            ].map((step, i) => (
              <div key={step.label} className="flex items-center">
                <div className="flex items-center gap-3 px-6 py-4 border-r border-white/10">
                  <step.icon className="h-4 w-4 text-white" />
                  <span className="text-xs font-black uppercase tracking-widest text-white">{step.label}</span>
                </div>
                {i < 3 && <ArrowRight className="h-4 w-4 text-white/30 mx-2" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section className="bg-[#F5F3EE]">
        <SectionHeading badge="The Problem" title="Talented people, no clear path" description="Skilled builders with no startup idea. Too many options, no way to validate. Even with an idea, no roadmap to go from concept to MVP." />
        <div className="max-w-2xl mx-auto">
          {[
            { marker: '01', title: 'No clear direction', desc: 'Skills exist but no startup idea to apply them to.' },
            { marker: '02', title: 'Analysis paralysis', desc: 'Too many options, no way to validate which is the best one.' },
            { marker: '03', title: 'Execution gap', desc: 'Even with an idea, no roadmap to go from concept to MVP.' },
          ].map((item) => (
            <div key={item.marker} className="group border-2 border-[#0A0A0A] p-6 mb-[-2px] hover:bg-[#0A0A0A] hover:text-[#F5F3EE] transition-colors duration-150 cursor-default">
              <div className="flex items-start gap-6">
                <span className="text-4xl font-black text-[#0A0A0A] group-hover:text-[#F5F3EE] leading-none">{item.marker}</span>
                <div>
                  <h3 className="text-lg font-black text-[#0A0A0A] group-hover:text-[#F5F3EE] uppercase tracking-tight mb-1">{item.title}</h3>
                  <p className="text-sm text-[#3A3A3A] group-hover:text-[#F5F3EE]/70 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="how-it-works" className="bg-white border-y-2 border-[#0A0A0A]">
        <SectionHeading badge="How It Works" title="Four steps to your startup" description="From input to full execution plan in under a minute." />
        <div className="grid grid-cols-2 md:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.title} className={`p-6 border-2 border-[#0A0A0A] ${i > 0 ? 'md:border-l-0' : ''} ${i > 1 ? 'border-t-0 md:border-t-2' : ''}`}>
              <div className="text-5xl font-black text-[#E8E6E0] mb-4 leading-none">{String(i + 1).padStart(2, '0')}</div>
              <h3 className="text-sm font-black uppercase tracking-tight text-[#0A0A0A] mb-2">{step.title}</h3>
              <p className="text-xs text-[#6A6A6A] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="features" className="bg-[#F5F3EE]">
        <SectionHeading badge="Features" title="Everything you need to launch" description="AI-powered tools that cover the entire startup journey." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div key={f.title} className={`group p-6 border-2 border-[#0A0A0A] hover:bg-[#0A0A0A] transition-colors duration-150 ${i % 3 !== 0 ? 'lg:border-l-0' : ''} ${i % 2 !== 0 ? 'sm:border-l-0 lg:border-l-2' : ''} ${i >= 2 ? 'sm:border-t-0 lg:border-t-2' : ''} ${i >= 3 ? 'lg:border-t-0' : ''}`}>
              <f.icon className="h-5 w-5 text-[#0A0A0A] group-hover:text-[#F5F3EE] mb-4" />
              <h3 className="text-sm font-black uppercase tracking-tight text-[#0A0A0A] group-hover:text-[#F5F3EE] mb-2">{f.title}</h3>
              <p className="text-xs text-[#6A6A6A] group-hover:text-[#F5F3EE]/60 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className="bg-[#0A0A0A] py-20 border-y-2 border-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">Get Started</p>
          <h2 className="text-4xl md:text-6xl font-black uppercase text-white mb-4 tracking-tight leading-none">Ready to find<br />your startup?</h2>
          <p className="text-sm text-white/50 max-w-md mx-auto mb-10 leading-relaxed">Enter your skills and let AI generate personalized startup opportunities with full execution plans.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/input" className="h-14 px-12 bg-white text-[#0A0A0A] text-sm font-black uppercase tracking-widest border-2 border-white flex items-center gap-3 hover:bg-transparent hover:text-white transition-colors duration-150">
              Start Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/signin" className="h-14 px-12 text-white text-sm font-black uppercase tracking-widest border-2 border-white/30 flex items-center gap-3 hover:border-white transition-colors duration-150">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#F5F3EE] border-t-2 border-[#0A0A0A] py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <BrandLink />
          <nav className="flex items-center gap-8">
            {['Features', 'How It Works', 'Dashboard', 'Sign In'].map((label) => (
              <Link key={label} to={label === 'Dashboard' ? '/dashboard' : label === 'Sign In' ? '/signin' : `/#${label.toLowerCase().replaceAll(' ', '-')}`} className="text-[10px] font-black uppercase tracking-widest text-[#6A6A6A] hover:text-[#0A0A0A] transition-colors">
                {label}
              </Link>
            ))}
          </nav>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#6A6A6A]">(c) 2026 Skill2Startup</p>
        </div>
      </footer>
    </main>
  );
}
