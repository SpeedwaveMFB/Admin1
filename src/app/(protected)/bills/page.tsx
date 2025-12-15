'use client';

import { Box, Typography, Paper, Alert, Grid } from '@mui/material';
import { Phone, Bolt, Tv } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardActionArea } from '@mui/material';

export default function BillsPage() {
  const router = useRouter();

  const billTypes = [
    {
      title: 'Airtime',
      description: 'Manage airtime purchases',
      icon: <Phone />,
      path: '/bills/airtime',
      color: 'primary',
    },
    {
      title: 'Data',
      description: 'Manage data purchases',
      icon: <Phone />,
      path: '/bills/data',
      color: 'primary',
    },
    {
      title: 'Electricity',
      description: 'Manage electricity payments',
      icon: <Bolt />,
      path: '/bills/electricity',
      color: 'warning',
    },
    {
      title: 'Cable TV',
      description: 'Manage cable TV subscriptions',
      icon: <Tv />,
      path: '/bills/cable',
      color: 'secondary',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Bill Payments
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage all bill payment transactions
      </Typography>

      <Grid container spacing={3}>
        {billTypes.map((bill) => (
          <Grid item xs={12} sm={6} md={3} key={bill.path}>
            <Card>
              <CardActionArea onClick={() => router.push(bill.path)}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
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
                  <Typography variant="body2" color="text.secondary">
                    {bill.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}


