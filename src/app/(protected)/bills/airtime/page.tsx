'use client';

import { Box, Typography, Paper, Alert } from '@mui/material';
import { Phone } from '@mui/icons-material';

export default function BillsAirtimePage() {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Phone />
        <Typography variant="h4" fontWeight={700}>
          Airtime Purchases
        </Typography>
      </Box>
      <Paper sx={{ p: 4 }}>
        <Alert severity="info">
          Airtime purchases management will be available once the backend endpoints are ready.
        </Alert>
        <Typography variant="body1" sx={{ mt: 2 }}>
          This page will display all airtime purchases with filters by telco, status, date range, and user.
        </Typography>
      </Paper>
    </Box>
  );
}

