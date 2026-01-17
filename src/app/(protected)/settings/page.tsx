'use client';

import { Box, Typography, Paper, Alert, Grid, Card, CardContent, Divider } from '@mui/material';
import { Settings, Security, IntegrationInstructions, AdminPanelSettings } from '@mui/icons-material';

export default function SettingsPage() {
  const settingsCategories = [
    {
      title: 'General Settings',
      description: 'Platform configuration and branding',
      icon: <Settings />,
      color: 'primary',
    },
    {
      title: 'Security Settings',
      description: 'Admin management and permissions',
      icon: <Security />,
      color: 'error',
    },
    {
      title: 'Integration Settings',
      description: 'API keys and webhook configuration',
      icon: <IntegrationInstructions />,
      color: 'info',
    },
    {
      title: 'Admin Management',
      description: 'Manage admin users and roles',
      icon: <AdminPanelSettings />,
      color: 'secondary',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        System Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure platform settings and integrations
      </Typography>

      <Paper sx={{ p: 4, mb: 3 }}>
        <Alert severity="info">
          Settings management will be available once the backend endpoints are ready.
        </Alert>
      </Paper>

      <Grid container spacing={3}>
        {settingsCategories.map((category) => (
          <Grid item xs={12} sm={6} md={3} key={category.title}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: 2,
                    bgcolor: `${category.color}.main`,
                    color: 'white',
                    mb: 2,
                  }}
                >
                  {category.icon}
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {category.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {category.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}






