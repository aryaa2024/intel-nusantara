import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ClearanceLevel, OperatorRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (username: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    username: string;
    password: string;
    callsign: string;
    badgeNumber: string;
    role: OperatorRole;
    clearanceLevel: ClearanceLevel;
    unit: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getOperatorStorage: <T>(key: string, defaultValue: T) => T;
  setOperatorStorage: <T>(key: string, value: T) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial Operator Seeds
const DEFAULT_OPERATORS: (User & { passwordHash: string })[] = [
  {
    id: 'op-001',
    username: 'garuda01',
    passwordHash: 'intelpassword',
    callsign: 'GARUDA-01',
    badgeNumber: 'IN-8890',
    role: 'COMMANDER',
    clearanceLevel: 'TOP SECRET',
    unit: 'Nusantara Cyber Command & SOC',
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'op-002',
    username: 'analyst',
    passwordHash: 'intelpassword',
    callsign: 'MERPATI-07',
    badgeNumber: 'IN-4421',
    role: 'INTEL_ANALYST',
    clearanceLevel: 'SECRET',
    unit: 'Direktorat Analisis & Kontra-Intelijen',
    lastLogin: new Date().toISOString(),
  }
];

const STORAGE_USERS_KEY = 'intel_registered_operators_v1';
const STORAGE_CURRENT_USER_KEY = 'intel_active_session_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedSession = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
      return savedSession ? JSON.parse(savedSession) : null;
    } catch {
      return null;
    }
  });

  // Ensure default seeds exist
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_USERS_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_OPERATORS));
      }
    } catch (e) {
      console.error('Error initializing operators storage', e);
    }
  }, []);

  const login = async (username: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const rawUsers = localStorage.getItem(STORAGE_USERS_KEY);
      const users: (User & { passwordHash: string })[] = rawUsers ? JSON.parse(rawUsers) : DEFAULT_OPERATORS;
      
      const found = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
      if (!found) {
        return { success: false, error: 'Identitas Operator tidak ditemukan dalam database Intelijen.' };
      }

      if (found.passwordHash !== pass) {
        return { success: false, error: 'Kredensial Otorisasi / Passcode ditolak.' };
      }

      const updatedUser: User = {
        id: found.id,
        username: found.username,
        callsign: found.callsign,
        badgeNumber: found.badgeNumber,
        role: found.role,
        clearanceLevel: found.clearanceLevel,
        unit: found.unit,
        lastLogin: new Date().toISOString(),
      };

      setCurrentUser(updatedUser);
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(updatedUser));
      return { success: true };
    } catch {
      return { success: false, error: 'Terjadi kegagalan verifikasi enkripsi.' };
    }
  };

  const register = async (data: {
    username: string;
    password: string;
    callsign: string;
    badgeNumber: string;
    role: OperatorRole;
    clearanceLevel: ClearanceLevel;
    unit: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const rawUsers = localStorage.getItem(STORAGE_USERS_KEY);
      const users: (User & { passwordHash: string })[] = rawUsers ? JSON.parse(rawUsers) : [...DEFAULT_OPERATORS];

      const exists = users.some(u => u.username.toLowerCase() === data.username.trim().toLowerCase());
      if (exists) {
        return { success: false, error: 'ID Operator / Username sudah terdaftar di sistem.' };
      }

      const newId = `op-${Date.now().toString().slice(-5)}`;
      const newUserRecord = {
        id: newId,
        username: data.username.trim(),
        passwordHash: data.password,
        callsign: data.callsign.toUpperCase().trim(),
        badgeNumber: data.badgeNumber.trim(),
        role: data.role,
        clearanceLevel: data.clearanceLevel,
        unit: data.unit.trim(),
        lastLogin: new Date().toISOString()
      };

      users.push(newUserRecord);
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));

      // Auto login after registration
      const userSession: User = {
        id: newUserRecord.id,
        username: newUserRecord.username,
        callsign: newUserRecord.callsign,
        badgeNumber: newUserRecord.badgeNumber,
        role: newUserRecord.role,
        clearanceLevel: newUserRecord.clearanceLevel,
        unit: newUserRecord.unit,
        lastLogin: newUserRecord.lastLogin
      };

      setCurrentUser(userSession);
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(userSession));
      return { success: true };
    } catch {
      return { success: false, error: 'Gagal membuat identitas operator baru.' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
  };

  // Operator-isolated storage helpers
  const getOperatorStorage = <T,>(key: string, defaultValue: T): T => {
    if (!currentUser) return defaultValue;
    try {
      const fullKey = `intel_op_${currentUser.id}_${key}`;
      const saved = localStorage.getItem(fullKey);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const setOperatorStorage = <T,>(key: string, value: T): void => {
    if (!currentUser) return;
    try {
      const fullKey = `intel_op_${currentUser.id}_${key}`;
      localStorage.setItem(fullKey, JSON.stringify(value));
    } catch (e) {
      console.error('Failed to set operator storage', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        register,
        logout,
        getOperatorStorage,
        setOperatorStorage,
      }}
    >
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
