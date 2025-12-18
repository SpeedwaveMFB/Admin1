# Speedwave Admin Portal

A comprehensive admin portal for SpeedwaveMFB built with Next.js 14, Material-UI, and TypeScript.

## Features

- **Authentication**: Secure JWT-based authentication with session management
- **Dashboard**: Real-time statistics and analytics
- **User Management**: View, search, filter, and manage user accounts
- **Transaction Management**: Monitor all transactions with advanced filtering
- **Status Management**: Suspend/activate user accounts
- **Export Functionality**: Export data to CSV, Excel, and PDF
- **Responsive Design**: Works on desktop and tablet devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: Material-UI (MUI) v5
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts
- **Tables**: MUI DataGrid
- **Forms**: React Hook Form with Yup validation
- **Date Handling**: date-fns
- **File Export**: xlsx, jspdf
- **API Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:3000`

## Default Credentials

Use your admin credentials provided by the SpeedwaveMFB system to login.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (protected)/       # Protected routes (requires auth)
│   ├── layout.tsx         # Root layout
│   └── theme.ts           # MUI theme configuration
├── components/
│   ├── layout/            # Layout components (Sidebar, Header)
│   ├── dashboard/         # Dashboard components
│   ├── shared/            # Shared/reusable components
│   ├── users/             # User-specific components
│   └── transactions/      # Transaction-specific components
├── lib/
│   ├── api/               # API client and endpoints
│   ├── hooks/             # React Query hooks
│   ├── store/             # Zustand stores
│   └── utils/             # Utility functions
└── types/                 # TypeScript type definitions
```

## Key Features

### Authentication
- JWT token-based authentication
- Session timeout after 30 minutes of inactivity
- Auto-logout on 401 responses
- Secure token storage

### Dashboard
- Real-time platform statistics
- User metrics (total, active, suspended, verified)
- Transaction metrics (completed, pending, failed)
- Financial overview (deposits, withdrawals, transfers)
- System health monitoring
- Nomba balance tracking

### User Management
- Paginated user table with search
- Filter by status and verification
- User detail view with profile and transactions
- Suspend/activate user accounts
- Export user data

### Transaction Management
- Comprehensive transaction table
- Filter by type, status, date range, user
- Transaction statistics
- Export transaction data
- Detailed transaction view
- Support for all transaction types

## API Integration

The portal integrates with the Speedwave backend API at:
`https://speedwave-backend.onrender.com/api/v1`

### Key Endpoints Used

- `POST /admin/login` - Admin authentication
- `GET /admin/dashboard/stats` - Dashboard statistics
- `GET /admin/users` - List users
- `GET /admin/users/:id` - User details
- `PUT /admin/users/:id/status` - Update user status
- `GET /admin/transactions` - List transactions
- `GET /admin/transactions/stats` - Transaction statistics
- `GET /health` - System health check
- `GET /admin/nomba/balance` - Nomba account balance

## Environment Variables

No environment variables are required for the base configuration. The API base URL is configured in `src/lib/api/client.ts`.

## Development

### Code Style

The project uses ESLint for code quality. Run:

```bash
npm run lint
```

### Building

```bash
npm run build
```

## Security Features

- JWT token-based authentication
- Automatic session timeout
- Auto-logout on unauthorized access
- Secure API client with interceptors
- Role-based access control (planned)

## Future Enhancements

- Bill payments management
- KYC verification workflow
- Virtual accounts management
- Beneficiaries overview
- Audit logs
- Reports and analytics
- Admin user management
- Two-factor authentication
- Email notifications
- Real-time updates via WebSocket

## License

Proprietary - SpeedwaveMFB

## Support

For support, contact the SpeedwaveMFB development team.





