import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('🔍 AuthContext mounted, token:', token ? 'exists' : 'none');
    
    if (token) {
      setUser({ token });
      console.log('✅ User set from localStorage');
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    console.log('💾 Login called, saving token');
    localStorage.setItem('token', token);
    setUser({ token });
    console.log('✅ User state updated');
  };

  const register = async (nama, email, password) => {
    try {
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama: nama,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Register SUCCESS');
        return { success: true };
      } else {
        console.log('❌ Register FAILED:', data.detail);
        return { success: false, error: data.detail || 'Registrasi gagal' };
      }
    } catch (err) {
      console.error('💥 Register ERROR:', err);
      return { success: false, error: 'Terjadi kesalahan. Silakan coba lagi.' };
    }
  };

  const logout = () => {
    console.log('🚪 Logout called');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};