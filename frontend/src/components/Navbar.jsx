import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Rocket, Menu, X, Sparkles, User } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const isLanding = location.pathname === '/';
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';

  const handleAnchorClick = useCallback((e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    if (isLanding) {
      const el = document.querySelector(href);
      if (el) {
        const navbarHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) || 72;
        const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    } else {
      navigate(`/${href}`);
    }
  }, [isLanding, navigate]);

  if (isAuthPage) return null;

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 transition-all duration-300',
        scrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-border shadow-sm'
          : 'bg-transparent border-b border-transparent'
      )}
      style={{ zIndex: 'var(--z-sticky)' }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container">
        <div style={{ height: 'var(--navbar-h)' }} className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0" aria-label="Skill2Startup home">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent-2 flex items-center justify-center shadow-md shadow-primary/20 group-hover:shadow-lg group-hover:shadow-primary/30 transition-shadow duration-300">
              <Rocket className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-ink tracking-tight hidden sm:inline">
              Skill2Startup
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {isLanding && (
              <>
                <a
                  href="#features"
                  onClick={(e) => handleAnchorClick(e, '#features')}
                  className="px-3.5 py-2 text-sm font-medium text-ink-muted hover:text-ink transition-colors rounded-lg hover:bg-slate-100"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleAnchorClick(e, '#how-it-works')}
                  className="px-3.5 py-2 text-sm font-medium text-ink-muted hover:text-ink transition-colors rounded-lg hover:bg-slate-100"
                >
                  How It Works
                </a>
              </>
            )}
            <Link
              to="/dashboard"
              className={cn(
                'px-3.5 py-2 text-sm font-medium rounded-lg transition-colors',
                location.pathname === '/dashboard'
                  ? 'text-primary bg-primary-soft'
                  : 'text-ink-muted hover:text-ink hover:bg-slate-100'
              )}
            >
              Dashboard
            </Link>
            <Link
              to="/signin"
              className="px-3.5 py-2 text-sm font-medium text-ink-muted hover:text-ink rounded-lg hover:bg-slate-100 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/input"
              className="ml-2 h-10 px-6 rounded-xl bg-gradient-to-r from-primary to-accent-2 text-white text-sm font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 btn-press"
            >
              <Sparkles className="h-4 w-4" />
              Get Started
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-ink-muted hover:text-ink p-2 -mr-2"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border bg-white/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="container px-4 py-4 space-y-1">
              {isLanding && (
                <>
                  <a
                    href="#features"
                    onClick={(e) => handleAnchorClick(e, '#features')}
                    className="block px-3 py-2.5 text-sm font-medium text-ink-muted hover:text-ink rounded-lg hover:bg-slate-100"
                  >
                    Features
                  </a>
                  <a
                    href="#how-it-works"
                    onClick={(e) => handleAnchorClick(e, '#how-it-works')}
                    className="block px-3 py-2.5 text-sm font-medium text-ink-muted hover:text-ink rounded-lg hover:bg-slate-100"
                  >
                    How It Works
                  </a>
                </>
              )}
              <Link to="/dashboard" className="block px-3 py-2.5 text-sm font-medium text-ink-muted hover:text-ink rounded-lg hover:bg-slate-100">
                Dashboard
              </Link>
              <Link to="/signin" className="block px-3 py-2.5 text-sm font-medium text-ink-muted hover:text-ink rounded-lg hover:bg-slate-100">
                <User className="h-4 w-4 inline mr-2" />
                Sign In
              </Link>
              <Link to="/input" className="flex items-center justify-center gap-2 h-11 px-4 mt-2 text-sm font-semibold text-white bg-gradient-to-r from-primary to-accent-2 rounded-xl shadow-md shadow-primary/20">
                <Sparkles className="h-4 w-4" />
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
