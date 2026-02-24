'use client';

import { Settings, ShieldCheck, Cable, UserCog } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SettingsPage() {
  const settingsCategories = [
    {
      title: 'General Settings',
      description: 'Platform configuration and branding',
      icon: <Settings className="w-6 h-6" />,
      colorClass: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Security Settings',
      description: 'Admin management and permissions',
      icon: <ShieldCheck className="w-6 h-6" />,
      colorClass: 'bg-red-50 text-red-600',
    },
    {
      title: 'Integration Settings',
      description: 'API keys and webhook configuration',
      icon: <Cable className="w-6 h-6" />,
      colorClass: 'bg-sky-50 text-sky-600',
    },
    {
      title: 'Admin Management',
      description: 'Manage admin users and roles',
      icon: <UserCog className="w-6 h-6" />,
      colorClass: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
          System Settings
        </h1>
        <p className="text-slate-500 text-sm">
          Configure platform settings and integrations
        </p>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardContent className="pt-6">
          <Alert className="bg-blue-50 text-blue-700 border-blue-200 mb-0">
            <AlertDescription>
              Settings management will be available once the backend endpoints are ready.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {settingsCategories.map((category) => (
          <Card key={category.title} className="shadow-sm border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6 text-center">
              <div className={`inline-flex p-3 rounded-xl mb-4 ${category.colorClass}`}>
                {category.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                {category.title}
              </h3>
              <p className="text-sm text-slate-500">
                {category.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
