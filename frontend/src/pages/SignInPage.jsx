import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Rocket } from 'lucide-react';
import { requestPasswordReset, signInAccount } from '../services/api.js';
import { setSession } from '../services/storage.js';

export default function SignInPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    if (!form.email || !form.password) {
      setError('Email and password are required.');
      return;
    }
    setLoading(true);
    try {
      const auth = await signInAccount(form);
      setSession(auth);
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    setError('');
    setNotice('');
    if (!form.email) {
      setError('Enter your email first, then click forgot.');
      return;
    }
    setResetLoading(true);
    try {
      const result = await requestPasswordReset(form.email);
      setNotice(result.message);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <main className="bg-[#F5F3EE] min-h-screen text-[#0A0A0A]">
      <div className="flex min-h-screen">
        <div className="hidden lg:flex flex-col justify-between bg-[#0A0A0A] p-12 min-h-screen w-[420px] shrink-0 border-r-2 border-[#0A0A0A]">
          <div>
            <div className="flex items-center gap-2 mb-16">
              <div className="h-8 w-8 bg-[#F5F3EE] flex items-center justify-center">
                <Rocket className="h-4 w-4 text-[#0A0A0A]" />
              </div>
              <span className="text-sm font-black uppercase tracking-widest text-[#F5F3EE]">Skill2Startup</span>
            </div>
            <h2 className="text-4xl font-black uppercase text-white leading-none mb-4">Welcome<br />Back.</h2>
            <p className="text-sm text-white/40 border-l-2 border-white/20 pl-4 leading-relaxed">Access your startup blueprints, ideas, and execution plans.</p>
          </div>
          <div className="border-t border-white/10 pt-6">
            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/20 mb-3">Trusted by builders</p>
            <div className="flex -space-x-px">
              {['SC', 'MJ', 'PP', 'AK'].map((initials) => (
                <div key={initials} className="h-8 w-8 border border-white/20 bg-white/10 flex items-center justify-center">
                  <span className="text-[9px] font-black text-white/60">{initials}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-16 min-h-screen">
          <div className="w-full max-w-sm">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#6A6A6A] mb-2">Sign In</p>
            <h1 className="text-3xl font-black uppercase text-[#0A0A0A] mb-8 leading-none">Access<br />Account.</h1>

            <form onSubmit={handleSubmit} className="space-y-0">
              <div className="border-2 border-[#0A0A0A] p-4 mb-[-2px]">
                <label className="block text-[9px] font-black uppercase tracking-[0.15em] text-[#6A6A6A] mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full bg-transparent text-sm font-medium text-[#0A0A0A] placeholder:text-[#C0BDB6] focus:outline-none"
                />
              </div>

              <div className="border-2 border-[#0A0A0A] p-4 relative mb-4">
                <label className="block text-[9px] font-black uppercase tracking-[0.15em] text-[#6A6A6A] mb-2">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full bg-transparent text-sm font-medium text-[#0A0A0A] placeholder:text-[#C0BDB6] focus:outline-none pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 bottom-4 text-[#6A6A6A] hover:text-[#0A0A0A]" aria-label="Toggle password">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {error && <p className="text-[10px] font-black uppercase tracking-wide border-l-2 border-[#0A0A0A] pl-2 mb-4">{error}</p>}
              {notice && <p className="text-[10px] font-black uppercase tracking-wide border-l-2 border-[#0A0A0A] pl-2 mb-4">{notice}</p>}

              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 border-2 border-[#0A0A0A] appearance-none checked:bg-[#0A0A0A] cursor-pointer" />
                  <span className="text-xs font-bold text-[#3A3A3A] uppercase tracking-wide">Remember me</span>
                </label>
                <button type="button" onClick={handleForgotPassword} disabled={resetLoading} className="text-xs font-black uppercase tracking-wide text-[#0A0A0A] underline disabled:opacity-50">
                  {resetLoading ? 'Sending...' : 'Forgot?'}
                </button>
              </div>

              <button type="submit" disabled={loading} className="w-full h-12 bg-[#0A0A0A] text-[#F5F3EE] text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 border-2 border-[#0A0A0A] hover:bg-transparent hover:text-[#0A0A0A] transition-colors duration-150 disabled:opacity-50">
                {loading ? 'Signing in...' : <>Sign In <ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>

            <p className="text-center text-xs font-bold text-[#6A6A6A] mt-8 uppercase tracking-wide">
              No account? <Link to="/signup" className="text-[#0A0A0A] underline font-black">Create one free</Link>
            </p>
            <div className="text-center mt-4">
              <Link to="/" className="text-[9px] font-black uppercase tracking-widest text-[#C0BDB6] hover:text-[#0A0A0A] transition-colors">Back to home</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
