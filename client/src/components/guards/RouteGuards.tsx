import { useAuth } from '@/hooks/use-auth';
import { Box, CircularProgress } from '@mui/material';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

function FullPageLoader() {
  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <CircularProgress />
    </Box>
  );
}

/** Tizimga kirmagan foydalanuvchini loginga yo'naltiradi. */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <FullPageLoader />;
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location.pathname }} />
  );
}

/** Login/Register sahifalari — kirgan foydalanuvchi dashboardga ketadi. */
export function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <FullPageLoader />;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

export function AdminRoute() {
  const { isAdmin } = useAuth();

  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
