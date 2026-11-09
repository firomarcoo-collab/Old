import React, { useState } from 'react';
import {
  Play,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
  GitPullRequest,
  ShieldAlert,
  Code2,
  RefreshCw,
  FileDiff,
  MessageSquare,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface ActionSimulatorProps {
  lang: Language;
}

const sampleDiffs = [
  {
    title: {
      ar: 'إضافة توثيق JWT مع خطأ أمني (مفتاح مكشوف وثغرة SQL)',
      en: 'JWT Auth with Security Vulnerability (Hardcoded secret & SQL injection)',
    },
    prTitle: 'feat: add user authentication and login query',
    diff: `diff --git a/src/auth.js b/src/auth.js
new file mode 100644
index 0000000..f8a291b
--- /dev/null
+++ b/src/auth.js
@@ -0,0 +1,24 @@
+const jwt = require('jsonwebtoken');
+const db = require('./database');
+
+// HARDCODED SECRET (Security Issue)
+const JWT_SECRET = "super_secret_production_key_12345";
+
+async function login(username, password) {
+  // SQL INJECTION VULNERABILITY!
+  const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";
+  const user = await db.query(query);
+  
+  if (!user || user.length === 0) {
+    throw new Error("Invalid credentials");
+  }
+  
+  const token = jwt.sign({ id: user[0].id, role: user[0].role }, JWT_SECRET, {
+    expiresIn: '30d'
+  });
+  
+  return { token, user: user[0] };
+}
+
+module.exports = { login };`,
  },
  {
    title: {
      ar: 'تحسين أداء React والذاكرة المؤقتة (Cache & Memo)',
      en: 'React Performance Optimization & Memoization',
    },
    prTitle: 'perf: optimize expensive data table calculations and rendering',
    diff: `diff --git a/src/components/AnalyticsTable.tsx b/src/components/AnalyticsTable.tsx
index 1024..b402 100644
--- a/src/components/AnalyticsTable.tsx
+++ b/src/components/AnalyticsTable.tsx
@@ -10,8 +10,12 @@ export function AnalyticsTable({ rawItems, filter }) {
-  const filtered = rawItems.filter(item => item.category === filter);
-  const totalRevenue = filtered.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
+  // Optimized with useMemo to prevent unneeded recalculations
+  const filtered = useMemo(() => {
+    return rawItems.filter(item => item.category === filter);
+  }, [rawItems, filter]);
+
+  const totalRevenue = useMemo(() => {
+    return filtered.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
+  }, [filtered]);
 
   return (
     <div className="table-container">`,
  },
];

export const ActionSimulator: React.FC<ActionSimulatorProps> = ({ lang }) => {
  const t = translations[lang];
  const [selectedSample, setSelectedSample] = useState(0);
  const [prTitle, setPrTitle] = useState(sampleDiffs[0].prTitle);
  const [prDiff, setPrDiff] = useState(sampleDiffs[0].diff);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [reviewResult, setReviewResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelectSample = (idx: number) => {
    setSelectedSample(idx);
    setPrTitle(sampleDiffs[idx].prTitle);
    setPrDiff(sampleDiffs[idx].diff);
    setReviewResult(null);
    setLogs([]);
  };

  const runSimulation = async () => {
    setIsRunning(true);
    setReviewResult(null);
    setError(null);
    setLogs([
      '🚀 Starting GitHub Actions Runner (ubuntu-latest)...',
      '📦 Job: gemini-code-review',
    ]);

    // Simulated CI steps progression
    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        '✓ actions/checkout@v4: Fetched branch ref HEAD with fetch-depth: 0',
      ]);
    }, 400);

    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        '✓ actions/setup-node@v4: Node.js v20.12.0 ready',
        '✓ npm install @google/genai: installed 1 package in 0.9s',
      ]);
    }, 900);

    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        '🔐 Authenticating with Google Gemini via GEMINI_API_KEY...',
        '🤖 Model: gemini-3.8-flash (Reasoning enabled)',
        '📡 Sending PR Diff payload (server-side @google/genai)...',
      ]);
    }, 1500);

    try {
      const response = await fetch('/api/gemini/review-pr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prTitle,
          prDiff,
          repoName: 'my-org/my-app',
          language: lang,
          strictness: 'standard',
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to generate review');
      }

      setLogs((prev) => [
        ...prev,
        '✓ Gemini 3.8 Flash analysis complete!',
        '📝 Posting formatted review comment to GitHub Pull Request...',
        '🎉 Review posted successfully to PR #42!',
      ]);
      setReviewResult(data.review);
    } catch (err: any) {
      setError(err?.message || 'Error executing Gemini API review');
      setLogs((prev) => [
        ...prev,
        `❌ Error: ${err?.message || 'Failed to call Gemini API'}`,
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title & Description */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <GitPullRequest className="w-5 h-5 text-emerald-400" />
              {lang === 'ar'
                ? 'محاكي واختبار سير عمل مراجعة الكود مع Gemini'
                : 'Live GitHub Actions & Gemini Review Simulator'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {lang === 'ar'
                ? 'جرّب كيف يقوم Gemini بتحليل تغييرات الكود واكتشاف الثغرات الأمنية كما يحدث تماماً داخل سير عمل GitHub Actions.'
                : 'Experience how Gemini inspects code diffs and catches bugs/security vulnerabilities directly in CI/CD.'}
            </p>
          </div>

          <button
            onClick={runSimulation}
            disabled={isRunning || !prDiff.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer shrink-0"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{lang === 'ar' ? 'جاري التشغيل...' : 'Running CI Job...'}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{lang === 'ar' ? 'تشغيل محاكاة GitHub Action' : 'Run GitHub Action Simulation'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Selection */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {lang === 'ar' ? 'اختر نموذج تجريبي أو الصق الـ Diff الخاص بك:' : 'Select Sample Diff or Paste Your Own:'}
        </label>
        <div className="flex flex-wrap gap-2">
          {sampleDiffs.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSample(idx)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
                selectedSample === idx
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <FileDiff className="w-3.5 h-3.5" />
              <span>{sample.title[lang]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Diff Input Area */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 flex-1 mr-4">
            <span className="text-slate-500 font-mono">PR Title:</span>
            <input
              type="text"
              value={prTitle}
              onChange={(e) => setPrTitle(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 text-xs w-full max-w-md focus:outline-none focus:border-indigo-500"
            />
          </div>
          <span className="text-slate-500 font-mono text-[11px]">Git Diff Editor</span>
        </div>

        <textarea
          value={prDiff}
          onChange={(e) => setPrDiff(e.target.value)}
          rows={10}
          className="w-full p-4 bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed focus:outline-none resize-y"
          placeholder={t.liveDiffPlaceholder}
        />
      </div>

      {/* GitHub Actions Console Terminal */}
      {logs.length > 0 && (
        <div className="rounded-2xl bg-black border border-slate-800 overflow-hidden shadow-2xl font-mono text-xs">
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300 font-semibold">
                GitHub Actions Runner Output
              </span>
            </div>
            {isRunning && (
              <span className="flex items-center gap-1.5 text-[11px] text-amber-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Executing job...</span>
              </span>
            )}
          </div>

          <div className="p-4 space-y-1.5 max-h-64 overflow-y-auto scrollbar-thin">
            {logs.map((log, i) => (
              <div
                key={i}
                className={`leading-relaxed ${
                  log.startsWith('✓')
                    ? 'text-emerald-400'
                    : log.startsWith('❌')
                    ? 'text-rose-400 font-bold'
                    : log.startsWith('🔐') || log.startsWith('🤖')
                    ? 'text-cyan-300'
                    : 'text-slate-400'
                }`}
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message if any */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
          <div>
            <div className="font-bold">Execution Error</div>
            <div>{error}</div>
          </div>
        </div>
      )}

      {/* Realistic GitHub PR Comment Output */}
      {reviewResult && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
          {/* GitHub PR Comment Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                G
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">
                    gemini-code-reviewer[bot]
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Bot
                  </span>
                  <span className="text-slate-500 text-xs">commented just now</span>
                </div>
                <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
                  Powered by Google Gemini 3.8 Flash • Automated PR Review
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>GitHub Comment Live</span>
            </div>
          </div>

          {/* Formatted Markdown Content */}
          <div className="p-6 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
            {reviewResult}
          </div>
        </div>
      )}
    </div>
  );
};
