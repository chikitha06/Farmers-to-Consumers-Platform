import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, roles }) => {
  const { userInfo } = useAuth();

  if (!userInfo) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(userInfo.role)) return <Navigate to="/" replace />;

  return children;
};

export default PrivateRoute;