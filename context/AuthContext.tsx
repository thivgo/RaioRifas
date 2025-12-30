import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserData, Purchase } from '../types';

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, cpf: string, phone: string) => void;
  logout: () => void;
  purchases: Purchase[];
  addPurchase: (purchase: Purchase) => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const login = (email: string, password: string) => {
    // Hardcoded Admin Logic
    if (email === 'admin' && password === 'admin') {
      // Generate random mock data for admin
      const randomCpf = `${Math.floor(Math.random() * 900 + 100)}.${Math.floor(Math.random() * 900 + 100)}.${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 90 + 10)}`;
      const randomPhone = `(${Math.floor(Math.random() * 90 + 10)}) 9${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`;

      setUser({
        id: 'admin-1',
        name: 'Administrador',
        email: 'admin',
        role: 'admin',
        cpf: randomCpf,
        phone: randomPhone
      });
      return true;
    }

    // Mock User Logic (Accepts any email with password '123456' or just simulates success for demo)
    // For this feature request, we will just simulate a successful user login
    if (email && password) {
      setUser({
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email: email,
        role: 'user'
      });
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, password: string, cpf: string, phone: string) => {
    setUser({
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      cpf,
      phone,
      role: 'user'
    });
  };

  const logout = () => {
    setUser(null);
    setPurchases([]); // Clear session purchases on logout for security in this mock
  };

  const addPurchase = (purchase: Purchase) => {
    setPurchases(prev => [purchase, ...prev]);
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
      purchases,
      addPurchase,
      isAuthModalOpen,
      openAuthModal,
      closeAuthModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};