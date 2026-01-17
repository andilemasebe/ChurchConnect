import React from 'react';
import { useRole } from './RoleContext';
import { rolePermissionsMap } from './rolePermissions';
import UserNotRegisteredError from './UserNotRegisteredError';

export const ProtectedRoute = ({ children, requiredPermission, requiredRole }) => {
  const { user } = useRole();

  if (!user.id) {
    return <UserNotRegisteredError />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (requiredPermission) {
    const permissions = rolePermissionsMap[user.role] || [];
    if (!permissions.includes(requiredPermission)) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }
  }

  return children;
};