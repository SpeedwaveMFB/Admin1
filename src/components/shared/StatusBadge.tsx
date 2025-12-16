import { Chip } from '@mui/material';

interface StatusBadgeProps {
  status: string;
  type?: 'user' | 'transaction';
}

export default function StatusBadge({ status, type = 'transaction' }: StatusBadgeProps) {
  const getColor = () => {
    if (type === 'user') {
      switch (status.toLowerCase()) {
        case 'active':
          return 'success';
        case 'suspended':
          return 'error';
        case 'closed':
          return 'default';
        default:
          return 'default';
      }
    }

    // transaction status
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Chip
      label={status}
      color={getColor()}
      size="small"
      sx={{ textTransform: 'capitalize', fontWeight: 500 }}
    />
  );
}




