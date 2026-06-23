import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const styles = {
  success: 'border-success/20 bg-white',
  error:   'border-danger/20 bg-white',
  info:    'border-primary/20 bg-white',
};

const iconColors = {
  success: 'text-success',
  error:   'text-danger',
  info:    'text-primary',
};

let toastId = 0;
let listeners = [];

export function toast(message, type = 'info') {
  const id = ++toastId;
  listeners.forEach((l) => l({ id, message, type }));
  return id;
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (t) => {
      setToasts((prev) => {
        const next = [...prev, t];
        return next.length > 5 ? next.slice(-5) : next;
      });
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 4000);
    };
    listeners.push(handler);
    return () => {
      listeners = listeners.filter((l) => l !== handler);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-4 right-4 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      style={{ zIndex: 'var(--z-toast)' }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => {
          const Icon = icons[t.type] || Info;
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={cn(
                'pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg shadow-slate-200/50',
                styles[t.type]
              )}
            >
              <Icon className={cn('h-5 w-5 shrink-0', iconColors[t.type])} />
              <span className="text-sm font-medium text-ink flex-1 min-w-0 line-clamp-2">{t.message}</span>
              <button
                onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                className="shrink-0 text-ink-faint hover:text-ink transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
