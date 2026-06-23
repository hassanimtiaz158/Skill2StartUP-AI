import { cn } from "@/lib/utils";

const variants = {
  default:   "bg-primary-soft text-primary border border-primary/15",
  success:   "bg-success-soft text-success border border-success/15",
  warning:   "bg-warning-soft text-warning border border-warning/15",
  danger:    "bg-danger-soft text-danger border border-danger/15",
  secondary: "bg-slate-100 text-ink-muted border border-border",
  gradient:  "bg-gradient-to-r from-primary/10 to-accent-2/10 text-primary border border-primary/15",
  glow:      "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(99,102,241,0.15)]",
  cyan:      "bg-cyan-soft text-cyan border border-cyan/15",
};

export function Badge({ className, variant = "default", children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors duration-200",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
