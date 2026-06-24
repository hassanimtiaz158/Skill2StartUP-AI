import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, DollarSign, Factory, X, Sparkles } from 'lucide-react';
import Input from '../components/Input.jsx';
import { AppNav } from '../components/PageShell.jsx';
import { analyzeProfile, generateIdeas } from '../services/api.js';
import { clearGeneratedState, saveValue } from '../services/storage.js';

const steps = [
  { id: 1, title: 'Skills' },
  { id: 2, title: 'Context' },
  { id: 3, title: 'Goal' },
];

const skillSuggestions = [
  'Python', 'JavaScript', 'React', 'Node.js', 'FastAPI', 'Django', 'Flask', 'AI/ML',
  'Data Analysis', 'SQL', 'MongoDB', 'UI/UX Design', 'Product Design', 'No-Code',
  'Marketing', 'SEO', 'Content Writing', 'Copywriting', 'Sales', 'Customer Support',
  'Finance', 'Operations', 'Project Management', 'Video Editing', 'Graphic Design',
  'Cybersecurity', 'Cloud', 'Automation', 'Prompt Engineering', 'Research',
];
const interestSuggestions = [
  'Education', 'SaaS', 'Productivity', 'FinTech', 'Health', 'Creator Tools',
  'Ecommerce', 'Climate', 'Gaming', 'Travel', 'Food', 'Fitness', 'Real Estate',
  'LegalTech', 'HRTech', 'EdTech', 'AI Tools', 'Developer Tools', 'Marketplaces',
  'Local Services', 'Remote Work', 'Mental Health', 'Personal Finance',
  'Logistics', 'Agriculture', 'Fashion', 'Music', 'Sports', 'Nonprofits', 'B2B',
];
const experienceOptions = [
  { value: 'Beginner', label: 'Beginner', desc: 'Learning the basics and building first projects.' },
  { value: 'Intermediate', label: 'Intermediate', desc: 'Can ship useful work with guidance.' },
  { value: 'Advanced', label: 'Advanced', desc: 'Comfortable building and leading execution.' },
  { value: 'Expert', label: 'Expert', desc: 'Deep domain skill and strong delivery history.' },
];
const goalOptions = [
  { value: 'Hackathon MVP', label: 'Hackathon MVP', desc: 'Fast concept, demo, and pitch.' },
  { value: 'Side project', label: 'Side Project', desc: 'Practical launch with low budget.' },
  { value: 'Startup validation', label: 'Startup Validation', desc: 'Test demand before building big.' },
  { value: 'Revenue-first business', label: 'Revenue First', desc: 'Prioritize paying customers early.' },
];

const starterProfiles = [
  {
    label: 'Student Builder',
    skills: ['Python', 'React', 'AI/ML'],
    interests: ['Education', 'Productivity', 'AI Tools'],
    preferred_industry: 'EdTech',
    goal: 'Hackathon MVP',
  },
  {
    label: 'Solo Service Pro',
    skills: ['Marketing', 'Sales', 'Automation'],
    interests: ['Local Services', 'B2B', 'Creator Tools'],
    preferred_industry: 'B2B',
    goal: 'Revenue-first business',
  },
  {
    label: 'Design Founder',
    skills: ['UI/UX Design', 'Product Design', 'No-Code'],
    interests: ['SaaS', 'Marketplaces', 'Remote Work'],
    preferred_industry: 'SaaS',
    goal: 'Startup validation',
  },
];

function ChipInput({ label, chips, setChips, suggestions, error }) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  function add(nextValue) {
    const clean = nextValue.trim();
    if (!clean || chips.some((chip) => chip.toLowerCase() === clean.toLowerCase())) return;
    setChips([...chips, clean]);
    setValue('');
  }

  function remove(index) {
    setChips(chips.filter((_, i) => i !== index));
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      add(value);
    }
    if (event.key === 'Backspace' && !value && chips.length) {
      remove(chips.length - 1);
    }
  }

  return (
    <div>
      <label className="text-[9px] font-black uppercase tracking-[0.15em] text-[#6A6A6A] mb-2 block">{label}</label>
      <div className={`border-2 bg-white p-4 transition-colors duration-150 ${error ? 'border-[#0A0A0A]' : focused ? 'border-[#0A0A0A] bg-[#FAFAF8]' : 'border-[#0A0A0A]'}`}>
        <div className="flex flex-wrap gap-2 mb-3">
          {chips.map((chip, index) => (
            <span key={`${chip}-${index}`} className="inline-flex items-center gap-2 border-2 border-[#0A0A0A] px-2 py-1 text-xs font-black uppercase text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#F5F3EE] transition-colors duration-150 group">
              {chip}
              <button type="button" onClick={() => remove(index)} className="text-[#6A6A6A] group-hover:text-[#F5F3EE]" aria-label={`Remove ${chip}`}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            setFocused(false);
            add(value);
          }}
          onFocus={() => setFocused(true)}
          placeholder="Type and press Enter"
          className="w-full bg-transparent text-sm font-medium text-[#0A0A0A] placeholder:text-[#C0BDB6] focus:outline-none"
        />
      </div>
      {error && <p className="text-[10px] font-black uppercase tracking-wide text-[#0A0A0A] border-l-2 border-[#0A0A0A] pl-2 mt-2">{error}</p>}
      <div className="flex flex-wrap gap-2 mt-3">
        {suggestions.filter((item) => !chips.includes(item)).slice(0, 18).map((suggestion) => (
          <button key={suggestion} type="button" onClick={() => add(suggestion)} className="border border-[#0A0A0A] px-3 py-1 text-[10px] font-black uppercase tracking-wide text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-[#F5F3EE] transition-colors duration-150">
            + {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function InputPage() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState({
    skills: [],
    interests: [],
    experience_level: 'Intermediate',
    budget: '100',
    time_per_week: '10',
    preferred_industry: '',
    goal: '',
  });

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: '' }));
  }

  function applyStarter(profile) {
    setForm((current) => ({
      ...current,
      skills: profile.skills,
      interests: profile.interests,
      preferred_industry: profile.preferred_industry,
      goal: profile.goal,
    }));
    setFieldErrors({});
  }

  function validate(targetStep = step) {
    const nextErrors = {};
    if (targetStep === 1) {
      if (!form.skills.length) nextErrors.skills = 'Add at least one skill.';
      if (!form.interests.length) nextErrors.interests = 'Add at least one interest.';
    }
    if (targetStep === 3 && !form.goal) nextErrors.goal = 'Choose one goal.';
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function next() {
    if (!validate(step)) return;
    setDir(1);
    setStep((current) => Math.min(3, current + 1));
  }

  function prev() {
    setDir(-1);
    setStep((current) => Math.max(1, current - 1));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (step < 3) {
      next();
      return;
    }
    if (!validate(3)) return;
    setLoading(true);
    clearGeneratedState();
    try {
      const [analysis, ideas] = await Promise.all([analyzeProfile(form), generateIdeas(form)]);
      saveValue('profile', form);
      saveValue('analysis', analysis);
      saveValue('ideas', ideas);
      navigate('/results');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  const motionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, x: dir * 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: dir * -24 },
        transition: { duration: 0.2 },
      };

  return (
    <main className="min-h-screen bg-[#F5F3EE] text-[#0A0A0A]">
      <AppNav />
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 border-2 border-[#0A0A0A] px-3 py-1 mb-6 bg-white">
            <span className="text-[9px] font-black uppercase tracking-[0.15em]">Step {step} of 3</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-[#0A0A0A] leading-none mb-3">Build Your<br />Startup Brief.</h1>
          <p className="text-sm text-[#6A6A6A] border-l-2 border-[#0A0A0A] pl-3 mb-10 max-w-xl">This form sends your profile to the FastAPI backend and returns AI-generated startup ideas.</p>

          <div className="grid md:grid-cols-3 mb-10">
            {starterProfiles.map((profile, index) => (
              <button
                key={profile.label}
                type="button"
                onClick={() => applyStarter(profile)}
                className={`border-2 border-[#0A0A0A] bg-white p-4 text-left hover:bg-[#0A0A0A] hover:text-[#F5F3EE] transition-colors ${index > 0 ? 'md:border-l-0' : ''}`}
              >
                <p className="text-[10px] font-black uppercase tracking-widest mb-2">{profile.label}</p>
                <p className="text-xs leading-relaxed opacity-70">{profile.skills.join(' / ')}</p>
              </button>
            ))}
          </div>

          <div className="flex mb-10 border-2 border-[#0A0A0A] overflow-x-auto">
            {steps.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id < step) {
                    setDir(-1);
                    setStep(item.id);
                  }
                }}
                className={`flex-1 min-w-[120px] py-3 px-4 text-[10px] font-black uppercase tracking-widest border-r-2 border-[#0A0A0A] last:border-r-0 transition-colors duration-150 ${step === item.id ? 'bg-[#0A0A0A] text-[#F5F3EE]' : step > item.id ? 'bg-[#E8E6E0] text-[#0A0A0A]' : 'bg-white text-[#C0BDB6]'}`}
                aria-label={`Step ${item.id}`}
              >
                {String(item.id).padStart(2, '0')} - {item.title}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="border-2 border-[#0A0A0A] bg-white p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="skills" {...motionProps}>
                  <h2 className="text-xl font-black uppercase tracking-tight text-[#0A0A0A]">Skills and interests</h2>
                  <p className="text-sm text-[#6A6A6A] border-l-2 border-[#0A0A0A] pl-3 mt-1 mb-8">Add the skills you can use and markets you care about.</p>
                  <div className="space-y-8">
                    <ChipInput label="Skills" chips={form.skills} setChips={(value) => update('skills', value)} suggestions={skillSuggestions} error={fieldErrors.skills} />
                    <ChipInput label="Interests" chips={form.interests} setChips={(value) => update('interests', value)} suggestions={interestSuggestions} error={fieldErrors.interests} />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="context" {...motionProps}>
                  <h2 className="text-xl font-black uppercase tracking-tight text-[#0A0A0A]">Founder context</h2>
                  <p className="text-sm text-[#6A6A6A] border-l-2 border-[#0A0A0A] pl-3 mt-1 mb-8">Set constraints so the backend can generate realistic ideas.</p>
                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    {experienceOptions.map((opt) => (
                      <button key={opt.value} type="button" onClick={() => update('experience_level', opt.value)} className={`p-4 border-2 border-[#0A0A0A] text-left transition-colors duration-150 w-full ${form.experience_level === opt.value ? 'bg-[#0A0A0A] text-[#F5F3EE]' : 'bg-white hover:bg-[#F5F3EE]'}`}>
                        <span className={`text-sm font-black uppercase tracking-tight ${form.experience_level === opt.value ? 'text-[#F5F3EE]' : 'text-[#0A0A0A]'}`}>{opt.label}</span>
                        <span className={`block text-xs mt-1 ${form.experience_level === opt.value ? 'text-[#F5F3EE]/60' : 'text-[#6A6A6A]'}`}>{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                  <div className="grid sm:grid-cols-3 gap-0">
                    <Input label="Budget USD" icon={DollarSign} value={form.budget} onChange={(event) => update('budget', event.target.value)} placeholder="100" className="sm:mr-[-2px]" />
                    <Input label="Hours weekly" icon={Clock} value={form.time_per_week} onChange={(event) => update('time_per_week', event.target.value)} placeholder="10" className="sm:mr-[-2px]" />
                    <Input label="Industry" icon={Factory} value={form.preferred_industry} onChange={(event) => update('preferred_industry', event.target.value)} placeholder="EdTech" />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="goal" {...motionProps}>
                  <h2 className="text-xl font-black uppercase tracking-tight text-[#0A0A0A]">Execution goal</h2>
                  <p className="text-sm text-[#6A6A6A] border-l-2 border-[#0A0A0A] pl-3 mt-1 mb-8">Choose the output style you want from the AI pipeline.</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {goalOptions.map((opt) => (
                      <button key={opt.value} type="button" onClick={() => update('goal', opt.value)} className={`p-5 border-2 border-[#0A0A0A] text-left transition-colors duration-150 w-full ${form.goal === opt.value ? 'bg-[#0A0A0A]' : 'bg-white hover:bg-[#F5F3EE]'}`}>
                        <p className={`text-sm font-black uppercase tracking-tight ${form.goal === opt.value ? 'text-[#F5F3EE]' : 'text-[#0A0A0A]'}`}>{opt.label}</p>
                        {opt.desc && <p className={`text-xs mt-1 ${form.goal === opt.value ? 'text-[#F5F3EE]/60' : 'text-[#6A6A6A]'}`}>{opt.desc}</p>}
                      </button>
                    ))}
                  </div>
                  {fieldErrors.goal && <p className="text-[10px] font-black uppercase tracking-wide text-[#0A0A0A] border-l-2 border-[#0A0A0A] pl-2 mt-4">{fieldErrors.goal}</p>}
                </motion.div>
              )}
            </AnimatePresence>

            {error && <p className="mt-8 text-xs font-black uppercase tracking-wide text-[#0A0A0A] border-l-4 border-[#0A0A0A] pl-3">{error}</p>}

            {loading && (
              <div className="mt-8 border-2 border-[#0A0A0A] bg-[#F5F3EE] p-5">
                <p className="text-[10px] font-black uppercase tracking-widest mb-3">Generation Pipeline</p>
                <div className="grid sm:grid-cols-3 gap-2">
                  {['Analyzing founder fit', 'Scoring market angles', 'Drafting startup ideas'].map((item) => (
                    <div key={item} className="border-2 border-[#0A0A0A] bg-white p-3">
                      <div className="h-2 bg-[#0A0A0A] mb-3" />
                      <p className="text-[10px] font-black uppercase tracking-wide">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 pt-8 mt-8 border-t-2 border-[#0A0A0A]">
              {step > 1 && (
                <button type="button" onClick={prev} className="h-12 px-6 border-2 border-[#0A0A0A] text-xs font-black uppercase tracking-widest text-[#0A0A0A] flex items-center gap-2 hover:bg-[#0A0A0A] hover:text-[#F5F3EE] transition-colors duration-150">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              )}
              <button type="submit" disabled={loading} className="h-12 px-8 bg-[#0A0A0A] text-[#F5F3EE] text-xs font-black uppercase tracking-widest flex items-center gap-2 border-2 border-[#0A0A0A] hover:bg-transparent hover:text-[#0A0A0A] transition-colors duration-150 disabled:opacity-50 ml-auto">
                {loading ? 'Generating...' : step === 3 ? <>Generate My Startup <Sparkles className="h-4 w-4" /></> : <>Next Step <ArrowRight className="h-4 w-4" /></>}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
