'use client';

import { Box, Typography, Paper, Alert } from '@mui/material';
import { History } from '@mui/icons-material';

export default function AuditLogsPage() {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <History />
        <Typography variant="h4" fontWeight={700}>
          Audit Logs
        </Typography>
      </Box>
      <Paper sx={{ p: 4 }}>
        <Alert severity="info">
          Audit logs will be available once the backend endpoints are ready.
        </Alert>
        <Typography variant="body1" sx={{ mt: 2 }}>
          This page will display all admin activity logs including:
        </Typography>
        <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
          <li>User actions (suspensions, verifications, balance adjustments)</li>
          <li>System events</li>
          <li>Admin activity history</li>
          <li>Searchable and filterable logs</li>
        </ul>
      </Paper>
    </Box>
  );
}


