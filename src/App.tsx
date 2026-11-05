import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { DailyLogbook } from './pages/DailyLogbook';
import { TargetProfiling } from './pages/TargetProfiling';
import { AIThreatAnalysis } from './pages/AIThreatAnalysis';
import { UserManagement } from './pages/UserManagement';
import { SecurityRiskManagement } from './pages/SecurityRiskManagement';
import { SecurityAssessmentPage } from './pages/SecurityAssessment';
import { StaffTrackingPage } from './pages/StaffTracking';
import { AutomatedReportingPage } from './pages/AutomatedReporting';
import { SituationalIntelligencePage } from './pages/SituationalIntelligence';
import { SessionTimeoutManager } from './components/SessionTimeoutManager';
import { NewsItem, LogEntry } from './types';

const MainLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Cross-module states
  const [logbookPreload, setLogbookPreload] = useState<Partial<LogEntry> | null>(null);
  const [aiInitialQuery, setAiInitialQuery] = useState<string>('');

  // Mode Berbagi Publik Tanpa Login (Strict Read-Only)
  const [isPublicShareMode, setIsPublicShareMode] = useState<boolean>(() => {
    try {
      const hasQuery = window.location.search.includes('share=');
      const hasPath = window.location.pathname.includes('/share') || window.location.pathname.includes('/view/dashboard');
      const hasHash = window.location.hash.includes('share');
      return hasQuery || hasPath || hasHash;
    } catch {
      return false;
    }
  });

  // Ambil token share jika ada
  const publicShareToken = useMemo(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('share')) return searchParams.get('share');
      if (window.location.hash) {
        const hashMatch = window.location.hash.match(/share\/(?:report\/)?([^/?#]+)/i);
        if (hashMatch) return hashMatch[1];
      }
      const pathMatch = window.location.pathname.match(/share\/(?:report\/)?([^/?#]+)/i);
      if (pathMatch) return pathMatch[1];
    } catch {
      // fallback
    }
    return 'PUBLIC_GUEST';
  }, []);

  // Monitor perubahan hash URL (misal user paste link hash di browser aktif)
  useEffect(() => {
    const handleHashOrUrlChange = () => {
      const hasQuery = window.location.search.includes('share=');
      const hasPath = window.location.pathname.includes('/share') || window.location.pathname.includes('/view/dashboard');
      const hasHash = window.location.hash.includes('share');
      setIsPublicShareMode(hasQuery || hasPath || hasHash);
    };

    window.addEventListener('hashchange', handleHashOrUrlChange);
    window.addEventListener('popstate', handleHashOrUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleHashOrUrlChange);
      window.removeEventListener('popstate', handleHashOrUrlChange);
    };
  }, []);

  // Keluar dari mode publik ke form login biasa
  const handleExitToLogin = () => {
    try {
      const cleanUrl = window.location.origin + window.location.pathname.replace(/\/share.*$/, '');
      window.history.replaceState({}, document.title, cleanUrl);
    } catch {
      // fallback
    }
    setIsPublicShareMode(false);
  };

  // Jika diakses via Public Share Link, render langsung TANPA REQUIRE LOGIN
  if (isPublicShareMode) {
    return (
      <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
        <SituationalIntelligencePage 
          isReadOnly={true}
          publicShareToken={publicShareToken}
          onExitToLogin={handleExitToLogin}
        />
      </div>
    );
  }

  // If user is not authenticated, render Login page (Protected Route)
  if (!isAuthenticated) {
    return <Login />;
  }

  // Handle escalating from News to Daily Logbook
  const handleNavigateToLogbookWithNews = (news: NewsItem) => {
    const cat = news.category.toString().toLowerCase();
    setLogbookPreload({
      title: `[Eskalasi Feed] ${news.title}`,
      description: `Sumber: ${news.source}\nWilayah: ${news.region}\nKategori Intel: ${news.category.toUpperCase()}\n\nRingkasan Berita:\n${news.summary}`,
      severity: news.threatLevel,
      category: (cat === 'cyber') ? 'Cyber Attack' :
                (cat === 'kriminal' || cat === 'crime') ? 'Crime' :
                (cat === 'korupsi') ? 'Crime' :
                (cat === 'terorisme' || cat === 'teror') ? 'Terrorism Suspected' :
                (cat === 'demo' || cat === 'unjuk rasa') ? 'Civil Unrest' :
                (cat === 'bencana' || cat === 'hazard') ? 'Hazard' :
                (cat === 'politik') ? 'DISINFORMATION' :
                'PHYSICAL_SECURITY'
    });
    setActiveTab('logbook');
  };

  // Handle sending query to AI Threat Analysis
  const handleNavigateToAIAnalysis = (query: string) => {
    setAiInitialQuery(query);
    setActiveTab('ai-analysis');
  };

  // Handle escalating from any module to Daily Logbook
  const handleEscalateToLogbook = (log: Partial<LogEntry>) => {
    setLogbookPreload(log);
    setActiveTab('logbook');
  };

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Auto-Logout Inactivity Monitor (15 Min SOC Standard) */}
      <SessionTimeoutManager />

      {/* Top Header */}
      <Header 
        onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)} 
        isMobileNavOpen={isMobileNavOpen}
      />

      <div className="flex-1 flex">
        {/* Sidebar Nav */}
        <Sidebar 
          activeTab={activeTab} 
          onSelectTab={setActiveTab}
          isOpenMobile={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 bg-[#05070c] tactical-grid-bg pb-16 md:pb-8">
          {/* Core Operasional Modules */}
          {activeTab === 'dashboard' && (
            <Dashboard 
              onNavigateToLogbookWithNews={handleNavigateToLogbookWithNews}
              onNavigateToAIAnalysis={handleNavigateToAIAnalysis}
            />
          )}

          {activeTab === 'logbook' && (
            <DailyLogbook 
              initialPreload={logbookPreload}
              onClearPreload={() => setLogbookPreload(null)}
            />
          )}

          {activeTab === 'osint' && (
            <TargetProfiling 
              onAnalyzeTargetWithAI={handleNavigateToAIAnalysis}
            />
          )}

          {activeTab === 'ai-analysis' && (
            <AIThreatAnalysis 
              initialQuery={aiInitialQuery}
              onClearInitialQuery={() => setAiInitialQuery('')}
              onEscalateToLogbook={handleEscalateToLogbook}
            />
          )}

          {/* Extended Modules: SRM, Assessment, Tracking, Reporting */}
          {activeTab === 'srm' && (
            <SecurityRiskManagement 
              onEscalateToLogbook={handleEscalateToLogbook}
            />
          )}

          {activeTab === 'assessment' && (
            <SecurityAssessmentPage 
              onEscalateToLogbook={handleEscalateToLogbook}
            />
          )}

          {activeTab === 'tracking' && (
            <StaffTrackingPage 
              onEscalateToLogbook={handleEscalateToLogbook}
            />
          )}

          {activeTab === 'reporting' && (
            <AutomatedReportingPage />
          )}

          {activeTab === 'situational' && (
            <SituationalIntelligencePage isReadOnly={false} />
          )}

          {/* Admin User Management */}
          {activeTab === 'users' && (
            <UserManagement />
          )}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
};

export default App;
