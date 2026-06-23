import { cn } from '@/lib/utils';
import { useState, useId } from 'react';

export function Input({ className, label, error, icon: Icon, hint, id, ...props }) {
  const [focused, setFocused] = useState(false);
  const autoId = useId();
  const inputId = id || autoId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-primary" />}
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && !label && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'flex h-12 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink',
            'placeholder:text-ink-faint placeholder:font-normal',
            'transition-all duration-200',
            'focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white',
            'hover:border-border-strong',
            'disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-slate-50',
            Icon && !label && 'pl-11',
            error && 'border-danger/50 focus:border-danger focus:ring-danger/10',
            className
          )}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          {...props}
        />
        {/* Focus underline */}
        <div
          aria-hidden="true"
          className={cn(
            'absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-primary to-accent-2 rounded-full origin-left transition-transform duration-300',
            focused ? 'scale-x-100' : 'scale-x-0'
          )}
        />
      </div>
      {hint && !error && (
        <p id={hintId} className="text-xs text-ink-faint">{hint}</p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-danger flex items-center gap-1" role="alert">
          <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-danger/10 text-[10px]">⚠</span> {error}
        </p>
      )}
    </div>
  );
}
