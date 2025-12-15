'use client';

import { Box, Typography, Paper, Alert } from '@mui/material';
import { Verified } from '@mui/icons-material';

export default function KYCPage() {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Verified />
        <Typography variant="h4" fontWeight={700}>
          KYC Verification
        </Typography>
      </Box>
      <Paper sx={{ p: 4 }}>
        <Alert severity="info">
          KYC verification management will be available once the backend endpoints are ready.
        </Alert>
        <Typography variant="body1" sx={{ mt: 2 }}>
          This page will allow you to:
        </Typography>
        <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
          <li>View pending KYC verifications</li>
          <li>Approve or reject verifications</li>
          <li>View uploaded documents</li>
          <li>Request additional documents</li>
        </ul>
      </Paper>
    </Box>
  );
}


