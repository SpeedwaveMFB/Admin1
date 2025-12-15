'use client';

import { Box, Typography, Paper, Alert } from '@mui/material';
import { Tv } from '@mui/icons-material';

export default function BillsCablePage() {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Tv />
        <Typography variant="h4" fontWeight={700}>
          Cable TV Subscriptions
        </Typography>
      </Box>
      <Paper sx={{ p: 4 }}>
        <Alert severity="info">
          Cable TV subscriptions management will be available once the backend endpoints are ready.
        </Alert>
        <Typography variant="body1" sx={{ mt: 2 }}>
          This page will display all cable TV subscriptions with filters by provider, status, date range, and user.
        </Typography>
      </Paper>
    </Box>
  );
}


