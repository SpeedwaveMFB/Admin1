import { Card, CardContent, Typography, Box } from '@mui/material';
import { formatCurrency, formatNumber } from '@/lib/utils/format';

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

  return (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ color, mb: 1 }}>
              {formattedValue()}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {icon && (
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                backgroundColor: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color,
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}


