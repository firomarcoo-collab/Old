import React, { useEffect, useState } from 'react';
import { GitBranch, Sparkles, Globe, ShieldCheck, ExternalLink, Cpu } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
}

export const Header: React.FC<HeaderProps> = ({ lang, onToggleLang }) => {
  const t = translations[lang];
  const [serverOk, setServerOk] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setServerOk(Boolean(data.hasApiKey));
      })
      .catch(() => setServerOk(false));
  }, []);

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Title */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <div className="flex items-center -space-x-1.5">
                  <GitBranch className="w-5 h-5 text-purple-400" />
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  {t.appTitle}
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                  v2.5 • AI Studio
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block mt-0.5">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Right Actions: Status & Language Toggle */}
          <div className="flex items-center gap-3">
            {/* Status Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 text-xs">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-300 font-medium">Gemini 3.8 Flash</span>
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    serverOk === true ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    serverOk === true ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
              </span>
              <span className="text-[11px] text-slate-400">
                {serverOk === true ? (lang === 'ar' ? 'جاهز' : 'Ready') : (lang === 'ar' ? 'يتصل...' : 'Connecting...')}
              </span>
            </div>

            {/* AI Studio Docs Link */}
            <a
              href="https://aistudio.google.com"
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-colors"
            >
              <span>Google AI Studio</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {/* Language Toggle */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all cursor-pointer shadow-sm shadow-indigo-500/10"
              title="Toggle Language / تبديل اللغة"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{t.languageToggle}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
