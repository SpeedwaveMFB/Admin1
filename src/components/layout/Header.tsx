'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { LogOut, User as UserIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Header() {
  const router = useRouter();
  const { admin, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  const getInitials = () => {
    if (admin?.firstName && admin?.lastName) {
      return `${admin.firstName[0]}${admin.lastName[0]}`.toUpperCase();
    }
    return admin?.email?.[0]?.toUpperCase() || 'A';
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight md:hidden">
            Speedwave admin
          </h2>
          {/* Add a breadcrumb or page title here in the future if desired */}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-900">
              {admin?.firstName && admin?.lastName
                ? `${admin.firstName} ${admin.lastName}`
                : admin?.email}
            </span>
            <Badge variant="secondary" className="h-5 text-[10px] px-1.5 py-0">
              {admin?.role || 'Admin'}
            </Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border border-slate-200">
                  <AvatarFallback className="bg-purple-600 text-white font-medium">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none">
                  {admin?.firstName && admin?.lastName
                    ? `${admin.firstName} ${admin.lastName}`
                    : 'Admin'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {admin?.email}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
