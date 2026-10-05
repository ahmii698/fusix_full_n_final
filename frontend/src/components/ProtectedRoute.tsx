// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem('adminToken');
  const userStr = localStorage.getItem('adminUser');
  
  try {
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (!token || !user || user.role !== 'admin') {
      // Clear invalid data
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      return <Navigate to="/admin-login" replace />;
    }
    
    return <>{children}</>;
  } catch (error) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    return <Navigate to="/admin-login" replace />;
  }
}