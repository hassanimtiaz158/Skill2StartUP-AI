import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-slate-100 relative overflow-hidden', className)}
      {...props}
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200/50 to-transparent"
        style={{ animation: 'shimmer 2s infinite' }}
      />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 space-y-4" aria-busy="true" role="status" aria-label="Loading content">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-bg" aria-busy="true" role="status" aria-label="Loading page">
      <div style={{ height: 'var(--navbar-h)' }} className="border-b border-border bg-white" />
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        <div className="space-y-3">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
