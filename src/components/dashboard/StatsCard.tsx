import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatNumber } from '@/lib/utils/format';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  format?: 'currency' | 'number' | 'text';
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  color = 'primary.main',
  format = 'number',
}: StatsCardProps) {
  const formattedValue = () => {
    if (format === 'currency' && typeof value === 'number') {
      return formatCurrency(value);
    }
    if (format === 'number' && typeof value === 'number') {
      return formatNumber(value);
    }
    return value;
  };

  const getColorClasses = (muiColor: string) => {
    switch (muiColor) {
      case 'success.main': return { text: 'text-green-600', bg: 'bg-green-100' };
      case 'warning.main': return { text: 'text-yellow-600', bg: 'bg-yellow-100' };
      case 'error.main': return { text: 'text-red-600', bg: 'bg-red-100' };
      case 'info.main': return { text: 'text-purple-600', bg: 'bg-purple-100' };
      case 'primary.main':
      default:
        return { text: 'text-purple-700', bg: 'bg-purple-50' };
    }
  };

  const colors = getColorClasses(color);

  return (
    <Card className="h-full flex flex-col border-slate-200 shadow-sm">
      <CardContent className="flex-grow flex flex-col p-6">
        <div className="flex items-start justify-between h-full">
          <div className="flex flex-col justify-between flex-1">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                {title}
              </p>
              <h3 className={cn('text-2xl font-bold tracking-tight', colors.text, subtitle ? 'mb-1' : '')}>
                {formattedValue()}
              </h3>
            </div>
            {subtitle && (
              <p className="text-sm text-slate-500">
                {subtitle}
              </p>
            )}
          </div>
          {icon && (
            <div className={cn(
              'w-14 h-14 rounded-xl flex items-center justify-center ml-4 shrink-0',
              colors.bg,
              colors.text
            )}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
