import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute ensures child routes are only accessible to authenticated users.
 */
export function ProtectedRoute({ children }) {
  /** Guard component that redirects to /login when user is unauthenticated. */
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) return null;
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

export default ProtectedRoute;
