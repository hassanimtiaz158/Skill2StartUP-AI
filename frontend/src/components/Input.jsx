import { cn } from '@/lib/utils';
import { useState, useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function Input({ className, label, error, icon: Icon, hint, id, type = 'text', ...props }) {
  const [focused, setFocused] = useState(false);
  const autoId = useId();
  const inputId = id || autoId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const reducedMotion = useReducedMotion();

  const hasValue = props.value !== undefined && props.value !== null && String(props.value).length > 0;
  const isActive = focused || hasValue;
  const showFloatingLabel = !!label;

  return (
    <motion.div
      className="space-y-2 min-w-0"
      animate={error && !reducedMotion ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative">
        {/* Icon slot */}
        {Icon && (
          <motion.span
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center"
            animate={focused ? { color: 'var(--primary)' } : { color: 'var(--ink-faint)' }}
            transition={{ duration: 0.2 }}
          >
            <Icon className="h-4 w-4" />
          </motion.span>
        )}

        {/* Floating label */}
        {showFloatingLabel && (
          <motion.label
            htmlFor={inputId}
            className={cn(
              'absolute left-0 right-0 pointer-events-none origin-left px-4',
              Icon && 'left-11',
              isActive
                ? 'text-[10px] font-semibold text-primary top-2'
                : 'text-sm font-normal text-ink-faint top-1/2 -translate-y-1/2'
            )}
            animate={{
              y: isActive ? 0 : undefined,
              scale: isActive ? 1 : 1,
            }}
            transition={{ duration: reducedMotion ? 0 : 0.2, ease: 'easeOut' }}
          >
            {label}
          </motion.label>
        )}

        {/* Input */}
        <input
          id={inputId}
          type={type}
          className={cn(
            'flex w-full rounded-xl border border-border bg-white text-sm text-ink',
            'placeholder:text-transparent',
            'transition-all duration-200',
            'hover:border-border-strong',
            'disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-slate-50',
            showFloatingLabel ? 'pt-5 pb-1 px-4' : 'h-12 px-4 py-3',
            Icon && !showFloatingLabel && 'pl-11',
            Icon && showFloatingLabel && 'pl-11',
            focused && !error && 'border-transparent ring-0 outline-none',
            focused && !error && 'shadow-[0_0_0_2px_rgba(99,102,241,0.6),0_0_20px_rgba(99,102,241,0.15)]',
            error && 'border-danger/50 focus:border-danger focus:ring-danger/10',
            className
          )}
          style={focused && !error ? {
            background: 'linear-gradient(135deg, #f8f7ff 0%, #fdf4ff 100%)',
          } : undefined}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          {...props}
        />

        {/* Animated focus underline */}
        <motion.div
          aria-hidden="true"
          className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-primary via-accent-2 to-accent rounded-full origin-left"
          initial={false}
          animate={{ scaleX: focused ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.3, ease: 'easeOut' }}
        />
      </div>

      {/* Hint */}
      {hint && !error && (
        <p id={hintId} className="text-xs text-ink-faint leading-relaxed">{hint}</p>
      )}

      {/* Error message */}
      {error && (
        <motion.p
          id={errorId}
          className="text-xs text-danger flex items-center gap-1"
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.2 }}
        >
          <span className="inline-flex shrink-0 items-center justify-center h-4 w-4 rounded-full bg-danger/10 text-[10px]">⚠</span> {error}
        </motion.p>
      )}
    </motion.div>
  );
}

/* ── Password strength bar ── */
const strengthColors = ['bg-danger', 'bg-warning', 'bg-warning', 'bg-success'];
const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

export function passwordStrength(password) {
  if (!password) return { score: 0, checks: [false, false, false, false] };
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password) || password.length >= 12,
  ];
  const score = checks.filter(Boolean).length;
  return { score, checks };
}

export function PasswordStrengthBar({ password }) {
  const { score, checks } = passwordStrength(password);
  const reducedMotion = useReducedMotion();

  if (!password) return null;

  return (
    <div className="space-y-1.5 pt-1">
      <div className="flex gap-1">
        {checks.map((passed, i) => (
          <motion.div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full overflow-hidden bg-slate-100'
            )}
          >
            <motion.div
              className={cn('h-full rounded-full', score > i ? strengthColors[score - 1] : 'bg-transparent')}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: score > i ? 1 : 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.3, delay: i * 0.08, ease: 'easeOut' }}
              style={{ originX: 0 }}
            />
          </motion.div>
        ))}
      </div>
      <p className={cn('text-[10px] font-semibold', score <= 1 ? 'text-danger' : score <= 2 ? 'text-warning' : 'text-success')}>
        {strengthLabels[score - 1] || 'Too short'}
      </p>
    </div>
  );
}
