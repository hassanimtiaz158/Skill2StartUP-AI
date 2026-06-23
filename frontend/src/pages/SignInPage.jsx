import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { toast } from '@/components/Toast';
import { fadeUp, stagger } from '@/config/animations';

export default function SignInPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast('Please fill in all fields', 'error');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    toast('Welcome back!', 'success');
    navigate('/input');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/80 via-white to-pink-50/60 relative flex items-center justify-center px-4 py-12">
      {/* Background orbs */}
      <div className="orb w-[400px] h-[400px] bg-primary/15 -top-32 -left-32" />
      <div className="orb w-[300px] h-[300px] bg-accent/10 -bottom-24 -right-24" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="relative w-full max-w-md"
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
            Welcome back
          </h1>
          <p className="text-base text-ink-muted">
            Sign in to access your startup blueprints
          </p>
        </motion.div>

        {/* Auth card */}
        <motion.div variants={fadeUp} custom={1}>
          <div className="rounded-2xl border border-border bg-white p-8 shadow-xl shadow-slate-200/50">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="signin-email" className="text-sm font-semibold text-ink flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  Email
                </label>
                <input
                  id="signin-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="flex h-12 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-faint transition-all duration-200 focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 hover:border-border-strong"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="signin-password" className="text-sm font-semibold text-ink flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="flex h-12 w-full rounded-xl border border-border bg-white px-4 py-3 pr-12 text-sm text-ink placeholder:text-ink-faint transition-all duration-200 focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 hover:border-border-strong"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-muted transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded border-border bg-white text-primary focus:ring-primary/20" />
                  <span className="text-sm text-ink-muted">Remember me</span>
                </label>
                <button type="button" className="text-sm text-primary hover:text-primary-hover transition-colors font-medium">
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent-2 text-white text-sm font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed animate-pulse-glow btn-press"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Sign In <ArrowRight className="h-4 w-4" /></>
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

        {/* Sign up link */}
        <motion.p variants={fadeUp} custom={2} className="text-center text-sm text-ink-muted mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:text-primary-hover font-semibold transition-colors">
            Create one free
          </Link>
        </motion.p>

        {/* Back to home */}
        <motion.div variants={fadeUp} custom={3} className="text-center mt-4">
          <Link to="/" className="text-sm text-ink-faint hover:text-ink-muted transition-colors font-medium">
            ← Back to home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
