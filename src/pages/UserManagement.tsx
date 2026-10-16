import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  UserPlus, 
  Trash2, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  KeyRound, 
  Radio, 
  User, 
  Check, 
  X, 
  Eye, 
  Lock, 
  Activity,
  Crown,
  ChevronRight,
  Shield,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { User as UserType, OperatorRole, ClearanceLevel } from '../types';

export const UserManagement: React.FC = () => {
  const { currentUser, getAllUsers, deleteUser, updateUserRole } = useAuth();
  
  const [usersList, setUsersList] = useState<UserType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ONLINE' | 'OFFLINE'>('ALL');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [selectedUserDossier, setSelectedUserDossier] = useState<UserType | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const refreshUsers = () => {
    setUsersList(getAllUsers());
  };

  useEffect(() => {
    refreshUsers();
  }, [currentUser]);

  // Statistik Ringkas
  const totalUsers = usersList.length;
  const onlineUsers = usersList.filter(u => u.isOnline).length;
  const offlineUsers = totalUsers - onlineUsers;
  const adminUsers = usersList.filter(u => u.role === 'ADMIN').length;

  // Proteksi Hak Akses: Hanya Akun Admin yang Boleh Mengakses
  if (currentUser?.role !== 'ADMIN') {
    return (
      <div className="p-6 max-w-4xl mx-auto font-mono text-center space-y-4 my-12">
        <div className="p-8 bg-red-950/40 border-2 border-red-600 rounded-2xl shadow-glow-red space-y-3">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto animate-pulse" />
          <h2 className="text-xl font-black text-white tracking-widest uppercase">
            AKSES DITOLAK // RESTRICTED ADMIN ZONE
          </h2>
          <p className="text-xs text-red-300 max-w-md mx-auto leading-relaxed">
            Modul <span className="font-bold underline">User Management & Kendali Personel</span> hanya dapat diakses oleh Akun dengan Role <span className="font-bold text-white">ADMIN</span> (Otoritas Utama: Aryaa).
          </p>
          <div className="pt-2 text-[11px] text-zinc-500">
            Sesi Personel Saat Ini: <span className="text-zinc-200">{currentUser?.callsign}</span> (Role: {currentUser?.role})
          </div>
        </div>
      </div>
    );
  }

  // Handler Hapus User
  const handleDeleteUser = (userId: string, callsign: string) => {
    if (userId === currentUser.id) {
      alert('Tidak dapat menghapus akun Anda sendiri yang sedang aktif.');
      return;
    }

    if (window.confirm(`Hapus akses operator "${callsign}" dari sistem Intel Nusantara secara permanen?`)) {
      const ok = deleteUser(userId);
      if (ok) {
        refreshUsers();
        setActionSuccess(`Akses operator ${callsign} berhasil dicabut.`);
        setTimeout(() => setActionSuccess(null), 3000);
      }
    }
  };

  // Handler Ganti Role
  const handleToggleRole = (userId: string, currentRole: OperatorRole, callsign: string) => {
    if (userId === currentUser.id) {
      alert('Tidak dapat mengubah role akun Administrator utama yang sedang aktif.');
      return;
    }

    const nextRole: OperatorRole = currentRole === 'ADMIN' ? 'OPERATOR' : 'ADMIN';
    const confirmChange = window.confirm(`Ubah role operator "${callsign}" menjadi ${nextRole}?`);
    if (confirmChange) {
      updateUserRole(userId, nextRole);
      refreshUsers();
      setActionSuccess(`Role ${callsign} berhasil diperbarui menjadi ${nextRole}.`);
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  // Filter User List
  const filteredUsers = usersList.filter(u => {
    const matchStatus = statusFilter === 'ALL' || 
      (statusFilter === 'ONLINE' ? u.isOnline : !u.isOnline);

    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;

    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q ||
      u.callsign.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.badgeNumber.toLowerCase().includes(q) ||
      u.unit.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q);

    return matchStatus && matchRole && matchQuery;
  });

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Toast Notification Action */}
      {actionSuccess && (
        <div className="fixed top-16 right-4 z-50 bg-[#0d1424] border border-emerald-500 text-emerald-200 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 font-mono text-xs animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="bg-[#090e1a] border border-amber-600/50 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-2 rounded-xl bg-amber-950 border border-amber-700/60 text-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
              <Crown className="w-5 h-5 text-amber-400" />
            </span>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              ADMIN CONTROL PANEL // USER MANAGEMENT
            </span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="text-xs text-zinc-400 font-mono">
              ADMINISTRATOR: <span className="text-white font-bold">{currentUser.callsign}</span> ({currentUser.badgeNumber})
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide mt-2">
            Manajemen Pengguna, Otoritas Role, & Status Aktivitas
          </h2>
          <p className="text-xs text-zinc-400 font-sans mt-1">
            Pantau seluruh sesi operator aktif secara real-time, atur hak akses Role (ADMIN / OPERATOR), serta kendalikan izin kredensial pendaftaran.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshUsers}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
            <span>REFRESH STATUS</span>
          </button>
        </div>
      </div>

      {/* 1. STATISTIK RINGKAS USER DI BAGIAN ATAS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono">
        
        {/* Total User */}
        <div className="bg-[#0b101c] border border-zinc-800 rounded-xl p-4 shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs text-zinc-400 uppercase">TOTAL USER</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">
            {totalUsers} <span className="text-xs font-normal text-cyan-400 font-sans">Personel</span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            Terdaftar di basis data
          </div>
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-cyan-600/10 rounded-full blur-xl"></div>
        </div>

        {/* Active Online Users (Lampu Hijau Menyala) */}
        <div className="bg-[#0b101c] border border-emerald-800/40 rounded-xl p-4 shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs text-emerald-400 uppercase font-bold flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              </span>
              ACTIVE ONLINE
            </span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">
            {onlineUsers} <span className="text-xs font-normal text-emerald-400 font-sans">Sesi Aktif</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Sedang login di sistem
          </div>
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-emerald-600/15 rounded-full blur-xl"></div>
        </div>

        {/* Offline Users (Lampu Abu-abu/Merah) */}
        <div className="bg-[#0b101c] border border-zinc-800 rounded-xl p-4 shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs text-zinc-400 uppercase flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-zinc-500"></span>
              OFFLINE USERS
            </span>
            <Clock className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">
            {offlineUsers} <span className="text-xs font-normal text-zinc-400 font-sans">Siaga</span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            Tidak dalam sesi login
          </div>
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-zinc-600/10 rounded-full blur-xl"></div>
        </div>

        {/* Administrator Level */}
        <div className="bg-[#0b101c] border border-amber-800/40 rounded-xl p-4 shadow-inner relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs text-amber-400 uppercase font-bold">ADMINISTRATOR</span>
            <Crown className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">
            {adminUsers} <span className="text-xs font-normal text-amber-400 font-sans">Otoritas</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Hak akses penuh sistem
          </div>
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-amber-600/15 rounded-full blur-xl"></div>
        </div>

      </div>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <div className="bg-[#0b101c] border border-zinc-800/90 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 font-mono text-xs shadow-lg">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Cari Username, Callsign (GARUDA-01), Badge (IN-xxxx), atau Unit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2 bg-black/60 border border-zinc-700/80 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Status Aktivitas: ALL, ONLINE, OFFLINE */}
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 whitespace-nowrap">Status:</span>
          <div className="flex items-center bg-black/60 p-1 rounded-xl border border-zinc-800">
            {[
              { id: 'ALL' as const, label: 'SEMUA' },
              { id: 'ONLINE' as const, label: 'ONLINE' },
              { id: 'OFFLINE' as const, label: 'OFFLINE' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  statusFilter === tab.id
                    ? tab.id === 'ONLINE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' :
                      tab.id === 'OFFLINE' ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' :
                      'bg-amber-950 text-amber-300 border border-amber-700'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Role: ALL, ADMIN, OPERATOR */}
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 whitespace-nowrap">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-black/60 border border-zinc-700/80 rounded-xl text-zinc-200 focus:outline-none focus:border-amber-500 font-bold"
          >
            <option value="ALL">SEMUA ROLE</option>
            <option value="ADMIN">ADMIN</option>
            <option value="OPERATOR">OPERATOR</option>
          </select>
        </div>

      </div>

      {/* 3. USER MANAGEMENT TABLE */}
      <div className="bg-[#090e1a] border border-zinc-800/90 rounded-2xl shadow-xl overflow-hidden font-mono">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0e1628] border-b border-zinc-800 text-zinc-400 text-[11px] uppercase tracking-wider font-bold">
                <th className="py-3.5 px-4">Personel / Callsign</th>
                <th className="py-3.5 px-4">Role Hak Akses</th>
                <th className="py-3.5 px-4">Badge Number</th>
                <th className="py-3.5 px-4">Clearance</th>
                <th className="py-3.5 px-4">Status Aktivitas</th>
                <th className="py-3.5 px-4">Last Active (Waktu Login)</th>
                <th className="py-3.5 px-4 text-center">Tindakan Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70 text-zinc-300">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-zinc-500">
                    Tidak ada personel yang sesuai dengan kriteria filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isCurrent = currentUser.id === user.id;

                  return (
                    <tr 
                      key={user.id}
                      className="hover:bg-zinc-900/80 transition-colors group"
                    >
                      {/* Callsign & Username */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            user.role === 'ADMIN' 
                              ? 'bg-amber-950/80 border border-amber-600/70 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.25)]' 
                              : 'bg-zinc-900 border border-zinc-700 text-zinc-300'
                          }`}>
                            {user.role === 'ADMIN' ? <Crown className="w-4 h-4 text-amber-400" /> : <User className="w-4 h-4 text-zinc-400" />}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{user.callsign}</span>
                              {isCurrent && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-950 text-red-300 border border-red-800">
                                  ANDA
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-zinc-400">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Hak Akses */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {user.role === 'ADMIN' ? (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.3)] flex items-center gap-1 w-max">
                            <Crown className="w-3 h-3 text-amber-400" /> ADMIN
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 flex items-center gap-1 w-max">
                            <Shield className="w-3 h-3 text-zinc-400" /> OPERATOR
                          </span>
                        )}
                      </td>

                      {/* Badge Number */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-zinc-200 font-bold">
                        {user.badgeNumber}
                      </td>

                      {/* Clearance Level */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          user.clearanceLevel === 'TOP SECRET' ? 'bg-red-950/80 text-red-400 border-red-800/80' :
                          user.clearanceLevel === 'SECRET' ? 'bg-orange-950/80 text-orange-400 border-orange-800/80' :
                          'bg-zinc-800 text-zinc-300 border-zinc-700'
                        }`}>
                          {user.clearanceLevel}
                        </span>
                      </td>

                      {/* Indikator Status Aktivitas: ONLINE (Hijau Menyala) vs OFFLINE (Abu-abu/Merah) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {user.isOnline ? (
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.9)]"></span>
                            </span>
                            <span className="text-emerald-400 font-black tracking-wider text-xs">
                              ONLINE
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-zinc-600 border border-zinc-700"></span>
                            <span className="text-zinc-500 font-bold tracking-wider text-xs">
                              OFFLINE
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Last Active (Waktu Terakhir Login) */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-zinc-400 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                          <span className={user.isOnline ? 'text-emerald-400 font-semibold' : 'text-zinc-400'}>
                            {user.isOnline ? 'Sesi Aktif Sekarang' : (user.lastLogin || 'Belum Ada Sesi')}
                          </span>
                        </div>
                      </td>

                      {/* Tindakan Admin */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          
                          {/* Toggle Role Button */}
                          <button
                            onClick={() => handleToggleRole(user.id, user.role, user.callsign)}
                            disabled={isCurrent}
                            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 text-[10px] font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Ubah Role (Admin / Operator)"
                          >
                            {user.role === 'ADMIN' ? 'Set Operator' : 'Jadikan Admin'}
                          </button>

                          {/* Lihat Dossier */}
                          <button
                            onClick={() => setSelectedUserDossier(user)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                            title="Lihat Rincian Personel"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Hapus User */}
                          <button
                            onClick={() => handleDeleteUser(user.id, user.callsign)}
                            disabled={isCurrent}
                            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-950 text-zinc-500 hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Cabut Akses Personel"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. MODAL DETAIL DOSSIER PERSONEL */}
      {selectedUserDossier && (
        <div 
          onClick={() => setSelectedUserDossier(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn font-mono"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0b101c] border border-amber-600/70 rounded-2xl max-w-lg w-full p-5 sm:p-7 space-y-4 shadow-2xl relative my-6 text-zinc-200"
          >
            <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-amber-600 flex items-center justify-center text-amber-400 font-bold">
                  {selectedUserDossier.role === 'ADMIN' ? <Crown className="w-6 h-6" /> : <User className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {selectedUserDossier.callsign}
                  </h3>
                  <div className="text-xs text-zinc-400">
                    ID Username: @{selectedUserDossier.username}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedUserDossier(null)}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-black/50 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">ROLE OTORITAS</span>
                <span className="font-bold text-amber-400 block mt-0.5">{selectedUserDossier.role}</span>
              </div>
              <div className="p-2.5 bg-black/50 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">NOMOR BADGE</span>
                <span className="font-bold text-white block mt-0.5">{selectedUserDossier.badgeNumber}</span>
              </div>
              <div className="p-2.5 bg-black/50 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">SECURITY CLEARANCE</span>
                <span className="font-bold text-red-400 block mt-0.5">{selectedUserDossier.clearanceLevel}</span>
              </div>
              <div className="p-2.5 bg-black/50 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">STATUS SESI</span>
                <span className={`font-bold block mt-0.5 ${selectedUserDossier.isOnline ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {selectedUserDossier.isOnline ? '● ONLINE' : '○ OFFLINE'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-black/60 rounded-xl border border-zinc-800 text-xs space-y-1">
              <span className="text-zinc-500 text-[10px] uppercase font-bold block">SATUAN / UNIT OPERASIONAL:</span>
              <p className="text-zinc-200">{selectedUserDossier.unit}</p>
              <div className="pt-1 text-[11px] text-zinc-400">
                Waktu Terakhir Login: <span className="text-zinc-200">{selectedUserDossier.lastLogin}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-zinc-800">
              <button
                onClick={() => setSelectedUserDossier(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold"
              >
                TUTUP DOSSIER
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
