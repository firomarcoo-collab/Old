import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  FileCode,
  PlayCircle,
  FolderGit2,
  BotMessageSquare,
  Sparkles,
  GitBranch,
  Github,
  CheckCircle,
  Cpu,
} from 'lucide-react';
import { Language } from './types';
import { translations } from './data/translations';
import { Header } from './components/Header';
import { IctSmcBotHub } from './components/IctSmcBotHub';
import { SetupGuide } from './components/SetupGuide';
import { WorkflowBuilder } from './components/WorkflowBuilder';
import { ActionSimulator } from './components/ActionSimulator';
import { RepoInspector } from './components/RepoInspector';
import { GeminiChat } from './components/GeminiChat';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [activeTab, setActiveTab] = useState<'ictBot' | 'guide' | 'workflows' | 'simulator' | 'inspector' | 'assistant'>('ictBot');

  const t = translations[lang];

  useEffect(() => {
    // Set HTML dir attribute for RTL support
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  interface TabItem {
    id: 'ictBot' | 'guide' | 'workflows' | 'simulator' | 'inspector' | 'assistant';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }

  const tabs: TabItem[] = [
    {
      id: 'ictBot',
      label: t.tabs.ictBot,
      icon: Cpu,
      badge: 'Trading Bot',
    },
    {
      id: 'guide',
      label: t.tabs.guide,
      icon: BookOpen,
      badge: lang === 'ar' ? 'ربط غيت هب' : 'GitHub Link',
    },
    {
      id: 'workflows',
      label: t.tabs.workflows,
      icon: FileCode,
      badge: 'YAML',
    },
    {
      id: 'simulator',
      label: t.tabs.simulator,
      icon: PlayCircle,
      badge: 'Live CI',
    },
    {
      id: 'inspector',
      label: t.tabs.inspector,
      icon: FolderGit2,
    },
    {
      id: 'assistant',
      label: t.tabs.assistant,
      icon: BotMessageSquare,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <Header lang={lang} onToggleLang={toggleLanguage} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="transition-all duration-200">
          {activeTab === 'ictBot' && (
            <IctSmcBotHub lang={lang} />
          )}

          {activeTab === 'guide' && (
            <SetupGuide
              lang={lang}
              onNavigateToWorkflows={() => setActiveTab('workflows')}
              onNavigateToSimulator={() => setActiveTab('simulator')}
            />
          )}

          {activeTab === 'workflows' && (
            <WorkflowBuilder lang={lang} />
          )}

          {activeTab === 'simulator' && (
            <ActionSimulator lang={lang} />
          )}

          {activeTab === 'inspector' && (
            <RepoInspector lang={lang} />
          )}

          {activeTab === 'assistant' && (
            <GeminiChat lang={lang} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>
              Google Gemini 3.8 Flash + GitHub Actions • Google Cloud AI Studio
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://aistudio.google.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              Google AI Studio
            </a>
            <span>•</span>
            <a
              href="https://docs.github.com/en/actions"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              GitHub Actions Docs
            </a>
            <span>•</span>
            <a
              href="https://github.com/google-gemini"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              @google/genai SDK
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
