'use client';

import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  DashboardSquare01Icon,
  UserGroupIcon,
  Invoice01Icon,
  SmartPhone01Icon,
  Wifi01Icon,
  FlashIcon,
  Tv01Icon,
  SecurityCheckIcon,
  BankIcon,
  UserMultiple02Icon,
  Analytics01Icon,
  File02Icon,
  Settings02Icon,
  Store01Icon
} from 'hugeicons-react';

const DRAWER_WIDTH = 260;

const menuItems = [
  { title: 'Dashboard', path: '/dashboard', icon: <DashboardSquare01Icon size={20} /> },
  { title: 'Users', path: '/users', icon: <UserGroupIcon size={20} /> },
  { title: 'Transactions', path: '/transactions', icon: <Invoice01Icon size={20} /> },
  {
    title: 'Bill Payments',
    path: '/bills',
    icon: <SmartPhone01Icon size={20} />,
    subItems: [
      { title: 'Airtime', path: '/bills/airtime', icon: <SmartPhone01Icon size={18} /> },
      { title: 'Data', path: '/bills/data', icon: <Wifi01Icon size={18} /> },
      { title: 'Electricity', path: '/bills/electricity', icon: <FlashIcon size={18} /> },
      { title: 'Cable TV', path: '/bills/cable', icon: <Tv01Icon size={18} /> },
    ],
  },
  { title: 'KYC Verification', path: '/kyc', icon: <SecurityCheckIcon size={20} /> },
  { title: 'Virtual Accounts', path: '/virtual-accounts', icon: <BankIcon size={20} /> },
  { title: 'POS Terminals', path: '/terminals', icon: <Store01Icon size={20} /> },
  { title: 'Beneficiaries', path: '/beneficiaries', icon: <UserMultiple02Icon size={20} /> },
  { title: 'Reports', path: '/reports', icon: <Analytics01Icon size={20} /> },
  { title: 'Audit Logs', path: '/audit-logs', icon: <File02Icon size={20} /> },
  { title: 'Settings', path: '/settings', icon: <Settings02Icon size={20} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <aside
      className="hidden md:flex flex-col flex-shrink-0 bg-white border-r border-slate-200 h-screen sticky top-0"
      style={{ width: DRAWER_WIDTH }}
    >
      <div className="flex items-center min-h-[80px] px-6">
        <h1 className="text-xl font-extrabold text-blue-600 tracking-tight">
          Speedwave
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <div key={item.path} className="mb-1">
              <button
                onClick={() => router.push(item.path)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                <div className={cn('flex-shrink-0', active ? 'text-white' : 'text-slate-400')}>
                  {item.icon}
                </div>
                {item.title}
              </button>

              {item.subItems && active && (
                <div className="mt-1 pl-10 pr-2 space-y-1">
                  {item.subItems.map((subItem) => {
                    const subActive = pathname === subItem.path;
                    return (
                      <button
                        key={subItem.path}
                        onClick={() => router.push(subItem.path)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                          subActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        )}
                      >
                        <div className={cn('flex-shrink-0', subActive ? 'text-blue-600' : 'text-slate-400')}>
                          {subItem.icon}
                        </div>
                        {subItem.title}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}






