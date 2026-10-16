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
    pin: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getAllUsers: () => User[];
  deleteUser: (userId: string) => boolean;
  updateUserRole: (userId: string, role: OperatorRole) => boolean;
  getOperatorStorage: <T>(key: string, defaultValue: T) => T;
  setOperatorStorage: <T>(key: string, value: T) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Secret Registration PIN
export const REGISTRATION_SECURITY_PIN = '9087';

// Default Seed Accounts
const DEFAULT_OPERATORS: (User & { passwordHash: string })[] = [
  {
    id: 'op-admin-01',
    username: 'arya',
    passwordHash: 'intelpassword',
    callsign: 'ARYA-KOMANDO',
    badgeNumber: 'ADM-001',
    role: 'ADMIN',
    clearanceLevel: 'TOP SECRET',
    unit: 'Markas Komando Pusat & Administrasi Intel Nusantara',
    lastLogin: '17/10/2026 00:05 WIB',
    isOnline: false
  },
  {
    id: 'op-001',
    username: 'garuda01',
    passwordHash: 'intelpassword',
    callsign: 'GARUDA-01',
    badgeNumber: 'IN-8890',
    role: 'OPERATOR',
    clearanceLevel: 'TOP SECRET',
    unit: 'Nusantara Cyber Command & SOC',
    lastLogin: '16/10/2026 23:45 WIB',
    isOnline: false
  },
  {
    id: 'op-002',
    username: 'analyst',
    passwordHash: 'intelpassword',
    callsign: 'MERPATI-07',
    badgeNumber: 'IN-4421',
    role: 'OPERATOR',
    clearanceLevel: 'SECRET',
    unit: 'Direktorat Analisis & Kontra-Intelijen',
    lastLogin: '16/10/2026 18:30 WIB',
    isOnline: false
  },
  {
    id: 'op-003',
    username: 'badak04',
    passwordHash: 'intelpassword',
    callsign: 'BADAK-04',
    badgeNumber: 'IN-7714',
    role: 'OPERATOR',
    clearanceLevel: 'CONFIDENTIAL',
    unit: 'Satgas Patroli Siber Pesisir & Maritim',
    lastLogin: '15/10/2026 14:15 WIB',
    isOnline: false
  }
];

const STORAGE_USERS_KEY = 'intel_registered_operators_v2';
const STORAGE_CURRENT_USER_KEY = 'intel_active_session_v2';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedSession = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
      return savedSession ? JSON.parse(savedSession) : null;
    } catch {
      return null;
    }
  });

  // Pastikan akun awal tersimpan di storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_USERS_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_OPERATORS));
      } else {
        // Pastikan akun Arya ADMIN ada di storage jika pengguna punya storage lama
        const parsed: (User & { passwordHash: string })[] = JSON.parse(stored);
        if (!parsed.some(u => u.username.toLowerCase() === 'arya')) {
          parsed.unshift(DEFAULT_OPERATORS[0]);
          localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(parsed));
        }
      }
    } catch (e) {
      console.error('Error initializing operators storage', e);
    }
  }, []);

  const login = async (username: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const rawUsers = localStorage.getItem(STORAGE_USERS_KEY);
      const users: (User & { passwordHash: string })[] = rawUsers ? JSON.parse(rawUsers) : DEFAULT_OPERATORS;
      
      const foundIndex = users.findIndex(u => u.username.toLowerCase() === username.trim().toLowerCase());
      if (foundIndex === -1) {
        return { success: false, error: 'Identitas Personel tidak ditemukan dalam database Intelijen.' };
      }

      const found = users[foundIndex];
      if (found.passwordHash !== pass) {
        return { success: false, error: 'Kredensial Otorisasi / Passcode ditolak.' };
      }

      const nowStr = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      }).format(new Date()) + ' WIB';

      // Update isOnline = true dan waktu login terakhir
      users[foundIndex].isOnline = true;
      users[foundIndex].lastLogin = nowStr;
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));

      const updatedUser: User = {
        id: found.id,
        username: found.username,
        callsign: found.callsign,
        badgeNumber: found.badgeNumber,
        role: found.role,
        clearanceLevel: found.clearanceLevel,
        unit: found.unit,
        lastLogin: nowStr,
        isOnline: true
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
    pin: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      // 1. Validasi PIN Otentikasi Pendaftaran (Wajib "9087")
      if (!data.pin || data.pin.trim() !== REGISTRATION_SECURITY_PIN) {
        return { success: false, error: 'PIN Otentikasi Salah. Akses Ditolak.' };
      }

      const rawUsers = localStorage.getItem(STORAGE_USERS_KEY);
      const users: (User & { passwordHash: string })[] = rawUsers ? JSON.parse(rawUsers) : [...DEFAULT_OPERATORS];

      const exists = users.some(u => u.username.toLowerCase() === data.username.trim().toLowerCase());
      if (exists) {
        return { success: false, error: 'ID Operator / Username sudah terdaftar di sistem.' };
      }

      const nowStr = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      }).format(new Date()) + ' WIB';

      const newId = `op-${Date.now().toString().slice(-5)}`;
      const newUserRecord = {
        id: newId,
        username: data.username.trim(),
        passwordHash: data.password,
        callsign: data.callsign.toUpperCase().trim(),
        badgeNumber: data.badgeNumber.trim(),
        role: data.role || 'OPERATOR',
        clearanceLevel: data.clearanceLevel,
        unit: data.unit.trim(),
        lastLogin: nowStr,
        isOnline: true
      };

      users.push(newUserRecord);
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));

      // Auto login setelah registrasi berhasil
      const userSession: User = {
        id: newUserRecord.id,
        username: newUserRecord.username,
        callsign: newUserRecord.callsign,
        badgeNumber: newUserRecord.badgeNumber,
        role: newUserRecord.role,
        clearanceLevel: newUserRecord.clearanceLevel,
        unit: newUserRecord.unit,
        lastLogin: newUserRecord.lastLogin,
        isOnline: true
      };

      setCurrentUser(userSession);
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(userSession));
      return { success: true };
    } catch {
      return { success: false, error: 'Gagal membuat identitas operator baru.' };
    }
  };

  const logout = () => {
    if (currentUser) {
      try {
        const rawUsers = localStorage.getItem(STORAGE_USERS_KEY);
        if (rawUsers) {
          const users: (User & { passwordHash: string })[] = JSON.parse(rawUsers);
          const foundIdx = users.findIndex(u => u.id === currentUser.id);
          if (foundIdx !== -1) {
            users[foundIdx].isOnline = false;
            localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
          }
        }
      } catch (e) {
        console.error('Error updating logout status', e);
      }
    }
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
  };

  // Fungsi Admin: Ambil semua data user
  const getAllUsers = (): User[] => {
    try {
      const rawUsers = localStorage.getItem(STORAGE_USERS_KEY);
      if (!rawUsers) return DEFAULT_OPERATORS;
      const parsed: (User & { passwordHash: string })[] = JSON.parse(rawUsers);
      
      return parsed.map(u => ({
        id: u.id,
        username: u.username,
        callsign: u.callsign,
        badgeNumber: u.badgeNumber,
        role: u.role,
        clearanceLevel: u.clearanceLevel,
        unit: u.unit,
        lastLogin: u.lastLogin,
        // Jika sedang login di session aktif, pasti ONLINE
        isOnline: currentUser && currentUser.id === u.id ? true : !!u.isOnline
      }));
    } catch {
      return DEFAULT_OPERATORS;
    }
  };

  // Fungsi Admin: Hapus user
  const deleteUser = (userId: string): boolean => {
    try {
      if (currentUser?.id === userId) return false; // Jangan hapus akun sendiri
      const rawUsers = localStorage.getItem(STORAGE_USERS_KEY);
      if (!rawUsers) return false;
      const users: (User & { passwordHash: string })[] = JSON.parse(rawUsers);
      const filtered = users.filter(u => u.id !== userId);
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(filtered));
      return true;
    } catch {
      return false;
    }
  };

  // Fungsi Admin: Ganti Role user
  const updateUserRole = (userId: string, newRole: OperatorRole): boolean => {
    try {
      const rawUsers = localStorage.getItem(STORAGE_USERS_KEY);
      if (!rawUsers) return false;
      const users: (User & { passwordHash: string })[] = JSON.parse(rawUsers);
      const idx = users.findIndex(u => u.id === userId);
      if (idx === -1) return false;
      users[idx].role = newRole;
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
      if (currentUser && currentUser.id === userId) {
        const updated = { ...currentUser, role: newRole };
        setCurrentUser(updated);
        localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(updated));
      }
      return true;
    } catch {
      return false;
    }
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
        getAllUsers,
        deleteUser,
        updateUserRole,
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
