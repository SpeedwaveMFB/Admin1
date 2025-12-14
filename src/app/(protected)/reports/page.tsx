'use client';

import { Box, Typography, Paper, Alert, Grid, Card, CardContent } from '@mui/material';
import { Assessment, Description, Receipt, People } from '@mui/icons-material';

export default function ReportsPage() {
  const reportTypes = [
    {
      title: 'Financial Reports',
      description: 'Transaction and revenue reports',
      icon: <Receipt />,
      color: 'primary',
    },
    {
      title: 'User Reports',
      description: 'User activity and registration reports',
      icon: <People />,
      color: 'secondary',
    },
    {
      title: 'Transaction Reports',
      description: 'Detailed transaction analytics',
      icon: <Description />,
      color: 'info',
    },
    {
      title: 'Bill Payment Reports',
      description: 'Bill payment analytics and statistics',
      icon: <Assessment />,
      color: 'success',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Reports & Analytics
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Generate and export comprehensive reports
      </Typography>

      <Paper sx={{ p: 4, mb: 3 }}>
        <Alert severity="info">
          Report generation will be available once the backend endpoints are ready.
        </Alert>
      </Paper>

      <Grid container spacing={3}>
        {reportTypes.map((report) => (
          <Grid item xs={12} sm={6} md={3} key={report.title}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: 2,
                    bgcolor: `${report.color}.main`,
                    color: 'white',
                    mb: 2,
                  }}
                >
                  {report.icon}
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {report.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {report.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

