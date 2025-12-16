'use client';

import { Box, Typography, Button, Container } from '@mui/material';
import { Home, ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NotFound() {
  const router = useRouter();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 200px)',
          textAlign: 'center',
          py: 8,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '8rem', sm: '12rem' },
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6B46C1 0%, #8B5CF6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 2,
            lineHeight: 1,
          }}
        >
          404
        </Typography>

        <Typography
          variant="h4"
          fontWeight={600}
          gutterBottom
          sx={{ mb: 2 }}
        >
          Page Not Found
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: '500px' }}
        >
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Home />}
            component={Link}
            href="/dashboard"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
            }}
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowBack />}
            onClick={() => router.back()}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
            }}
          >
            Go Back
          </Button>
        </Box>

        <Box
          sx={{
            mt: 8,
            p: 4,
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            maxWidth: '400px',
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Quick Links
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
            <Button
              component={Link}
              href="/dashboard"
              variant="text"
              sx={{ justifyContent: 'flex-start' }}
            >
              Dashboard
            </Button>
            <Button
              component={Link}
              href="/users"
              variant="text"
              sx={{ justifyContent: 'flex-start' }}
            >
              Users
            </Button>
            <Button
              component={Link}
              href="/transactions"
              variant="text"
              sx={{ justifyContent: 'flex-start' }}
            >
              Transactions
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}




