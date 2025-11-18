import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';
import { getIdTokenResult } from 'firebase/auth';

/**
 * Protected Route Component
 * Wraps routes that require authentication or admin access
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = auth.currentUser;
        
        if (!user) {
          setIsAuthenticated(false);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);

        // If admin is required, check for admin claim
        if (requireAdmin) {
          const token = await getIdTokenResult(user, true);
          const hasAdminClaim = Boolean(token.claims && token.claims.admin);
          setIsAdmin(hasAdminClaim);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    // Check auth immediately
    checkAuth();

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(() => {
      checkAuth();
    });

    return () => unsubscribe();
  }, [requireAdmin]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-red"></div>
          <p className="mt-4 text-gray-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to sign in
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // If admin is required but user is not admin, redirect to admin login
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  // User is authenticated (and admin if required), render children
  return children;
};

export default ProtectedRoute;
