import { Link, useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { logoutAccount } from '../services/api.js';
import { clearSession, getSession } from '../services/storage.js';

export function BrandLink({ inverted = false }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className={`h-8 w-8 flex items-center justify-center ${inverted ? 'bg-[#F5F3EE]' : 'bg-[#0A0A0A]'}`}>
        <Rocket className={`h-4 w-4 ${inverted ? 'text-[#0A0A0A]' : 'text-[#F5F3EE]'}`} />
      </div>
      <span className={`text-sm font-black uppercase tracking-widest ${inverted ? 'text-[#F5F3EE]' : 'text-[#0A0A0A]'}`}>
        Skill2Startup
      </span>
    </Link>
  );
}

export function AppNav() {
  const navigate = useNavigate();
  const session = getSession();

  async function handleLogout() {
    try {
      await logoutAccount();
    } catch {
      // Local logout should still succeed even if the token is already gone.
    }
    clearSession();
    navigate('/signin');
  }

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-[#F5F3EE] border-b-2 border-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        <BrandLink />
        <div className="hidden md:flex items-center gap-8">
          <Link to="/#features" className="text-xs font-bold uppercase tracking-widest text-[#0A0A0A] hover:underline">Features</Link>
          <Link to="/#how-it-works" className="text-xs font-bold uppercase tracking-widest text-[#0A0A0A] hover:underline">How It Works</Link>
          <Link to="/dashboard" className="text-xs font-bold uppercase tracking-widest text-[#0A0A0A] hover:underline">Dashboard</Link>
          {session?.user ? (
            <>
              <span className="text-xs font-bold uppercase tracking-widest text-[#6A6A6A]">{session.user.name}</span>
              <button type="button" onClick={handleLogout} className="text-xs font-bold uppercase tracking-widest text-[#0A0A0A] hover:underline">Logout</button>
            </>
          ) : (
            <Link to="/signin" className="text-xs font-bold uppercase tracking-widest text-[#0A0A0A] hover:underline">Sign In</Link>
          )}
        </div>
        <Link to="/input" className="h-10 px-6 bg-[#0A0A0A] text-[#F5F3EE] text-xs font-black uppercase tracking-widest flex items-center border-2 border-[#0A0A0A] hover:bg-[#F5F3EE] hover:text-[#0A0A0A] transition-colors duration-150">
          Get Started
        </Link>
      </div>
    </nav>
  );
}
