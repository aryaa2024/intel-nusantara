import React, { useState } from 'react';
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
import { SessionTimeoutManager } from './components/SessionTimeoutManager';
import { NewsItem, LogEntry } from './types';

const MainLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Cross-module states
  const [logbookPreload, setLogbookPreload] = useState<Partial<LogEntry> | null>(null);
  const [aiInitialQuery, setAiInitialQuery] = useState<string>('');

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
