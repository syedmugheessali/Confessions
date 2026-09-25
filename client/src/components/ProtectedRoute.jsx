import React from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div className="card-layout" style={{ maxWidth: '480px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '0.75rem', color: 'var(--danger)' }}>Access Denied</h2>
          <p className="text-secondary" style={{ marginBottom: '1.5rem' }}>
            You do not have permission to view this page. Required role:{' '}
            <strong>{allowedRoles.join(' or ')}</strong> (your role:{' '}
            <strong>{user?.role || 'user'}</strong>).
          </p>
          <Link to="/" className="btn-primary" style={{ display: 'inline-block' }}>
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
