'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useTransaction } from '@/lib/hooks/useTransactions';
import { formatCurrency } from '@/lib/utils/format';
import { formatDateTime } from '@/lib/utils/date';
import StatusBadge from '@/components/shared/StatusBadge';

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const transactionId = params.id as string;

  const { data, isLoading, error } = useTransaction(transactionId);
  const transaction = data?.data;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !transaction) {
    return (
      <Box>
        <Alert severity="error">Failed to load transaction details. Please try again.</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => router.push('/transactions')} sx={{ mt: 2 }}>
          Back to Transactions
        </Button>
      </Box>
    );
  }

  const renderField = (label: string, value: any) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={600}>
        {value || 'N/A'}
      </Typography>
    </Box>
  );

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => router.push('/transactions')} sx={{ mb: 3 }}>
        Back to Transactions
      </Button>

      <Typography variant="h4" fontWeight={700} gutterBottom>
        Transaction Details
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Transaction Information
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {renderField('Transaction ID', transaction.id)}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField('Reference', transaction.reference)}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField('Type', transaction.type.replace('_', ' ').toUpperCase())}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <StatusBadge status={transaction.status} />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField('Amount', formatCurrency(transaction.amount))}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField('Provider', transaction.provider || 'N/A')}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField('Date', formatDateTime(transaction.createdAt))}
              </Grid>
              <Grid item xs={12}>
                {renderField('Description', transaction.description)}
              </Grid>
            </Grid>

            {/* Bank Transfer Details */}
            {transaction.type === 'bank_transfer' && (
              <>
                <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 2 }}>
                  Bank Transfer Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    {renderField('Recipient Account Number', transaction.recipientAccountNumber)}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {renderField('Recipient Account Name', transaction.recipientAccountName)}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {renderField('Bank Name', transaction.recipientBankName)}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {renderField('Transfer Fee', transaction.transferFee ? formatCurrency(transaction.transferFee) : 'N/A')}
                  </Grid>
                </Grid>
              </>
            )}

            {/* Bill Payment Details */}
            {['airtime', 'data', 'electricity', 'cable_tv'].includes(transaction.type) && (
              <>
                <Typography variant="h6" fontWeight={600} sx={{ mt: 3, mb: 2 }}>
                  Bill Payment Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  {transaction.phoneNumber && (
                    <Grid item xs={12} sm={6}>
                      {renderField('Phone Number', transaction.phoneNumber)}
                    </Grid>
                  )}
                  {transaction.meterNumber && (
                    <Grid item xs={12} sm={6}>
                      {renderField('Meter Number', transaction.meterNumber)}
                    </Grid>
                  )}
                  {transaction.smartcardNumber && (
                    <Grid item xs={12} sm={6}>
                      {renderField('Smartcard Number', transaction.smartcardNumber)}
                    </Grid>
                  )}
                  {transaction.customerName && (
                    <Grid item xs={12} sm={6}>
                      {renderField('Customer Name', transaction.customerName)}
                    </Grid>
                  )}
                  {transaction.planName && (
                    <Grid item xs={12} sm={6}>
                      {renderField('Plan Name', transaction.planName)}
                    </Grid>
                  )}
                  {transaction.serviceProvider && (
                    <Grid item xs={12} sm={6}>
                      {renderField('Service Provider', transaction.serviceProvider)}
                    </Grid>
                  )}
                </Grid>
              </>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                User Information
              </Typography>
              <Typography variant="h6" fontWeight={600} sx={{ mt: 1 }}>
                {transaction.userName || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {transaction.userEmail || 'N/A'}
              </Typography>
              {transaction.userId && (
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => router.push(`/users/${transaction.userId}`)}
                >
                  View User Profile
                </Button>
              )}
            </CardContent>
          </Card>

          {transaction.providerReference && (
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Provider Reference
                </Typography>
                <Typography variant="body1" fontWeight={600} sx={{ mt: 1, wordBreak: 'break-all' }}>
                  {transaction.providerReference}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}






