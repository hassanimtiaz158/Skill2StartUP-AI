import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { ToastContainer } from '@/components/Toast';
import { Navbar } from '@/components/Navbar';
import ErrorBoundary from '@/components/ErrorBoundary';
import { PageSkeleton } from '@/components/Skeleton';
import { pageVariants } from '@/config/animations';

const LandingPage = lazy(() => import('@/pages/LandingPage'));
const InputPage = lazy(() => import('@/pages/InputPage'));
const ResultsPage = lazy(() => import('@/pages/ResultsPage'));
const StartupDetailPage = lazy(() => import('@/pages/StartupDetailPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const SignInPage = lazy(() => import('@/pages/SignInPage'));
const SignUpPage = lazy(() => import('@/pages/SignUpPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function AnimatedRoutes() {
  const location = useLocation();
  const reducedMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants(reducedMotion)}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: reducedMotion ? 0.01 : 0.15, ease: 'easeInOut' }}
      >
        <Suspense fallback={<PageSkeleton />}>
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/input" element={<InputPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/startup/:name" element={<StartupDetailPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-accent-2 origin-left z-[60]"
      style={{ scaleX }}
    />
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <motion.button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent-2 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
    >
      <ArrowUp className="h-5 w-5" />
    </motion.button>
  );
}

export default function App() {
  return (
    <Router>
      <ErrorBoundary>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-[var(--r-md)] focus:text-sm"
        >
          Skip to main content
        </a>
        <ScrollProgress />
        <ToastContainer />
        <Navbar />
        <main id="main-content">
          <AnimatedRoutes />
        </main>
        <BackToTop />
      </ErrorBoundary>
    </Router>
  );
}
