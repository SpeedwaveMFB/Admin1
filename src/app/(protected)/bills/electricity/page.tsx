'use client';

import { Box, Typography, Paper, Alert } from '@mui/material';
import { Bolt } from '@mui/icons-material';

export default function BillsElectricityPage() {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Bolt />
        <Typography variant="h4" fontWeight={700}>
          Electricity Payments
        </Typography>
      </Box>
      <Paper sx={{ p: 4 }}>
        <Alert severity="info">
          Electricity payments management will be available once the backend endpoints are ready.
        </Alert>
        <Typography variant="body1" sx={{ mt: 2 }}>
          This page will display all electricity payments with filters by provider, status, date range, and user.
        </Typography>
      </Paper>
    </Box>
  );
}

