import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShieldAlert, Clock, LogOut, RefreshCw, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Batas Inaktivitas Standar SOC: 15 Menit (900.000 ms)
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;
// Periode Peringatan: 60 detik sebelum timeout (840.000 ms)
const WARNING_THRESHOLD_MS = 14 * 60 * 1000;
const STORAGE_LAST_ACTIVE_KEY = 'intel_last_active_timestamp_v3';

export const SessionTimeoutManager: React.FC = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(60);
  const lastWriteTimeRef = useRef<number>(Date.now());

  // Perbarui timestamp aktivitas di localStorage
  const updateActivityTimestamp = useCallback(() => {
    const now = Date.now();
    // Throttle penulisan ke localStorage maksimal setiap 4 detik untuk optimasi performa
    if (now - lastWriteTimeRef.current > 4000) {
      lastWriteTimeRef.current = now;
      try {
        localStorage.setItem(STORAGE_LAST_ACTIVE_KEY, now.toString());
      } catch (e) {
        console.error('Error updating activity timestamp', e);
      }
    }
  }, []);

  // Eksekusi auto-logout jika batas waktu terlewati
  const triggerAutoLogout = useCallback(() => {
    setShowWarningModal(false);
    try {
      localStorage.setItem(
        'intel_session_timeout_msg',
        'Sesi Anda telah kedaluwarsa secara otomatis demi keamanan operasional karena aplikasi ditinggalkan / tidak ada aktivitas selama lebih dari 15 menit. Silakan lakukan otentikasi ulang.'
      );
      localStorage.removeItem(STORAGE_LAST_ACTIVE_KEY);
    } catch (e) {
      console.error('Failed to set timeout message', e);
    }
    logout();
  }, [logout]);

  // Tombol "Tetap Masuk": reset timer
  const handleExtendSession = () => {
    const now = Date.now();
    lastWriteTimeRef.current = now;
    try {
      localStorage.setItem(STORAGE_LAST_ACTIVE_KEY, now.toString());
    } catch {
      // ignore
    }
    setShowWarningModal(false);
    setSecondsRemaining(60);
  };

  // 1. Pasang listener aktivitas pengguna jika user sedang login
  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      setShowWarningModal(false);
      return;
    }

    // Inisialisasi awal saat login aktif
    const now = Date.now();
    lastWriteTimeRef.current = now;
    try {
      if (!localStorage.getItem(STORAGE_LAST_ACTIVE_KEY)) {
        localStorage.setItem(STORAGE_LAST_ACTIVE_KEY, now.toString());
      }
    } catch {
      // ignore
    }

    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    const handleUserActivity = () => {
      // Jika modal peringatan TIDAK sedang tampil, perbarui timer otomatis saat ada aktivitas
      if (!showWarningModal) {
        updateActivityTimestamp();
      }
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Deteksi saat pengguna meninggalkan tab (visibilitychange / blur) atau kembali ke tab
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        const storedTs = localStorage.getItem(STORAGE_LAST_ACTIVE_KEY);
        const lastTs = storedTs ? parseInt(storedTs, 10) : Date.now();
        const elapsed = Date.now() - lastTs;

        // Jika ditinggalkan lebih dari 15 menit, langsung paksa logout
        if (elapsed >= INACTIVITY_TIMEOUT_MS) {
          triggerAutoLogout();
        } else if (elapsed < WARNING_THRESHOLD_MS) {
          // Masih aktif, perbarui
          updateActivityTimestamp();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
    };
  }, [isAuthenticated, currentUser, showWarningModal, updateActivityTimestamp, triggerAutoLogout]);

  // 2. Interval pengecekan berkala (setiap 1 detik)
  useEffect(() => {
    if (!isAuthenticated || !currentUser) return;

    const interval = setInterval(() => {
      try {
        const storedTs = localStorage.getItem(STORAGE_LAST_ACTIVE_KEY);
        const lastTs = storedTs ? parseInt(storedTs, 10) : Date.now();
        const elapsed = Date.now() - lastTs;

        if (elapsed >= INACTIVITY_TIMEOUT_MS) {
          triggerAutoLogout();
        } else if (elapsed >= WARNING_THRESHOLD_MS) {
          const remainingSec = Math.max(0, Math.ceil((INACTIVITY_TIMEOUT_MS - elapsed) / 1000));
          setSecondsRemaining(remainingSec);
          setShowWarningModal(true);
        } else {
          setShowWarningModal(false);
        }
      } catch {
        // ignore
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, currentUser, triggerAutoLogout]);

  // Render modal dialog jika masuk periode 60 detik peringatan
  if (!showWarningModal || !isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#090e1a] border-2 border-red-600 rounded-2xl shadow-2xl p-6 text-zinc-100 font-mono overflow-hidden">
        
        {/* Glow radar accent */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-red-600/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header Bar */}
        <div className="flex items-center gap-3 border-b border-red-900/60 pb-3 mb-4">
          <div className="p-2.5 bg-red-950/80 border border-red-600 rounded-xl text-red-500 shadow-glow-red animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wider text-white uppercase">
              PERINGATAN INAKTIVITAS OPERASIONAL
            </h3>
            <p className="text-[10px] text-red-400 font-semibold tracking-widest uppercase">
              Protokol SOC Auto-Lock (ISO/IEC 27001)
            </p>
          </div>
        </div>

        {/* Countdown Indicator */}
        <div className="bg-red-950/40 border border-red-800/80 rounded-xl p-4 text-center my-4 space-y-2">
          <div className="text-[11px] text-zinc-300 flex items-center justify-center gap-1.5 font-semibold">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Sesi Otentikasi Akan Ditutup Dalam:</span>
          </div>
          <div className="text-4xl font-black text-red-500 tracking-widest drop-shadow-[0_0_12px_rgba(239,68,68,0.7)] animate-pulse">
            00:{secondsRemaining.toString().padStart(2, '0')}
          </div>
          <div className="text-[11px] text-zinc-400">
            Detik Menuju Pemutusan Sesi Otomatis
          </div>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed mb-6 bg-black/40 p-3 rounded-lg border border-zinc-800">
          Sistem mendeteksi terminal Anda telah ditinggalkan atau tidak ada aktivitas operasional selama 14 menit. Demi menjaga kerahasiaan data intelijen negara, sesi Anda akan ditutup jika tidak ada respon.
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={triggerAutoLogout}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-red-600/70 text-zinc-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4 text-zinc-400" />
            <span>Keluar Sekarang</span>
          </button>

          <button
            type="button"
            onClick={handleExtendSession}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 border border-red-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-glow-red"
          >
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Tetap Masuk</span>
          </button>
        </div>

      </div>
    </div>
  );
};
