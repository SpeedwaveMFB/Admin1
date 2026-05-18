import { cn } from '@/lib/utils';
import { formatCurrency, formatNumber } from '@/lib/utils/format';

export type StatsCardVariant = 'hero' | 'metric' | 'mini';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  tone?: 'violet' | 'emerald' | 'amber' | 'rose' | 'slate' | 'sky';
  format?: 'currency' | 'number' | 'text' | 'percent';
  variant?: StatsCardVariant;
  className?: string;
}

const toneStyles = {
  violet: {
    ring: 'ring-violet-500/20',
    bg: 'bg-gradient-to-br from-violet-600 to-violet-800',
    soft: 'bg-violet-500/10 text-violet-700',
    icon: 'bg-white/15 text-white',
  },
  emerald: {
    ring: 'ring-emerald-500/20',
    bg: 'bg-gradient-to-br from-emerald-500 to-teal-700',
    soft: 'bg-emerald-500/10 text-emerald-700',
    icon: 'bg-white/15 text-white',
  },
  amber: {
    ring: 'ring-amber-500/20',
    bg: 'bg-gradient-to-br from-amber-500 to-orange-600',
    soft: 'bg-amber-500/10 text-amber-800',
    icon: 'bg-white/15 text-white',
  },
  rose: {
    ring: 'ring-rose-500/20',
    bg: 'bg-gradient-to-br from-rose-500 to-red-700',
    soft: 'bg-rose-500/10 text-rose-700',
    icon: 'bg-white/15 text-white',
  },
  sky: {
    ring: 'ring-sky-500/20',
    bg: 'bg-gradient-to-br from-sky-500 to-blue-700',
    soft: 'bg-sky-500/10 text-sky-700',
    icon: 'bg-white/15 text-white',
  },
  slate: {
    ring: 'ring-slate-500/15',
    bg: 'bg-gradient-to-br from-slate-700 to-slate-900',
    soft: 'bg-slate-500/10 text-slate-700',
    icon: 'bg-white/15 text-white',
  },
};

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  tone = 'violet',
  format = 'number',
  variant = 'metric',
  className,
}: StatsCardProps) {
  const t = toneStyles[tone];

  const formattedValue = () => {
    if (format === 'currency' && typeof value === 'number') return formatCurrency(value);
    if (format === 'number' && typeof value === 'number') return formatNumber(value);
    if (format === 'percent' && typeof value === 'number') return `${value.toFixed(1)}%`;
    return value;
  };

  if (variant === 'hero') {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl p-6 text-white shadow-lg ring-1',
          t.bg,
          t.ring,
          className
        )}
      >
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-white/80">{title}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight break-words">{formattedValue()}</p>
            {subtitle && <p className="mt-1 text-xs text-white/70">{subtitle}</p>}
          </div>
          {icon && (
            <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl', t.icon)}>
              {icon}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'mini') {
    return (
      <div className={cn('flex items-center justify-between gap-3 rounded-xl border border-default-200 bg-content1 px-4 py-3', className)}>
        <div className="min-w-0">
          <p className="text-xs font-medium text-default-500">{title}</p>
          <p className="text-lg font-semibold text-foreground truncate">{formattedValue()}</p>
        </div>
        {icon && (
          <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', t.soft)}>
            {icon}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-default-200 bg-content1 p-5 shadow-sm transition-shadow hover:shadow-md',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-default-500">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground break-words">
            {formattedValue()}
          </p>
          {subtitle && <p className="mt-1 text-sm text-default-500">{subtitle}</p>}
        </div>
        {icon && (
          <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', t.soft)}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
