import React, { createContext, useState } from 'react';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    // Mimic API latency
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === 'admin@example.com' && password === 'password123') {
          const userData = {
            id: 'u-1',
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'Administrator',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            isLoggedIn: true
          };
          setUser(userData);
          localStorage.setItem('auth_user', JSON.stringify(userData));
          toast.success('Welcome back, Admin!');
          setLoading(false);
          resolve(true);
        } else {
          toast.error('Invalid email or password. Use: admin@example.com / password123');
          setLoading(false);
          resolve(false);
        }
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
