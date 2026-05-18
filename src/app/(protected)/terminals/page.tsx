'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { terminalsApi, TerminalRequest } from '@/lib/api/terminals';
import dayjs from 'dayjs';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { adminTableClassNames } from '@/lib/heroui-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function TerminalsPage() {
  const queryClient = useQueryClient();
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TerminalRequest | null>(null);
  const [serialNumber, setSerialNumber] = useState('');
  const [paylonyTerminalId, setPaylonyTerminalId] = useState('');
  const [deviceName, setDeviceName] = useState('MP35P');
  const [terminalLabel, setTerminalLabel] = useState('');
  const [assignError, setAssignError] = useState('');

  const [rejectError, setRejectError] = useState('');
  const [unmapModalOpen, setUnmapModalOpen] = useState(false);
  const [selectedUnmapRequest, setSelectedUnmapRequest] = useState<TerminalRequest | null>(null);
  const [unmapError, setUnmapError] = useState('');

  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['terminalRequests'],
    queryFn: terminalsApi.getRequests,
  });

  const { data: assignedTerminals, isLoading: assignedLoading, error: assignedError } = useQuery({
    queryKey: ['terminalAssigned'],
    queryFn: terminalsApi.getAssignedTerminals,
  });

  const assignMutation = useMutation({
    mutationFn: (data: {
      requestId: number;
      serial: string;
      paylonyTid: string;
      label: string;
      deviceModel: string;
    }) =>
      terminalsApi.assignTerminal(data.requestId, data.serial, data.paylonyTid, {
        terminalLabel: data.label,
        deviceName: data.deviceModel.trim() || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terminalRequests'] });
      queryClient.invalidateQueries({ queryKey: ['terminalAssigned'] });
      handleCloseModal();
    },
    onError: (err: any) => {
      setAssignError(err.response?.data?.message || err.message || 'Failed to assign terminal');
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (requestId: number) => terminalsApi.rejectRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terminalRequests'] });
      setRejectError('');
    },
    onError: (err: any) => {
      setRejectError(err.response?.data?.message || err.message || 'Failed to cancel request');
    },
  });

  const unmapMutation = useMutation({
    mutationFn: (data: { requestId: number; terminalSerialNumber: string; terminalLabel: string }) =>
      terminalsApi.unmapTerminal(data.requestId, data.terminalSerialNumber, data.terminalLabel),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terminalRequests'] });
      queryClient.invalidateQueries({ queryKey: ['terminalAssigned'] });
      setUnmapModalOpen(false);
      setSelectedUnmapRequest(null);
      setUnmapError('');
    },
    onError: (err: any) => {
      setUnmapError(err.response?.data?.message || err.message || 'Failed to unmap terminal');
    },
  });

  const handleOpenAssignModal = (request: TerminalRequest) => {
    setSelectedRequest(request);
    setSerialNumber('');
    setPaylonyTerminalId('');
    setDeviceName('MP35P');
    setTerminalLabel(`${request.business_name} POS`);
    setAssignError('');
    setAssignModalOpen(true);
  };

  const handleCloseModal = () => {
    setAssignModalOpen(false);
    setSelectedRequest(null);
  };

  const pendingRequests = requests?.filter((r) => r.status !== 'assigned') ?? [];

  const handleOpenUnmapModal = (request: TerminalRequest) => {
    setSelectedUnmapRequest(request);
    setUnmapError('');
    setUnmapModalOpen(true);
  };

  const handleCloseUnmapModal = () => {
    setUnmapModalOpen(false);
    setSelectedUnmapRequest(null);
    setUnmapError('');
  };

  const isValidPaylonyTid = (tid: string) => tid.trim().length > 0;

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !serialNumber) return;

    const tid = paylonyTerminalId.trim();
    if (!isValidPaylonyTid(tid)) {
      setAssignError('Paylony TID is required');
      return;
    }

    setAssignError('');
    assignMutation.mutate({
      requestId: selectedRequest.id,
      serial: serialNumber.trim(),
      paylonyTid: tid,
      label: terminalLabel,
      deviceModel: deviceName,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center mt-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <Alert variant="destructive">
          <AlertDescription>Failed to load terminal requests</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">
          POS Terminal Requests
        </h1>
        <p className="text-sm text-slate-500">
          Manage and assign point-of-sale terminals
        </p>
      </div>

      <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden">
        <CardContent className="p-0 min-w-0">
          <Table
            aria-label="Pending terminal requests"
            radius="lg"
            shadow="none"
            isCompact
            classNames={adminTableClassNames}
          >
            <TableHeader>
              <TableColumn>Date</TableColumn>
              <TableColumn>User</TableColumn>
              <TableColumn>Business Info</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Assigned Serial / Label</TableColumn>
              <TableColumn>Paylony TID</TableColumn>
              <TableColumn>Device</TableColumn>
              <TableColumn align="end">Actions</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={
                <span className="text-default-500 text-sm">No terminal requests found.</span>
              }
              isLoading={isLoading}
            >
              {pendingRequests.map((req) => (
                <TableRow key={req.id} className="hover:bg-default-50">
                  <TableCell className="py-4 text-sm text-slate-600">
                    {dayjs(req.created_at).format('MMM D, YYYY h:mm A')}
                  </TableCell>
                  <TableCell className="py-4">
                    <p className="font-semibold text-slate-900 text-sm">
                      {req.first_name} {req.last_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {req.email}
                    </p>
                  </TableCell>
                  <TableCell className="py-4">
                    <p className="font-semibold text-slate-900 text-sm">
                      {req.business_name}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-2 break-words">
                      {req.business_address}
                    </p>
                    <p className="text-xs text-slate-500">
                      {req.contact_phone}
                    </p>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      variant={
                        req.status === 'assigned'
                          ? 'default'
                          : req.status === 'rejected'
                            ? 'destructive'
                            : 'secondary'
                      }
                      className={
                        req.status === 'assigned'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none'
                          : req.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-none'
                            : ''
                      }
                    >
                      {req.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    {req.terminal_serial_number ? (
                      <div className="text-sm">
                        <span className="text-slate-900 font-medium">{req.terminal_serial_number}</span>
                        <br />
                        <span className="text-xs text-slate-500">
                          ({req.terminal_label})
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">
                        None
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-4 text-sm text-slate-600">
                    {req.paylony_terminal_id ?? '—'}
                  </TableCell>
                  <TableCell className="py-4 text-sm text-slate-600">
                    {req.device_name ?? '—'}
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    {req.status === 'pending' && (
                      <div className="flex flex-wrap justify-end gap-1.5">
                        <Button size="sm" onClick={() => handleOpenAssignModal(req)}>
                          Assign
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectMutation.mutate(req.id)}
                          disabled={rejectMutation.isPending}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {rejectError && (
        <Alert variant="destructive">
          <AlertDescription>{rejectError}</AlertDescription>
        </Alert>
      )}

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">
          Assigned POS Terminals
        </h1>
        <p className="text-sm text-slate-500 mb-4">
          Unmap an assigned terminal back to pending (clears serial/label)
        </p>
      </div>

      <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden">
        <CardContent className="p-0 min-w-0">
          <Table
            aria-label="Assigned POS terminals"
            radius="lg"
            shadow="none"
            isCompact
            classNames={adminTableClassNames}
          >
            <TableHeader>
              <TableColumn>Date</TableColumn>
              <TableColumn>User</TableColumn>
              <TableColumn>Business Info</TableColumn>
              <TableColumn>Assigned Serial / Label</TableColumn>
              <TableColumn>Paylony TID</TableColumn>
              <TableColumn>Device</TableColumn>
              <TableColumn align="end">Actions</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={
                <span className="text-default-500 text-sm">No assigned terminals found.</span>
              }
              isLoading={assignedLoading}
              loadingContent={
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              }
            >
              {(assignedError ? [] : assignedTerminals ?? []).map((term) => (
                  <TableRow key={term.id} className="hover:bg-default-50">
                    <TableCell className="py-4 text-sm text-slate-600">
                      {dayjs(term.created_at).format('MMM D, YYYY h:mm A')}
                    </TableCell>
                    <TableCell className="py-4">
                      <p className="font-semibold text-slate-900 text-sm">
                        {term.first_name} {term.last_name}
                      </p>
                      <p className="text-xs text-slate-500">{term.email}</p>
                    </TableCell>
                    <TableCell className="py-4">
                      <p className="font-semibold text-slate-900 text-sm">{term.business_name}</p>
                      <p className="text-xs text-slate-500 line-clamp-2 break-words">{term.business_address}</p>
                      <p className="text-xs text-slate-500">{term.contact_phone}</p>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm">
                        <span className="text-slate-900 font-medium">{term.terminal_serial_number}</span>
                        <br />
                        <span className="text-xs text-slate-500">({term.terminal_label})</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-sm text-slate-600">
                      {term.paylony_terminal_id ?? '—'}
                    </TableCell>
                    <TableCell className="py-4 text-sm text-slate-600">
                      {term.device_name ?? '—'}
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-amber-600 text-amber-700 hover:bg-amber-50"
                        onClick={() => handleOpenUnmapModal(term)}
                      >
                        Unmap
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {assignedError && (
            <div className="p-4">
              <Alert variant="destructive">
                <AlertDescription>Failed to load assigned terminals</AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={unmapModalOpen} onOpenChange={(open) => !open && handleCloseUnmapModal()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Unmap Terminal</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {unmapError && (
              <Alert variant="destructive">
                <AlertDescription>{unmapError}</AlertDescription>
              </Alert>
            )}
            <p className="text-sm text-slate-600">
              This will unmap terminal{' '}
              <strong className="text-slate-900">{selectedUnmapRequest?.terminal_serial_number}</strong> and clear
              its Paylony mapping, returning the request to <strong className="text-slate-900">pending</strong>.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseUnmapModal} disabled={unmapMutation.isPending}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (!selectedUnmapRequest) return;
                const sn = selectedUnmapRequest.terminal_serial_number;
                const label = selectedUnmapRequest.terminal_label;
                if (!sn || !label) {
                  setUnmapError('terminal_serial_number and terminal_label are required');
                  return;
                }
                unmapMutation.mutate({
                  requestId: selectedUnmapRequest.id,
                  terminalSerialNumber: sn,
                  terminalLabel: label,
                });
              }}
              disabled={unmapMutation.isPending}
            >
              {unmapMutation.isPending ? 'Unmapping...' : 'Unmap'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleAssignSubmit}>
            <DialogHeader>
              <DialogTitle>Assign Terminal</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {assignError && (
                <Alert variant="destructive">
                  <AlertDescription>{assignError}</AlertDescription>
                </Alert>
              )}
              <p className="text-sm text-slate-600 mb-2">
                Assigning POS Terminal to{' '}
                <strong className="text-slate-900">{selectedRequest?.business_name}</strong>
              </p>

              <div className="space-y-2">
                <Label htmlFor="serialNumber">Terminal Serial Number *</Label>
                <Input
                  id="serialNumber"
                  required
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paylonyTerminalId">Paylony TID *</Label>
                <Input
                  id="paylonyTerminalId"
                  required
                  value={paylonyTerminalId}
                  onChange={(e) => setPaylonyTerminalId(e.target.value)}
                  placeholder="Paylony terminal ID"
                />
                <p className="text-xs text-slate-500">
                  Required — must match the ID used for Paylony POS push payments
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deviceName">Device model</Label>
                <Input
                  id="deviceName"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  placeholder="MP35P"
                />
                <p className="text-xs text-slate-500">
                  Paylony device name (omit to use MP35P on the server)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="terminalLabel">Terminal Label</Label>
                <Input
                  id="terminalLabel"
                  value={terminalLabel}
                  onChange={(e) => setTerminalLabel(e.target.value)}
                  placeholder="e.g. Speedwave POS 1"
                />
                <p className="text-xs text-slate-500">
                  A friendly name for this terminal in Paylony
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal} disabled={assignMutation.isPending}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!serialNumber.trim() || !paylonyTerminalId.trim() || assignMutation.isPending}
              >
                {assignMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  'Assign Terminal'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
