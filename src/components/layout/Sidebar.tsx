'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  DashboardSquare01Icon,
  UserGroupIcon,
  Invoice01Icon,
  SmartPhone01Icon,
  Wifi01Icon,
  FlashIcon,
  Tv01Icon,
  SecurityCheckIcon, // Corrected from ShieldCheckIcon
  BankIcon,
  UserMultiple02Icon, // Assuming UserMultipleIcon was wrong or check if UserMultiple exists. UserGroup is usually enough. Let's use UserGroupIcon if UserMultiple fails. Actually let's use UserGroupIcon for both if needed or stick to what worked. 
  // Wait, the error didn't mention UserMultipleIcon. It mentioned ShieldCheckIcon and FileDoctumentIcon.
  // I will just fix those two.
  Analytics01Icon,
  File02Icon, // Corrected from FileDoctumentIcon
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
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: 'none', // Removed border for cleaner look
          backgroundColor: '#ffffff', // White background
          boxShadow: '4px 0 24px rgba(0,0,0,0.02)', // Very subtle shadow
        },
      }}
    >
      <Toolbar sx={{ minHeight: '80px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
          <Typography variant="h5" component="div" color="primary" fontWeight={800} letterSpacing="-0.5px">
            Speedwave
          </Typography>
        </Box>
      </Toolbar>

      <List sx={{ px: 2, pt: 2 }}>
        {menuItems.map((item) => (
          <Box key={item.path} sx={{ mb: 1 }}>
            <ListItem disablePadding>
              <ListItemButton
                selected={isActive(item.path)}
                onClick={() => router.push(item.path)}
                sx={{
                  borderRadius: '12px', // More rounded
                  mb: 0.5,
                  py: 1.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(107, 70, 193, 0.2)', // Soft shadow on active
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.03)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 44, color: isActive(item.path) ? 'inherit' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isActive(item.path) ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
            {item.subItems && isActive(item.path) && (
              <List sx={{ pl: 2, mt: 0.5 }}>
                {item.subItems.map((subItem) => (
                  <ListItem key={subItem.path} disablePadding>
                    <ListItemButton
                      selected={pathname === subItem.path}
                      onClick={() => router.push(subItem.path)}
                      sx={{
                        borderRadius: '10px',
                        py: 1,
                        mb: 0.5,
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(107, 70, 193, 0.1)', // Light purple bg
                          color: 'primary.main',
                          '&:hover': {
                            backgroundColor: 'rgba(107, 70, 193, 0.15)',
                          },
                          '& .MuiListItemIcon-root': {
                            color: 'primary.main',
                          },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36, color: pathname === subItem.path ? 'inherit' : 'text.secondary' }}>
                        {subItem.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={subItem.title}
                        primaryTypographyProps={{
                          fontSize: '0.85rem',
                          fontWeight: 500,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        ))}
      </List>
    </Drawer>
  );
}






