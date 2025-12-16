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
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  Verified as VerifiedIcon,
  AccountBalance as AccountBalanceIcon,
  Groups as GroupsIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
  Phone as PhoneIcon,
  Bolt as BoltIcon,
  Tv as TvIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 260;

const menuItems = [
  { title: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { title: 'Users', path: '/users', icon: <PeopleIcon /> },
  { title: 'Transactions', path: '/transactions', icon: <ReceiptIcon /> },
  {
    title: 'Bill Payments',
    path: '/bills',
    icon: <PhoneIcon />,
    subItems: [
      { title: 'Airtime', path: '/bills/airtime', icon: <PhoneIcon /> },
      { title: 'Data', path: '/bills/data', icon: <PhoneIcon /> },
      { title: 'Electricity', path: '/bills/electricity', icon: <BoltIcon /> },
      { title: 'Cable TV', path: '/bills/cable', icon: <TvIcon /> },
    ],
  },
  { title: 'KYC Verification', path: '/kyc', icon: <VerifiedIcon /> },
  { title: 'Virtual Accounts', path: '/virtual-accounts', icon: <AccountBalanceIcon /> },
  { title: 'Beneficiaries', path: '/beneficiaries', icon: <GroupsIcon /> },
  { title: 'Reports', path: '/reports', icon: <AssessmentIcon /> },
  { title: 'Audit Logs', path: '/audit-logs', icon: <HistoryIcon /> },
  { title: 'Settings', path: '/settings', icon: <SettingsIcon /> },
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
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" component="div" color="primary" fontWeight={700}>
            Speedwave
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => (
          <Box key={item.path}>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isActive(item.path)}
                onClick={() => router.push(item.path)}
                sx={{
                  borderRadius: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive(item.path) ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
            {item.subItems && isActive(item.path) && (
              <List sx={{ pl: 2 }}>
                {item.subItems.map((subItem) => (
                  <ListItem key={subItem.path} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      selected={pathname === subItem.path}
                      onClick={() => router.push(subItem.path)}
                      sx={{
                        borderRadius: 1,
                        '&.Mui-selected': {
                          backgroundColor: 'primary.light',
                          '&:hover': {
                            backgroundColor: 'primary.main',
                          },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32, fontSize: '1.2rem' }}>
                        {subItem.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={subItem.title}
                        primaryTypographyProps={{
                          fontSize: '0.8rem',
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




