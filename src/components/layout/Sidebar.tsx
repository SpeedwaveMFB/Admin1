'use client';

import Image from 'next/image';
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
  Store01Icon,
} from 'hugeicons-react';
import { useAuthStore } from '@/lib/store/authStore';

const menuItems = [
  { title: 'Dashboard', path: '/dashboard', icon: DashboardSquare01Icon, roles: ['admin', 'customer_service'] },
  { title: 'Users', path: '/users', icon: UserGroupIcon, roles: ['admin', 'customer_service'] },
  { title: 'Transactions', path: '/transactions', icon: Invoice01Icon, roles: ['admin', 'customer_service'] },
  {
    title: 'Bill Payments',
    path: '/bills',
    icon: SmartPhone01Icon,
    roles: ['admin', 'customer_service'],
    subItems: [
      { title: 'Airtime', path: '/bills/airtime', icon: SmartPhone01Icon },
      { title: 'Data', path: '/bills/data', icon: Wifi01Icon },
      { title: 'Electricity', path: '/bills/electricity', icon: FlashIcon },
      { title: 'Cable TV', path: '/bills/cable', icon: Tv01Icon },
    ],
  },
  { title: 'KYC Verification', path: '/kyc', icon: SecurityCheckIcon, roles: ['admin', 'customer_service'] },
  { title: 'Virtual Accounts', path: '/virtual-accounts', icon: BankIcon, roles: ['admin'] },
  { title: 'POS Terminals', path: '/terminals', icon: Store01Icon, roles: ['admin'] },
  { title: 'Beneficiaries', path: '/beneficiaries', icon: UserMultiple02Icon, roles: ['admin'] },
  { title: 'Reports', path: '/reports', icon: Analytics01Icon, roles: ['admin'] },
  { title: 'Audit Logs', path: '/audit-logs', icon: File02Icon, roles: ['admin'] },
  { title: 'Settings', path: '/settings', icon: Settings02Icon, roles: ['admin'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { admin } = useAuthStore();
  const userRole = admin?.role || 'customer_service';

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(userRole));

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const initials =
    admin?.firstName && admin?.lastName
      ? `${admin.firstName[0]}${admin.lastName[0]}`.toUpperCase()
      : admin?.email?.[0]?.toUpperCase() || 'A';

  return (
    <aside
      className={cn(
        'group/sidebar hidden md:flex flex-col fixed z-50',
        'left-4 top-4 bottom-4',
        'w-[4.25rem] hover:w-[15.5rem]',
        'transition-[width] duration-300 ease-out',
        'rounded-2xl border border-white/60',
        'bg-white/90 backdrop-blur-xl',
        'shadow-[0_8px_40px_-12px_rgba(15,23,42,0.25),0_0_0_1px_rgba(148,163,184,0.12)]',
        'overflow-hidden'
      )}
    >
      {/* Brand */}
      <div className="flex items-center h-[4.5rem] flex-shrink-0 px-3 border-b border-slate-100/80 gap-0 group-hover/sidebar:gap-3 justify-center group-hover/sidebar:justify-start">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 shadow-lg shadow-purple-500/30">
          <Image
            src="/logo.png"
            alt="Speedwave"
            width={28}
            height={28}
            className="h-6 w-6 object-contain brightness-0 invert"
            priority
          />
        </div>
        <div className="min-w-0 overflow-hidden max-w-0 opacity-0 group-hover/sidebar:max-w-[10rem] group-hover/sidebar:opacity-100 transition-all duration-300 delay-75">
          <Image
            src="/logo.png"
            alt="Speedwave"
            width={140}
            height={36}
            className="h-8 w-auto object-contain object-left"
            priority
          />
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mt-0.5 truncate">
            Admin Portal
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-200/80 scrollbar-track-transparent">
        {filteredMenuItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <div key={item.path} className="mb-0.5">
              <button
                type="button"
                onClick={() => router.push(item.path)}
                title={item.title}
                className={cn(
                  'w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200',
                  'py-2.5 px-2.5 justify-center group-hover/sidebar:justify-start group-hover/sidebar:px-3',
                  active
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-500/25'
                    : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900'
                )}
              >
                <Icon
                  size={20}
                  className={cn('flex-shrink-0', active ? 'text-white' : 'text-slate-400')}
                  strokeWidth={active ? 2 : 1.5}
                />
                <span
                  className={cn(
                    'truncate whitespace-nowrap',
                    'max-w-0 opacity-0 group-hover/sidebar:max-w-[11rem] group-hover/sidebar:opacity-100',
                    'transition-all duration-300 delay-75'
                  )}
                >
                  {item.title}
                </span>
              </button>

              {item.subItems && active && (
                <div
                  className={cn(
                    'mt-1 space-y-0.5 overflow-hidden',
                    'max-h-0 opacity-0 group-hover/sidebar:max-h-48 group-hover/sidebar:opacity-100',
                    'transition-all duration-300 pl-0 group-hover/sidebar:pl-3'
                  )}
                >
                  {item.subItems.map((subItem) => {
                    const subActive = pathname === subItem.path;
                    const SubIcon = subItem.icon;
                    return (
                      <button
                        key={subItem.path}
                        type="button"
                        onClick={() => router.push(subItem.path)}
                        className={cn(
                          'w-full flex items-center gap-2.5 rounded-lg py-2 text-sm font-medium transition-colors',
                          'justify-center group-hover/sidebar:justify-start px-2 group-hover/sidebar:px-3',
                          subActive
                            ? 'bg-purple-50 text-purple-700'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        )}
                      >
                        <SubIcon
                          size={16}
                          className={cn('flex-shrink-0', subActive ? 'text-purple-600' : 'text-slate-400')}
                        />
                        <span
                          className={cn(
                            'whitespace-nowrap max-w-0 opacity-0',
                            'group-hover/sidebar:max-w-[10rem] group-hover/sidebar:opacity-100',
                            'transition-all duration-300'
                          )}
                        >
                          {subItem.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-slate-100/80 p-2">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50/80 p-2 justify-center group-hover/sidebar:justify-start">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 text-xs font-bold text-white">
            {initials}
          </div>
          <div
            className={cn(
              'min-w-0 overflow-hidden',
              'max-w-0 opacity-0 group-hover/sidebar:max-w-[10rem] group-hover/sidebar:opacity-100',
              'transition-all duration-300 delay-75'
            )}
          >
            <p className="text-sm font-semibold text-slate-800 truncate">
              {admin?.firstName && admin?.lastName
                ? `${admin.firstName} ${admin.lastName}`
                : 'Admin'}
            </p>
            <p className="text-xs text-slate-500 truncate capitalize">{userRole.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
