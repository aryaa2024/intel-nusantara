import React, { useState, useEffect } from 'react';
import { Shield, Radio, Wifi, Lock, Menu, X, Bell, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onToggleMobileNav?: () => void;
  isMobileNavOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav, isMobileNavOpen }) => {
  const { currentUser } = useAuth();
  const [timeString, setTimeString] = useState<string>('');
  const [dateString, setDateString] = useState<string>('');
  const [latency] = useState<number>(14);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // WIB is UTC+7
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const wibDate = new Date(utc + (3600000 * 7));

      const hours = String(wibDate.getHours()).padStart(2, '0');
      const minutes = String(wibDate.getMinutes()).padStart(2, '0');
      const seconds = String(wibDate.getSeconds()).padStart(2, '0');
      setTimeString(`${hours}:${minutes}:${seconds} WIB`);

      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'short', 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      };
      setDateString(wibDate.toLocaleDateString('id-ID', options).toUpperCase());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070a12]/95 backdrop-blur-md border-b border-zinc-800/80 shadow-lg">
      <div className="px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Branding & Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile menu trigger */}
          <button
            onClick={onToggleMobileNav}
            className="md:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-red-500 hover:border-red-600/50 transition-colors"
            title="Navigasi Menu"
          >
            {isMobileNavOpen ? <X className="w-5 h-5 text-red-500" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo Badge */}
          <div className="relative group flex items-center justify-center">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg overflow-hidden border border-red-600/50 bg-black shadow-glow-red flex items-center justify-center transition-all duration-300 group-hover:border-red-500">
              <img 
                src="/logo.jpg" 
                alt="Intel Nusantara" 
                className="w-full h-full object-cover object-center transform scale-110"
                onError={(e) => {
                  // Fallback icon if image path issue
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            {/* Pulsing beacon dot on logo */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
          </div>

          {/* Brand Titles */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-mono tracking-widest text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                INTEL <span className="text-red-600 font-extrabold tracking-wider">NUSANTARA</span>
              </span>
              <span className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] font-mono tracking-wider bg-red-950/80 text-red-400 border border-red-700/50 rounded font-semibold">
                SOC v1.0
              </span>
            </div>
            <p className="text-[10px] sm:text-xs font-mono tracking-wider text-zinc-400 uppercase hidden sm:block">
              Monitoring <span className="text-red-600">|</span> Analysis <span className="text-red-600">|</span> Daily Logbook
            </p>
          </div>
        </div>

        {/* Center: Live Clock (WIB) */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 bg-zinc-950/80 border border-zinc-800 rounded-lg shadow-inner">
          <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs">
            <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span className="text-zinc-500">{dateString}</span>
          </div>
          <span className="text-zinc-700">|</span>
          <div className="font-mono font-bold text-red-400 tracking-wider text-xs sm:text-sm drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">
            {timeString || '--:--:-- WIB'}
          </div>
        </div>

        {/* Right: Security & Network Telemetry Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status Indicator: ONLINE / SECURE */}
          <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-600/30 text-emerald-400 font-mono text-[11px] sm:text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold tracking-wider">ONLINE</span>
            <span className="text-emerald-700 hidden sm:inline">•</span>
            <span className="text-emerald-300 hidden sm:inline flex items-center gap-1 font-semibold">
              <Lock className="w-3 h-3 text-emerald-400 inline" /> SECURE
            </span>
          </div>

          {/* Defense Readiness Level Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-xs">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-zinc-400 text-[11px]">DEFCON</span>
            <span className="text-amber-400 font-bold">3</span>
          </div>

          {/* Latency & Encryption */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-xs">
            <Wifi className="w-3.5 h-3.5 text-cyan-400" />
            <span>{latency}ms</span>
          </div>

          {/* Operator Callsign mini pill on mobile/tablet */}
          {currentUser && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="font-bold tracking-wider">{currentUser.callsign}</span>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
