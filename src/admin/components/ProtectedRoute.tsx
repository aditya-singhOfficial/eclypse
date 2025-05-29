import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext'; // Assuming AdminAuthContext is in this path

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Optional: For role-based access control
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAdminAuthenticated, isLoading, admin } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    // You might want to show a loading spinner here
    return <div>Loading authentication status...</div>;
  }

  if (!isAdminAuthenticated) {
    // Redirect them to the /admin/login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the admin homepage.
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Optional: Role-based access control
  if (allowedRoles && admin?.roles) {
    const hasRequiredRole = admin.roles.some(role => allowedRoles.includes(role));
    if (!hasRequiredRole) {
      // Redirect to an unauthorized page or back to dashboard
      // For simplicity, redirecting to admin dashboard. Consider an "Access Denied" page.
      return <Navigate to="/admin" state={{ from: location }} replace />;
    }
  }

  return <Outlet />; // Render the child route component if authenticated and authorized
};

export default ProtectedRoute;