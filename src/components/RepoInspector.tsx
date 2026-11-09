import React, { useState } from 'react';
import {
  Search,
  Star,
  GitFork,
  AlertCircle,
  BookOpen,
  Sparkles,
  Loader2,
  FolderTree,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface RepoInspectorProps {
  lang: Language;
}

export const RepoInspector: React.FC<RepoInspectorProps> = ({ lang }) => {
  const t = translations[lang];
  const [repoInput, setRepoInput] = useState('expressjs/express');
  const [loading, setLoading] = useState(false);
  const [repoData, setRepoData] = useState<any | null>(null);
  const [readmeContent, setReadmeContent] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisReport, setAnalysisReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRepo = async (targetRepo = repoInput) => {
    if (!targetRepo.includes('/')) {
      setError(
        lang === 'ar'
          ? 'يرجى إدخال اسم المستودع بصيغة owner/repo (مثال: vercel/next.js)'
          : 'Please enter repository in owner/repo format (e.g. vercel/next.js)'
      );
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisReport(null);

    try {
      const res = await fetch(`https://api.github.com/repos/${targetRepo.trim()}`);
      if (!res.ok) {
        throw new Error(
          lang === 'ar'
            ? 'لم نتمكن من العثور على هذا المستودع. تأكد من صحة الاسم.'
            : 'Could not find this repository on GitHub. Please check the name.'
        );
      }
      const data = await res.json();
      setRepoData(data);

      // Fetch README
      try {
        const readmeRes = await fetch(
          `https://raw.githubusercontent.com/${targetRepo.trim()}/${data.default_branch || 'main'}/README.md`
        );
        if (readmeRes.ok) {
          const text = await readmeRes.text();
          setReadmeContent(text.slice(0, 5000));
        } else {
          setReadmeContent('');
        }
      } catch {
        setReadmeContent('');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch repository details');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeWithGemini = async () => {
    if (!repoData) return;
    setIsAnalyzing(true);
    setAnalysisReport(null);

    try {
      const filesPayload = [
        {
          path: 'README.md',
          content: readmeContent || `Repository: ${repoData.full_name}\nDescription: ${repoData.description}\nLanguage: ${repoData.language}`,
        },
      ];

      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoName: repoData.full_name,
          files: filesPayload,
          language: lang,
          focus: 'architecture-and-ci-actions',
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to analyze repository');
      }

      setAnalysisReport(data.result);
    } catch (err: any) {
      setError(err?.message || 'Error analyzing repository with Gemini');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FolderTree className="w-5 h-5 text-cyan-400" />
          {lang === 'ar' ? 'مستكشف المستودعات وفحص الأكواد بالذكاء الاصطناعي' : 'GitHub Repository AI Auditor & Inspector'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {lang === 'ar'
            ? 'أدخل أي مستودع GitHub عام لجلبه وفحصه فوراً بواسطة Gemini 3.8 Flash واقتراح بنية سير عمل Actions تناسبه.'
            : 'Inspect any public GitHub repository and receive tailored Gemini CI/CD workflow recommendations.'}
        </p>

        {/* Input Bar */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
            <input
              type="text"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchRepo()}
              placeholder="e.g. facebook/react or your-username/your-repo"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            onClick={() => fetchRepo()}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-cyan-600/30 shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>{lang === 'ar' ? 'فحص المستودع' : 'Fetch Repo'}</span>
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          <span className="text-slate-500 text-[11px]">{lang === 'ar' ? 'أمثلة سريعة:' : 'Quick examples:'}</span>
          {['expressjs/express', 'tailwindlabs/tailwindcss', 'fastapi/fastapi'].map((example) => (
            <button
              key={example}
              onClick={() => {
                setRepoInput(example);
                fetchRepo(example);
              }}
              className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] cursor-pointer"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Repository Card */}
      {repoData && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white hover:text-cyan-400 transition-colors">
                  <a href={repoData.html_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
                    <span>{repoData.full_name}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                  {repoData.default_branch}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {repoData.description || 'No description provided.'}
              </p>
            </div>

            <button
              onClick={handleAnalyzeWithGemini}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 cursor-pointer shrink-0"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{lang === 'ar' ? 'Gemini يحلل المستودع...' : 'Gemini Analyzing...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>{lang === 'ar' ? 'تحليل معماري عبر Gemini' : 'Gemini Architectural Audit'}</span>
                </>
              )}
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <Star className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-xs text-slate-500">Stars</div>
                <div className="text-sm font-bold text-white">{repoData.stargazers_count.toLocaleString()}</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <GitFork className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-xs text-slate-500">Forks</div>
                <div className="text-sm font-bold text-white">{repoData.forks_count.toLocaleString()}</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-xs text-slate-500">Language</div>
                <div className="text-sm font-bold text-white">{repoData.language || 'Multi-language'}</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-xs text-slate-500">Open Issues</div>
                <div className="text-sm font-bold text-white">{repoData.open_issues_count.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Analysis Report */}
          {analysisReport && (
            <div className="mt-6 p-6 rounded-2xl bg-slate-950 border border-indigo-500/30 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>
                  {lang === 'ar'
                    ? `تقرير تحليل Gemini 3.8 Flash لمستودع ${repoData.full_name}:`
                    : `Gemini 3.8 Flash Analysis for ${repoData.full_name}:`}
                </span>
              </div>
              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                {analysisReport}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
