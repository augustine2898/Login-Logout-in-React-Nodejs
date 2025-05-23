// components/Admin-side/ProtectedAdminRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.admin);

  if (loading) {
    return <div>Loading...</div>; // You can customize this for a loading spinner
  }

  // If not authenticated, redirect to the admin login page
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // If authenticated, render the protected route
  return children;
};

export default ProtectedAdminRoute;
