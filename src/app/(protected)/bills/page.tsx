'use client';

import { Box, Typography, Grid, Card, CardContent, CardActionArea, IconButton, Alert } from '@mui/material';
import { Phone, Bolt, Tv, Refresh } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import StatsCard from '@/components/dashboard/StatsCard';
import { useBillStats } from '@/lib/hooks/useTransactions';
import { formatCurrency } from '@/lib/utils/format';

export default function BillsPage() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useBillStats();

  const stats = data?.data;
  const byType = stats?.byType || [];

  const billTypes = [
    {
      title: 'Airtime',
      description: 'View and manage airtime purchases',
      icon: <Phone />,
      path: '/bills/airtime',
      color: 'primary',
      typeKey: 'airtime',
    },
    {
      title: 'Data',
      description: 'View and manage data bundles',
      icon: <Phone />,
      path: '/bills/data',
      color: 'primary',
      typeKey: 'data',
    },
    {
      title: 'Electricity',
      description: 'Manage electricity bill payments',
      icon: <Bolt />,
      path: '/bills/electricity',
      color: 'warning',
      typeKey: 'electricity',
    },
    {
      title: 'Cable TV',
      description: 'Manage cable TV subscriptions',
      icon: <Tv />,
      path: '/bills/cable',
      color: 'secondary',
      typeKey: 'cable_tv',
    },
  ] as const;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Bill Payments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor airtime, data, electricity, and cable bill transactions
          </Typography>
        </Box>
        <IconButton onClick={() => refetch()} color="primary">
          <Refresh />
        </IconButton>
      </Box>

      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Bill Txns"
              value={stats.summary.totalTransactions}
              subtitle={`${stats.summary.totalSuccessful} successful`}
              color="primary.main"
              icon={<Phone />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Revenue"
              value={stats.summary.totalRevenue}
              color="success.main"
              format="currency"
              icon={<Bolt />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Failed Transactions"
              value={stats.summary.totalFailed}
              color="error.main"
              icon={<Tv />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Pending Transactions"
              value={stats.summary.totalPending}
              color="warning.main"
              icon={<Tv />}
            />
          </Grid>
        </Grid>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load bill payment statistics. Please try again.
        </Alert>
      )}

      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Bill Types
      </Typography>
      <Grid container spacing={3}>
        {billTypes.map((bill) => {
          const typeStats = byType.find((t) => t.type === bill.typeKey);

          return (
            <Grid item xs={12} sm={6} md={3} key={bill.path}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardActionArea
                  onClick={() => router.push(bill.path)}
                  sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: `${bill.color}.main`,
                        color: 'white',
                        mb: 2,
                      }}
                    >
                      {bill.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {bill.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {bill.description}
                    </Typography>
                    {typeStats && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography variant="body2">
                          Total: <strong>{typeStats.totalCount}</strong>
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          Successful: <strong>{typeStats.successCount}</strong>
                        </Typography>
                        <Typography variant="body2" color="error.main">
                          Failed: <strong>{typeStats.failedCount}</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Volume: <strong>{formatCurrency(typeStats.totalAmount)}</strong>
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

