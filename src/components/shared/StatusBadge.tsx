import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  type?: 'user' | 'transaction';
  className?: string;
}

export default function StatusBadge({ status, type = 'transaction', className }: StatusBadgeProps) {
  const getBadgeStyle = () => {
    if (!status) return 'bg-slate-100 text-slate-800 hover:bg-slate-100';

    if (type === 'user') {
      switch (status.toLowerCase()) {
        case 'active':
          return 'bg-green-100 text-green-800 hover:bg-green-100';
        case 'suspended':
          return 'bg-red-100 text-red-800 hover:bg-red-100';
        case 'closed':
          return 'bg-slate-100 text-slate-800 hover:bg-slate-100';
        default:
          return 'bg-slate-100 text-slate-800 hover:bg-slate-100';
      }
    }

    // transaction status
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'failed':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-slate-100 text-slate-800 hover:bg-slate-100';
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn('capitalize font-medium border-transparent', getBadgeStyle(), className)}
    >
      {status || 'Unknown'}
    </Badge>
  );
}
