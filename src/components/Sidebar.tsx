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
  ChevronRight, 
  Users, 
  Crown,
  ShieldAlert,
  ClipboardCheck,
  Navigation,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type ActiveTab = 
  | 'dashboard' 
  | 'logbook' 
  | 'osint' 
  | 'ai-analysis' 
  | 'srm' 
  | 'assessment' 
  | 'tracking' 
  | 'reporting' 
  | 'users';

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

  const coreNavItems = [
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

  const extendedNavItems = [
    {
      id: 'srm' as ActiveTab,
      label: 'Security Risk Management',
      shortLabel: 'SRM (ISO 31000)',
      icon: ShieldAlert,
      badge: 'ISO 31000',
      badgeColor: 'bg-orange-950 text-orange-400 border-orange-800/60'
    },
    {
      id: 'assessment' as ActiveTab,
      label: 'Security Assessment & GAP',
      shortLabel: 'Assessment',
      icon: ClipboardCheck,
      badge: 'ASIS INTL',
      badgeColor: 'bg-cyan-950 text-cyan-400 border-cyan-800/60'
    },
    {
      id: 'tracking' as ActiveTab,
      label: 'Staff Tracking & Geofencing',
      shortLabel: 'Staff Tracking',
      icon: Navigation,
      badge: 'GPS TELEMETRY',
      badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-800/60'
    },
    {
      id: 'reporting' as ActiveTab,
      label: 'Automated Reporting Engine',
      shortLabel: 'Reporting',
      icon: FileText,
      badge: 'DAILY/WEEK/MO',
      badgeColor: 'bg-amber-950 text-amber-400 border-amber-800/60'
    }
  ];

  const adminNavItems = currentUser?.role === 'ADMIN' ? [
    {
      id: 'users' as ActiveTab,
      label: 'Admin User Management',
      shortLabel: 'User Management',
      icon: Users,
      badge: 'ADMIN ONLY',
      badgeColor: 'bg-amber-950 text-amber-300 border-amber-600/70 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
    }
  ] : [];

  const handleSelect = (tab: ActiveTab) => {
    onSelectTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const renderNavList = (items: typeof coreNavItems) => {
    return items.map((item) => {
      const Icon = item.icon;
      const isActive = activeTab === item.id;

      return (
        <button
          key={item.id}
          onClick={() => handleSelect(item.id)}
          className={`w-full group relative flex items-center gap-3 px-3 py-2 rounded-xl font-mono text-xs transition-all duration-200 text-left ${
            isActive
              ? 'bg-red-950/40 text-white font-bold border border-red-600/60 shadow-[0_0_15px_rgba(220,38,38,0.25)]'
              : 'text-zinc-300 hover:text-white hover:bg-zinc-900/80 border border-transparent hover:border-zinc-800'
          }`}
        >
          {isActive && (
            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-red-600 rounded-r-md shadow-glow-red"></span>
          )}

          <div className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
            isActive 
              ? 'bg-red-600 text-white shadow-glow-red' 
              : 'bg-zinc-900/90 text-zinc-400 group-hover:text-red-400 group-hover:bg-zinc-800'
          }`}>
            <Icon className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="truncate font-semibold tracking-wide text-[11px]">
              {item.label}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[8px] px-1 py-0.2 rounded border font-mono tracking-widest ${item.badgeColor}`}>
                {item.badge}
              </span>
            </div>
          </div>

          <ChevronRight className={`w-3 h-3 text-zinc-600 transition-transform ${
            isActive ? 'text-red-400 translate-x-0.5' : 'group-hover:text-zinc-400 group-hover:translate-x-0.5'
          }`} />
        </button>
      );
    });
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
        <div className="p-3.5 space-y-4 overflow-y-auto flex-1">
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

          {/* Group 1: Core Operasional */}
          <div className="space-y-1">
            <div className="px-2.5 py-1 flex items-center justify-between text-[10px] font-mono tracking-wider text-zinc-500 uppercase font-bold">
              <span>OPERASIONAL & INTELIJEN</span>
              <Layers className="w-3 h-3 text-zinc-600" />
            </div>
            {renderNavList(coreNavItems)}
          </div>

          {/* Group 2: Extended Modules */}
          <div className="space-y-1 pt-2 border-t border-zinc-800/60">
            <div className="px-2.5 py-1 flex items-center justify-between text-[10px] font-mono tracking-wider text-red-500 uppercase font-bold">
              <span>EXTENDED MODULES</span>
              <Activity className="w-3 h-3 text-red-500" />
            </div>
            {renderNavList(extendedNavItems)}
          </div>

          {/* Group 3: Admin User Management */}
          {adminNavItems.length > 0 && (
            <div className="space-y-1 pt-2 border-t border-zinc-800/60">
              <div className="px-2.5 py-1 flex items-center justify-between text-[10px] font-mono tracking-wider text-amber-500 uppercase font-bold">
                <span>ADMINISTRASI</span>
                <Crown className="w-3 h-3 text-amber-500" />
              </div>
              {renderNavList(adminNavItems)}
            </div>
          )}
        </div>

        {/* Bottom Section: Operator Profile & Logout */}
        <div className="p-3 border-t border-zinc-800/90 bg-[#060a12]">
          {currentUser ? (
            <div className="space-y-2">
              <div className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-start gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-lg bg-zinc-950 border border-red-600/40 flex items-center justify-center text-red-500 font-mono font-bold shadow-sm">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-black"></span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono font-bold text-xs text-white truncate tracking-wider">
                      {currentUser.callsign}
                    </span>
                    <span className="text-[8px] font-mono px-1 py-0.5 bg-red-950 text-red-300 border border-red-700/60 rounded font-bold uppercase tracking-wider">
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

              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-zinc-900 hover:bg-red-950/60 text-zinc-400 hover:text-red-400 border border-zinc-800 hover:border-red-700/60 font-mono text-xs font-semibold transition-all duration-200"
              >
                <LogOut className="w-3.5 h-3.5 text-red-500" />
                <span>TERMINATE SESSION</span>
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
