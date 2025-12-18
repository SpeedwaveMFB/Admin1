import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Admin {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  permissions?: string[];
}

interface AuthState {
  token: string | null;
  admin: Admin | null;
  isAuthenticated: boolean;
  lastActivity: number;
  setAuth: (token: string, admin: Admin) => void;
  logout: () => void;
  updateLastActivity: () => void;
}

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      admin: null,
      isAuthenticated: false,
      lastActivity: Date.now(),
      
      setAuth: (token: string, admin: Admin) => {
        set({
          token,
          admin,
          isAuthenticated: true,
          lastActivity: Date.now(),
        });
      },
      
      logout: () => {
        set({
          token: null,
          admin: null,
          isAuthenticated: false,
          lastActivity: Date.now(),
        });
      },
      
      updateLastActivity: () => {
        const now = Date.now();
        const { lastActivity, isAuthenticated } = get();
        
        // Auto-logout if session timeout exceeded
        if (isAuthenticated && now - lastActivity > SESSION_TIMEOUT) {
          get().logout();
          return;
        }
        
        set({ lastActivity: now });
      },
    }),
    {
      name: 'speedwave-admin-auth',
    }
  )
);

// Check session timeout every minute
if (typeof window !== 'undefined') {
  setInterval(() => {
    const { lastActivity, isAuthenticated, logout } = useAuthStore.getState();
    if (isAuthenticated && Date.now() - lastActivity > SESSION_TIMEOUT) {
      logout();
      window.location.href = '/login';
    }
  }, 60000);
}





