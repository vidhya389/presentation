import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedValue = localStorage.getItem('isAuthenticated');
    return storedValue !== null ? JSON.parse(storedValue) : false;
  });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  const updateIsAuthenticated = (value) => {
    setIsAuthenticated(value);
  };

const [hasConsented, setHasConsented] = useState(false);

  const updateHasConsented = (value) => {
    setHasConsented(value);
  };

  return (
      <AuthContext.Provider
        value={{
          isAuthenticated,
          hasConsented,
          updateIsAuthenticated,
          updateHasConsented, // Add this
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };

export { AuthProvider, AuthContext };