import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <h1 className="font-display text-8xl font-bold gradient-text mb-4">404</h1>
        <h2 className="font-display text-2xl font-semibold text-ink mb-3">Page not found</h2>
        <p className="text-ink-muted text-sm mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 h-11 px-6 rounded-[var(--r-md)] bg-gradient-to-r from-primary to-accent-2 text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-150"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
          <button
            type="button"
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 h-11 px-6 border border-border bg-white text-sm font-medium text-ink-muted hover:text-ink hover:border-border-strong transition-all duration-150 rounded-[var(--r-md)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
