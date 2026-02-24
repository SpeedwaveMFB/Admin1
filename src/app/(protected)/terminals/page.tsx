'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Box,
    Typography,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    Alert
} from '@mui/material';
import { terminalsApi, TerminalRequest } from '@/lib/api/terminals';
import dayjs from 'dayjs';

export default function TerminalsPage() {
    const queryClient = useQueryClient();
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<TerminalRequest | null>(null);
    const [serialNumber, setSerialNumber] = useState('');
    const [terminalLabel, setTerminalLabel] = useState('');
    const [assignError, setAssignError] = useState('');

    const { data: requests, isLoading, error } = useQuery({
        queryKey: ['terminalRequests'],
        queryFn: terminalsApi.getRequests,
    });

    const assignMutation = useMutation({
        mutationFn: (data: { requestId: number; serial: string; label: string }) =>
            terminalsApi.assignTerminal(data.requestId, data.serial, data.label),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['terminalRequests'] });
            handleCloseModal();
        },
        onError: (err: any) => {
            setAssignError(err.response?.data?.message || err.message || 'Failed to assign terminal');
        }
    });

    const handleOpenAssignModal = (request: TerminalRequest) => {
        setSelectedRequest(request);
        setSerialNumber('');
        setTerminalLabel(\`\${request.business_name} POS\`);
    setAssignError('');
    setAssignModalOpen(true);
  };

  const handleCloseModal = () => {
    setAssignModalOpen(false);
    setSelectedRequest(null);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !serialNumber) return;

    setAssignError('');
    assignMutation.mutate({
      requestId: selectedRequest.id,
      serial: serialNumber,
      label: terminalLabel,
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load terminal requests</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        POS Terminal Requests
      </Typography>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Business Info</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned Serial / Label</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests?.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>
                    {dayjs(req.created_at).format('MMM D, YYYY h:mm A')}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {req.first_name} {req.last_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {req.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {req.business_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {req.business_address}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {req.contact_phone}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={req.status.toUpperCase()}
                      color={
                        req.status === 'assigned'
                          ? 'success'
                          : req.status === 'rejected'
                          ? 'error'
                          : 'warning'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {req.terminal_serial_number ? (
                      <Typography variant="body2">
                        {req.terminal_serial_number}
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          ({req.terminal_label})
                        </Typography>
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        None
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {req.status === 'pending' && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleOpenAssignModal(req)}
                      >
                        Assign
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {requests?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    No terminal requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={assignModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <form onSubmit={handleAssignSubmit}>
          <DialogTitle>Assign Terminal</DialogTitle>
          <DialogContent>
            {assignError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {assignError}
              </Alert>
            )}
            <Typography variant="body2" sx={{ mb: 3 }}>
              Assigning POS Terminal to{' '}
              <strong>{selectedRequest?.business_name}</strong>
            </Typography>

            <TextField
              label="Terminal Serial Number"
              fullWidth
              required
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Terminal Label"
              fullWidth
              value={terminalLabel}
              onChange={(e) => setTerminalLabel(e.target.value)}
              helperText="A friendly name for this terminal in Nomba"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} disabled={assignMutation.isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!serialNumber || assignMutation.isPending}
            >
              {assignMutation.isPending ? 'Assigning...' : 'Assign Terminal'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
