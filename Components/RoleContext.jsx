import React, { createContext, useContext, useState } from 'react';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    name: '',
    role: 'Member', // 'Admin', 'Leader', 'Member'
    permissions: []
  });

  const updateUser = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser({ id: null, name: '', role: 'Member', permissions: [] });
  };

  return (
    <RoleContext.Provider value={{ user, updateUser, logout }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within RoleProvider');
  }
  return context;
};