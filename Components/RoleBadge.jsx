import React from 'react';
import { Badge } from './ui/badge';

export const RoleBadge = ({ role }) => {
  const colorMap = {
    'Admin': 'bg-red-100 text-red-800',
    'Leader': 'bg-blue-100 text-blue-800',
    'Member': 'bg-gray-100 text-gray-800'
  };

  return (
    <Badge className={colorMap[role] || colorMap['Member']}>
      {role}
    </Badge>
  );
};