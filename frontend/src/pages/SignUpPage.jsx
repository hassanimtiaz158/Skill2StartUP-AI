import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Rocket, Mail, Lock, Eye, EyeOff, ArrowRight, User, Check } from 'lucide-react';
import { toast } from '@/components/Toast';
import { Input, PasswordStrengthBar } from '@/components/Input';
import { fadeUp, stagger } from '@/config/animations';

const passwordChecks = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { label: 'Contains uppercase', test: (v) => /[A-Z]/.test(v) },
  { label: 'Contains a number', test: (v) => /\d/.test(v) },
];

export default function SignUpPage() {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast('Please fill in all fields', 'error');
      return;
    }
    if (form.password.length < 8) {
      toast('Password must be at least 8 characters', 'error');
      return;
    }
    if (!agreed) {
      toast('Please agree to the Terms of Service', 'error');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    toast('Account created! Welcome!', 'success');
    navigate('/input');
  };

  return (
    <div className="min-h-screen bg-bg overflow-x-hidden">
      {/* Background orbs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-accent-2/10 blur-3xl" />

      <div className="relative mx-auto max-w-md px-4 pt-24 md:pt-28 pb-12 md:pb-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative w-full"
        >
          {/* Logo */}
          <motion.div variants={fadeUp} custom={0} className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-accent-2 flex items-center justify-center shadow-lg shadow-primary/20">
                <Rocket className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-ink tracking-tight">Skill2Startup</span>
            </Link>
            <h1 className="text-3xl font-extrabold text-ink mb-2">
              Create your account
            </h1>
            <p className="text-base text-ink-muted">
              Start turning skills into startups
            </p>
          </motion.div>

          {/* Auth card */}
          <motion.div
            variants={fadeUp}
            custom={1}
            whileHover={reducedMotion ? {} : { y: -2 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            {/* Top gradient stripe */}
            <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-primary via-accent-2 to-accent" />

            <div className="rounded-2xl border border-border bg-white/90 backdrop-blur-sm p-8 shadow-xl shadow-slate-200/50">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <Input
                  id="signup-name"
                  label="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  icon={User}
                  placeholder="John Doe"
                  autoComplete="name"
                />

                {/* Email */}
                <Input
                  id="signup-email"
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  icon={Mail}
                  placeholder="you@example.com"
                  autoComplete="email"
                />

                {/* Password */}
                <div className="relative">
                  <Input
                    id="signup-password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    icon={Lock}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                  />
                  {/* Eye toggle button */}
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[1.35rem] text-ink-faint hover:text-ink-muted transition-colors z-10"
                    whileTap={reducedMotion ? {} : { scale: 0.85, rotate: 10 }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </motion.button>
                  {/* Password strength bar */}
                  <PasswordStrengthBar password={form.password} />
                  {/* Check marks */}
                  {form.password.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      {passwordChecks.map((check) => {
                        const passed = check.test(form.password);
                        return (
                          <motion.div
                            key={check.label}
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <motion.div
                              className={`h-3.5 w-3.5 rounded-full flex items-center justify-center ${
                                passed ? 'bg-success/15' : 'bg-slate-100'
                              }`}
                              animate={passed && !reducedMotion ? { scale: [0, 1.2, 1] } : {}}
                              transition={{ duration: 0.3 }}
                            >
                              <Check className={`h-2 w-2 ${passed ? 'text-success' : 'text-ink-faint'}`} strokeWidth={3} />
                            </motion.div>
                            <span className={`text-xs ${passed ? 'text-success' : 'text-ink-faint'}`}>{check.label}</span>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Terms */}
                <label
                  className="flex items-start gap-3 cursor-pointer select-none"
                  onClick={() => setAgreed(!agreed)}
                >
                  <motion.div
                    className={`mt-0.5 h-4 w-4 shrink-0 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                      agreed ? 'bg-primary border-primary' : 'bg-white border-border'
                    }`}
                    whileTap={reducedMotion ? {} : { scale: 0.9 }}
                  >
                    <motion.div
                      initial={false}
                      animate={{ scale: agreed ? 1 : 0, opacity: agreed ? 1 : 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                    </motion.div>
                  </motion.div>
                  <span className="text-xs text-ink-muted leading-relaxed">
                    I agree to the{' '}
                    <button type="button" className="text-primary hover:text-primary-hover transition-colors font-medium">Terms of Service</button>
                    {' '}and{' '}
                    <button type="button" className="text-primary hover:text-primary-hover transition-colors font-medium">Privacy Policy</button>
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent-2 text-white text-sm font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed animate-pulse-glow btn-press"
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Create Account <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-ink-faint font-medium">or continue with</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Social buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="flex items-center justify-center gap-2 h-11 rounded-xl border border-border bg-white text-sm text-ink-muted hover:bg-slate-50 hover:border-border-strong transition-all duration-150 font-medium">
                  <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
                </button>
                <button type="button" className="flex items-center justify-center gap-2 h-11 rounded-xl border border-border bg-white text-sm text-ink-muted hover:bg-slate-50 hover:border-border-strong transition-all duration-150 font-medium">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  GitHub
                </button>
              </div>
            </div>
          </motion.div>

          {/* Sign in link */}
          <motion.p variants={fadeUp} custom={2} className="text-center text-sm text-ink-muted mt-6">
            Already have an account?{' '}
            <Link to="/signin" className="text-primary hover:text-primary-hover font-semibold transition-colors">
              Sign in
            </Link>
          </motion.p>

          {/* Back to home */}
          <motion.div variants={fadeUp} custom={3} className="text-center mt-4">
            <Link to="/" className="text-sm text-ink-faint hover:text-ink-muted transition-colors font-medium">
              ← Back to home
            </Link>
          </motion.div>

          {/* Trust badge */}
          <motion.p variants={fadeUp} custom={4} className="text-center text-xs text-ink-faint mt-6">
            Free forever · Your data stays in your browser
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
