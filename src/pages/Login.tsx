import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  User, 
  KeyRound, 
  Radio, 
  ShieldCheck, 
  AlertTriangle, 
  ChevronRight, 
  UserPlus, 
  Fingerprint,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ClearanceLevel, OperatorRole } from '../types';

export const Login: React.FC = () => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Register form state
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCallsign, setRegCallsign] = useState('');
  const [regBadge, setRegBadge] = useState('');
  const [regRole, setRegRole] = useState<OperatorRole>('OPERATOR');
  const [regClearance, setRegClearance] = useState<ClearanceLevel>('TOP SECRET');
  const [regUnit, setRegUnit] = useState('Pusat Operasi Intelijen Siber Nusantara');
  const [regPin, setRegPin] = useState('');

  // Status feedback
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [timeoutNotice, setTimeoutNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Periksa apakah sesi sebelumnya berakhir karena inaktivitas (Auto-Logout)
  useEffect(() => {
    try {
      const savedNotice = localStorage.getItem('intel_session_timeout_msg');
      if (savedNotice) {
        setTimeoutNotice(savedNotice);
        localStorage.removeItem('intel_session_timeout_msg');
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await login(username, password);
      if (!result.success) {
        setErrorMessage(result.error || 'Akses ditolak. Kredensial tidak valid.');
      }
    } catch {
      setErrorMessage('Terjadi anomali saat memverifikasi sesi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    if (!regUsername || !regPassword || !regCallsign || !regBadge) {
      setErrorMessage('Harap lengkapi semua kolom identitas personel.');
      setIsLoading(false);
      return;
    }

    if (!regPin.trim()) {
      setErrorMessage('PIN Otentikasi Pendaftaran wajib diisi.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await register({
        username: regUsername,
        password: regPassword,
        callsign: regCallsign,
        badgeNumber: regBadge,
        role: regRole,
        clearanceLevel: regClearance,
        unit: regUnit,
        pin: regPin
      });

      if (!result.success) {
        setErrorMessage(result.error || 'Pendaftaran operator gagal.');
      }
    } catch {
      setErrorMessage('Kesalahan enkripsi sistem saat registrasi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#05070c] tactical-grid-bg flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Background Ambience & Radar Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-950/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-900/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Top Banner Warning */}
      <div className="w-full max-w-xl mb-4 px-4 py-2 bg-red-950/40 border border-red-700/50 rounded-lg flex items-center justify-between text-[11px] font-mono text-red-300">
        <span className="flex items-center gap-2 font-bold tracking-wider">
          <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
          ZONA OTORISASI TERENKRIPSI TINGKAT TINGGI
        </span>
        <span className="text-zinc-500 hidden sm:inline">PROTOKOL SOC-7</span>
      </div>

      {/* Main Terminal Card */}
      <div className="w-full max-w-xl bg-[#090e1a]/95 border border-zinc-800 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-md relative z-10">
        
        {/* Terminal Header Bar */}
        <div className="px-6 py-4 bg-[#0d1424] border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-red-600/70 bg-black shadow-glow-red flex items-center justify-center p-0.5">
              <img 
                src="/logo.jpg" 
                alt="Logo Intel Nusantara" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <h1 className="font-mono text-lg font-black tracking-widest text-white flex items-center gap-2">
                INTEL <span className="text-red-600">NUSANTARA</span>
              </h1>
              <p className="text-[11px] font-mono text-zinc-400 tracking-wider uppercase">
                Monitoring • Analysis • Daily Logbook
              </p>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end text-right font-mono">
            <span className="text-[10px] text-zinc-500">TERMINAL STATUS</span>
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              SECURE READY
            </span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 border-b border-zinc-800 font-mono text-xs">
          <button
            type="button"
            onClick={() => { setTab('login'); setErrorMessage(''); }}
            className={`py-3 px-4 font-bold tracking-wider flex items-center justify-center gap-2 transition-colors ${
              tab === 'login'
                ? 'bg-red-950/50 text-white border-b-2 border-red-600 text-red-300'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <Fingerprint className="w-4 h-4 text-red-500" />
            LOGIN OPERATOR
          </button>

          <button
            type="button"
            onClick={() => { setTab('register'); setErrorMessage(''); }}
            className={`py-3 px-4 font-bold tracking-wider flex items-center justify-center gap-2 transition-colors ${
              tab === 'register'
                ? 'bg-red-950/50 text-white border-b-2 border-red-600 text-red-300'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            }`}
          >
            <UserPlus className="w-4 h-4 text-red-500" />
            REGISTRASI PERSONEL
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {/* Inactivity Timeout Notification */}
          {timeoutNotice && (
            <div className="mb-5 p-3.5 rounded-xl bg-amber-950/70 border border-amber-600/80 text-amber-200 text-xs font-mono flex items-start gap-2.5 shadow-[0_0_15px_rgba(245,158,11,0.2)] animate-fadeIn">
              <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" />
              <div>
                <span className="font-bold uppercase tracking-wider text-amber-300 block mb-0.5">
                  SESI BERAKHIR KARENA INAKTIVITAS
                </span>
                <span className="text-[11px] text-amber-200/90 leading-relaxed block">
                  {timeoutNotice}
                </span>
              </div>
            </div>
          )}

          {/* Error Notification */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-600/70 text-red-200 text-xs font-mono flex items-start gap-2 shadow-glow-red animate-fadeIn">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span className="font-bold">{errorMessage}</span>
            </div>
          )}

          {/* Success Notification */}
          {successMessage && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-950/60 border border-emerald-600/70 text-emerald-200 text-xs font-mono flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 font-mono">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>ID Operator / Username</span>
                  <span className="text-[10px] text-zinc-500">Kredensial Resmi Personel</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan ID Operator / Admin"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-zinc-700/80 rounded-xl text-zinc-100 placeholder-zinc-600 text-xs focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Passcode Otorisasi / Password</span>
                  <span className="text-[10px] text-zinc-500">Passcode Terenkripsi</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-zinc-700/80 rounded-xl text-zinc-100 placeholder-zinc-600 text-xs focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold tracking-widest text-xs uppercase shadow-glow-red hover:shadow-glow-red-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Radio className="w-4 h-4 animate-spin text-white" />
                    <span>MENGAUTENTIKASI SESI...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>OTORISASI & MASUK SISTEM</span>
                  </>
                )}
              </button>

              {/* Status Footer */}
              <div className="pt-4 mt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Sistem Otorisasi Terenkripsi
                </span>
                <span className="text-zinc-600">SECURE SOC-7</span>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER DENGAN PIN OTENTIKASI WAJIB (9087) */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3 font-mono text-xs">
              
              {/* Field Wajib: PIN Otentikasi Pendaftaran */}
              <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-700/60 space-y-1.5 shadow-inner">
                <label className="block text-[11px] font-bold text-red-300 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-red-500" />
                    PIN Otentikasi Pendaftaran *
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">Wajib Kode Otorisasi</span>
                </label>
                <input
                  type="password"
                  required
                  maxLength={10}
                  value={regPin}
                  onChange={(e) => setRegPin(e.target.value)}
                  placeholder="Masukkan 4 digit PIN Otorisasi Rahasia Komando"
                  className="w-full px-3 py-2 bg-black/80 border border-red-700/80 rounded-lg text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none focus:border-red-500 font-mono tracking-widest"
                />
                <p className="text-[10px] text-zinc-400 font-mono">
                  * Registrasi personel intelijen baru mewajibkan otentikasi PIN resmi dari Markas Komando.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Username / Login ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="e.g. siber09"
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-700/80 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Passcode Otorisasi *
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Kunci Rahasia"
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-700/80 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Callsign Personel *
                  </label>
                  <input
                    type="text"
                    required
                    value={regCallsign}
                    onChange={(e) => setRegCallsign(e.target.value)}
                    placeholder="e.g. BADAK-04"
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-700/80 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Nomor Badge Intel *
                  </label>
                  <input
                    type="text"
                    required
                    value={regBadge}
                    onChange={(e) => setRegBadge(e.target.value)}
                    placeholder="e.g. IN-7714"
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-700/80 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Peran Operasional
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as OperatorRole)}
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-700/80 rounded-xl text-zinc-100 focus:outline-none focus:border-red-600 font-bold"
                  >
                    <option value="OPERATOR">OPERATOR (Pengguna Biasa)</option>
                    <option value="ADMIN">ADMIN (Hak Akses Penuh)</option>
                    <option value="COMMANDER">COMMANDER</option>
                    <option value="INTEL_ANALYST">INTEL ANALYST</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                    Tingkat Clearance
                  </label>
                  <select
                    value={regClearance}
                    onChange={(e) => setRegClearance(e.target.value as ClearanceLevel)}
                    className="w-full px-3 py-2 bg-black/60 border border-zinc-700/80 rounded-xl text-zinc-100 focus:outline-none focus:border-red-600"
                  >
                    <option value="TOP SECRET">TOP SECRET</option>
                    <option value="SECRET">SECRET</option>
                    <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                    <option value="RESTRICTED">RESTRICTED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                  Satuan / Divisi Operasional
                </label>
                <input
                  type="text"
                  required
                  value={regUnit}
                  onChange={(e) => setRegUnit(e.target.value)}
                  placeholder="e.g. Direktorat Operasi Intelijen Siber"
                  className="w-full px-3 py-2 bg-black/60 border border-zinc-700/80 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-600"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold tracking-widest text-xs uppercase shadow-glow-red transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>DAFTARKAN & BUAT SESI BARU</span>
              </button>
            </form>
          )}
        </div>

        {/* Card Footer */}
        <div className="px-6 py-3 bg-[#060a14] border-t border-zinc-800/80 text-center">
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            Sistem Komando Terpadu • Republik Indonesia • Hak Akses Dibatasi
          </p>
        </div>
      </div>
    </div>
  );
};
