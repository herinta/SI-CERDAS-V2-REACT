import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
  // In a real app, you'd have a more robust authentication check
  // (e.g., checking for a token in localStorage).
  // For now, we'll simulate being logged in.
  return true;
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
