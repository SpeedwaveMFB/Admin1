'use client';

import { History } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
          <History className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Audit Logs
        </h1>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardContent className="pt-6">
          <Alert className="bg-purple-50 text-purple-700 border-purple-200 mb-6">
            <AlertDescription>
              Audit logs will be available once the backend endpoints are ready.
            </AlertDescription>
          </Alert>
          <div className="space-y-4">
            <p className="text-slate-700 font-medium">
              This page will display all admin activity logs including:
            </p>
            <ul className="list-disc pl-6 text-sm text-slate-600 space-y-2 marker:text-slate-400">
              <li>User actions (suspensions, verifications, balance adjustments)</li>
              <li>System events</li>
              <li>Admin activity history</li>
              <li>Searchable and filterable logs</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
