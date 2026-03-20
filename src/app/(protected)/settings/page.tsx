'use client';

import { Settings, ShieldCheck, Cable, UserCog } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const settingsCategories = [
    {
      title: 'General Settings',
      description: 'Platform configuration and branding',
      icon: <Settings className="w-6 h-6" />,
      colorClass: 'bg-purple-50 text-purple-600',
      path: '/settings/general',
    },
    {
      title: 'Fee Management',
      description: 'Configure dynamic transaction fees',
      icon: <Cable className="w-6 h-6" />,
      colorClass: 'bg-emerald-50 text-emerald-600',
      path: '/settings/fees',
    },
    {
      title: 'Security Settings',
      description: 'Admin management and permissions',
      icon: <ShieldCheck className="w-6 h-6" />,
      colorClass: 'bg-red-50 text-red-600',
      path: '/settings/security',
    },
    {
      title: 'Admin Management',
      description: 'Manage admin users and roles',
      icon: <UserCog className="w-6 h-6" />,
      colorClass: 'bg-purple-50 text-purple-600',
      path: '/settings/admins',
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {settingsCategories.map((category) => (
          <Card 
            key={category.title} 
            className="shadow-sm border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push(category.path)}
          >
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
