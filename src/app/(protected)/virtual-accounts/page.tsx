'use client';

import { Box, Typography, Paper, Alert } from '@mui/material';
import { AccountBalance } from '@mui/icons-material';

export default function VirtualAccountsPage() {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <AccountBalance />
        <Typography variant="h4" fontWeight={700}>
          Virtual Accounts
        </Typography>
      </Box>
      <Paper sx={{ p: 4 }}>
        <Alert severity="info">
          Virtual accounts management will be available once the backend endpoints are ready.
        </Alert>
        <Typography variant="body1" sx={{ mt: 2 }}>
          This page will display all Nomba virtual accounts with details, status, and transaction history.
        </Typography>
      </Paper>
    </Box>
  );
}




