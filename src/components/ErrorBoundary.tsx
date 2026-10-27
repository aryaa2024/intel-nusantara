import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Trash2, Terminal } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Intel Nusantara component tree:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetCache = () => {
    try {
      // Clear service workers and local storage caches
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister();
          }
        });
      }
      if ('caches' in window) {
        caches.keys().then((names) => {
          for (const name of names) {
            caches.delete(name);
          }
        });
      }
      // Clear session keys that might be corrupt
      localStorage.removeItem('intel_active_session_v3');
      localStorage.removeItem('automated_generated_reports');
      localStorage.removeItem('staff_breach_logs');
      sessionStorage.clear();
    } catch (e) {
      console.error('Error clearing cache', e);
    }
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#05070c] tactical-grid-bg flex flex-col items-center justify-center p-4 font-mono text-zinc-100">
          <div className="w-full max-w-xl bg-[#090e1a] border-2 border-red-600 rounded-2xl p-6 sm:p-8 shadow-glow-red space-y-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-600 flex items-center justify-center mx-auto shadow-glow-red">
              <ShieldAlert className="w-8 h-8 text-red-500 animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="inline-block px-3 py-1 rounded bg-red-950 text-red-400 border border-red-700/60 text-xs font-bold uppercase tracking-wider">
                SYSTEM ANOMALY RECOVERY // PROTOKOL SOC-FAILSAFE
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                TERJADI ANOMALI RUNTIME KOMPONEN
              </h1>
              <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                Sistem Intel Nusantara mendeteksi interupsi pada sesi antarmuka. Silakan muat ulang terminal atau pulihkan cache sesi untuk melanjutkan operasi.
              </p>
            </div>

            {/* Error Message Box */}
            <div className="p-3 bg-black/80 border border-zinc-800 rounded-xl text-left text-[11px] text-red-300 font-mono overflow-auto max-h-32">
              <div className="flex items-center gap-1.5 text-zinc-500 font-bold mb-1">
                <Terminal className="w-3.5 h-3.5" />
                <span>DIAGNOSTIK TEKNIS:</span>
              </div>
              <p className="font-semibold">{this.state.error?.message || 'Unknown runtime error'}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl border border-zinc-700 flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>MUAT ULANG TERMINAL</span>
              </button>

              <button
                onClick={this.handleResetCache}
                className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-glow-red flex items-center justify-center gap-2 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>RESET CACHE & RECOVERY</span>
              </button>
            </div>

            <div className="pt-2 text-[10px] text-zinc-500">
              Intel Nusantara • Sistem Komando & Operasi Keamanan Terpadu
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
