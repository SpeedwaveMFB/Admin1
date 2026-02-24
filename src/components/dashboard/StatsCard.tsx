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
    <Card
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {title}
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ color, mb: subtitle ? 1 : 0 }}>
                {formattedValue()}
              </Typography>
            </Box>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {icon && (
            <Box
              sx={{
                width: 56, // Slightly larger
                height: 56,
                borderRadius: 3, // More rounded (match theme shape)
                backgroundColor: (theme) => {
                  // If color is a theme path like "primary.main", use alpha
                  // This requires a helper or simple trick. Since we passed "primary.main",
                  // we can try to access the palette.
                  // For simplicity in this revamp, let's use a light grey or conditional.
                  // Better idea: Use the 'color' prop directly if it's a valid color, or map it.
                  if (color.includes('.')) {
                    const [main, sub] = color.split('.');
                    // @ts-ignore
                    const c = theme.palette[main]?.[sub] || theme.palette.primary.main;
                    return `${c}1A`; // 10% opacity hex
                  }
                  return '#F3F4F6';
                },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color, // Text color works with theme strings automatically
                ml: 2,
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


