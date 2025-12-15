'use client';

import { Box, Typography, Paper, Alert } from '@mui/material';
import { Groups } from '@mui/icons-material';

export default function BeneficiariesPage() {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Groups />
        <Typography variant="h4" fontWeight={700}>
          Beneficiaries
        </Typography>
      </Box>
      <Paper sx={{ p: 4 }}>
        <Alert severity="info">
          Beneficiaries management will be available once the backend endpoints are ready.
        </Alert>
        <Typography variant="body1" sx={{ mt: 2 }}>
          This page will display all beneficiaries across users with statistics and filtering options.
        </Typography>
      </Paper>
    </Box>
  );
}


