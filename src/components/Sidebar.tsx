import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Crosshair, 
  Cpu, 
  LogOut, 
  ShieldCheck, 
  User as UserIcon,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type ActiveTab = 'dashboard' | 'logbook' | 'osint' | 'ai-analysis';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onSelectTab, 
  isOpenMobile, 
  onCloseMobile 
}) => {
  const { currentUser, logout } = useAuth();

  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard / News Aggregator',
      shortLabel: 'Dashboard & News',
      icon: LayoutDashboard,
      badge: 'LIVE INTEL',
      badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-800/60'
    },
    {
      id: 'logbook' as ActiveTab,
      label: 'Daily Logbook (SOC Standard)',
      shortLabel: 'Daily Logbook',
      icon: BookOpen,
      badge: 'INCIDENTS',
      badgeColor: 'bg-red-950 text-red-400 border-red-800/60'
    },
    {
      id: 'osint' as ActiveTab,
      label: 'Target Profiling & OSINT',
      shortLabel: 'Target Profiling',
      icon: Crosshair,
      badge: 'PROFILER',
      badgeColor: 'bg-amber-950 text-amber-400 border-amber-800/60'
    },
    {
      id: 'ai-analysis' as ActiveTab,
      label: 'AI Threat Analysis',
      shortLabel: 'AI Analysis',
      icon: Cpu,
      badge: 'NEURAL AI',
      badgeColor: 'bg-cyan-950 text-cyan-400 border-cyan-800/60'
    }
  ];

  const handleSelect = (tab: ActiveTab) => {
    onSelectTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed md:sticky top-0 md:top-[61px] left-0 z-50 md:z-30 h-full md:h-[calc(100vh-61px)] w-72 bg-[#080c16] border-r border-zinc-800/90 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Section */}
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Header on Mobile drawer */}
          <div className="flex md:hidden items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
              <span className="font-mono text-sm font-bold text-white tracking-widest uppercase">
                PANEL NAVIGASI
              </span>
            </div>
            <button 
              onClick={onCloseMobile}
              className="text-zinc-400 hover:text-white text-xs font-mono px-2 py-1 bg-zinc-900 border border-zinc-800 rounded"
            >
              TUTUP
            </button>
          </div>

          {/* Module Navigation List */}
          <div className="space-y-1.5">
            <div className="px-3 py-1 flex items-center justify-between text-[11px] font-mono tracking-wider text-zinc-400 uppercase font-semibold">
              <span>MODUL OPERASIONAL</span>
              <Layers className="w-3.5 h-3.5 text-zinc-400" />
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full group relative flex items-center gap-3 px-3.5 py-3 rounded-xl font-mono text-xs transition-all duration-200 text-left ${
                    isActive
                      ? 'bg-red-950/40 text-white font-bold border border-red-600/60 shadow-[0_0_15px_rgba(220,38,38,0.25)]'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-900/80 border border-transparent hover:border-zinc-800'
                  }`}
                >
                  {/* Left Red Indicator line when active */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-red-600 rounded-r-md shadow-glow-red"></span>
                  )}

                  <div className={`p-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-red-600 text-white shadow-glow-red' 
                      : 'bg-zinc-900/90 text-zinc-400 group-hover:text-red-400 group-hover:bg-zinc-800'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="truncate font-semibold tracking-wide">
                      {item.label}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono tracking-widest ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                    isActive ? 'text-red-400 translate-x-0.5' : 'text-zinc-600 group-hover:text-zinc-400'
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Quick Stats Widget */}
          <div className="p-3.5 rounded-xl bg-[#0d1322] border border-zinc-800/80 shadow-inner">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
              <span className="flex items-center gap-1.5 text-red-400 font-semibold">
                <Activity className="w-3.5 h-3.5 animate-pulse" /> SOC RADAR STATUS
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">100% ONLINE</span>
            </div>
            <div className="space-y-1.5 text-[11px] font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Security Engine:</span>
                <span className="text-emerald-400 font-bold">V-SHIELD ACTIVE</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Threat Feed:</span>
                <span className="text-zinc-200">REALTIME SYNC</span>
              </div>
              <div className="w-full bg-zinc-800/80 rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-gradient-to-r from-red-600 to-emerald-500 h-1.5 rounded-full w-[85%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Operator Profile & Logout */}
        <div className="p-4 border-t border-zinc-800/90 bg-[#060911]/95">
          {currentUser ? (
            <div className="space-y-3">
              {/* Operator Dossier Box */}
              <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-start gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-red-600/40 flex items-center justify-center text-red-500 font-mono font-bold shadow-sm">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black"></span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono font-bold text-xs text-white truncate tracking-wider">
                      {currentUser.callsign}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-red-950 text-red-300 border border-red-700/60 rounded font-bold uppercase tracking-wider">
                      {currentUser.clearanceLevel}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-zinc-400 truncate mt-0.5">
                    Badge: <span className="text-zinc-200">{currentUser.badgeNumber}</span>
                  </p>
                  <p className="text-[9px] font-mono text-zinc-400 truncate">
                    {currentUser.unit}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-zinc-900 hover:bg-red-950/60 text-zinc-400 hover:text-red-400 border border-zinc-800 hover:border-red-700/60 font-mono text-xs font-semibold transition-all duration-200"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>TERMINATE SESSION (LOGOUT)</span>
              </button>
            </div>
          ) : (
            <div className="text-center font-mono text-xs text-zinc-500">
              Tidak ada sesi operator aktif
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
