import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Rocket } from 'lucide-react';

export default function NotFoundPage() {
  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb w-[300px] h-[300px] bg-primary/8 -top-20 -left-20" />
      <div className="orb w-[200px] h-[200px] bg-accent/6 bottom-10 right-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md relative"
      >
        {/* Floating rocket */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent-2 shadow-lg shadow-primary/20"
        >
          <Rocket className="h-7 w-7 text-white" />
        </motion.div>

        <h1 className="font-display text-7xl font-bold gradient-text mb-3">404</h1>
        <h2 className="font-display text-2xl font-semibold text-ink mb-3">Lost in space</h2>
        <p className="text-ink-muted text-sm mb-8">
          This page didn&apos;t make it to launch. Let&apos;s get you back on track.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-gradient-to-r from-primary to-accent-2 text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-150"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
          <button
            type="button"
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 h-11 px-6 border border-border bg-white text-sm font-medium text-ink-muted hover:text-ink hover:border-border-strong transition-all duration-150 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
