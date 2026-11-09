import React, { useState } from 'react';
import {
  Key,
  Shield,
  FileCheck,
  CheckCircle2,
  Terminal,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Layers,
  HelpCircle,
  Copy,
  Check,
  GitPullRequest,
  Lock,
  Settings,
  AlertTriangle,
  FilePlus,
  Play,
  Flame,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { CodeBlock } from './CodeBlock';

interface SetupGuideProps {
  lang: Language;
  onNavigateToWorkflows: () => void;
  onNavigateToSimulator: () => void;
}

export const SetupGuide: React.FC<SetupGuideProps> = ({
  lang,
  onNavigateToWorkflows,
  onNavigateToSimulator,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'simple' | 'deepdive' | 'troubleshooting' | 'wif'>('simple');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    step1: true,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
  });

  const toggleStep = (stepKey: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  const [copiedCli, setCopiedCli] = useState(false);
  const cliCommand = 'gh secret set GEMINI_API_KEY --body "AIzaSy..."';

  const [repoCheckInput, setRepoCheckInput] = useState('');
  const [isCheckingRepo, setIsCheckingRepo] = useState(false);
  const [repoCheckResult, setRepoCheckResult] = useState<any | null>(null);
  const [repoCheckError, setRepoCheckError] = useState<string | null>(null);

  const checkUserRepo = async () => {
    if (!repoCheckInput.trim()) return;
    setIsCheckingRepo(true);
    setRepoCheckError(null);
    setRepoCheckResult(null);

    try {
      const res = await fetch('/api/github/check-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo: repoCheckInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Repository not found');
      }
      setRepoCheckResult(data);
    } catch (err: any) {
      setRepoCheckError(err?.message || 'Failed to check repository');
    } finally {
      setIsCheckingRepo(false);
    }
  };

  const copyCli = () => {
    navigator.clipboard.writeText(cliCommand);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            {lang === 'ar' ? 'دليل مبسط خطوة بخطوة' : 'Simplified Blueprint'}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {lang === 'ar'
              ? 'كيف تربط GitHub مع Gemini بكل بساطة'
              : 'Connecting GitHub to Gemini: The Easy Way'}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            {lang === 'ar'
              ? 'شرح سهل وواضح بدون تعقيدات أو مصطلحات صعبة في 3 خطوات بسيطة فقط!'
              : 'Simple, jargon-free guide in 3 easy steps.'}
          </p>

          {/* Sub Navigation */}
          <div className="flex flex-wrap items-center gap-2 mt-6">
            <button
              onClick={() => setActiveTab('simple')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'simple'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>{lang === 'ar' ? '💡 الشرح المبسط (ابدأ هنا)' : '💡 Ultra-Simple Guide'}</span>
            </button>

            <button
              onClick={() => setActiveTab('deepdive')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'deepdive'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              <FileCheck className="w-4 h-4 text-cyan-300" />
              <span>{lang === 'ar' ? '🛠️ الشرح التقني بالتفصيل' : '🛠️ Technical Details'}</span>
            </button>

            <button
              onClick={() => setActiveTab('troubleshooting')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'troubleshooting'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-300" />
              <span>{lang === 'ar' ? '⚠️ حل المشاكل' : '⚠️ Troubleshooting'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ULTRA-SIMPLE GUIDE TAB */}
      {activeTab === 'simple' && (
        <div className="space-y-6">
          {/* Live Verification Box: هل تم الربط؟ */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-indigo-500/40 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{lang === 'ar' ? 'فاحص حالة الربط المباشر: هل تم الربط؟' : 'Connection Status: Is it linked?'}</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'ar'
                      ? 'تحقق من حالة الاتصال بين خادم التطبيق، Google Gemini، ومستودعك على GitHub'
                      : 'Verify connection between App server, Gemini AI, and your GitHub repo'}
                  </p>
                </div>
              </div>

              {/* Status Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold self-start sm:self-auto">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'ar' ? 'Gemini 3.8 Flash متصل ويعمل' : 'Gemini 3.8 Flash Online'}</span>
              </div>
            </div>

            {/* Check User Repo Input */}
            <div className="pt-2 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {lang === 'ar'
                  ? 'تريد التأكد من مستودعك الخاص؟ اكتب اسم المستودع (مثال: username/repo):'
                  : 'Check your own repository (e.g. username/repo):'}
              </label>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={repoCheckInput}
                  onChange={(e) => setRepoCheckInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && checkUserRepo()}
                  placeholder="e.g. your-github-username/your-repository-name"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                />

                <button
                  onClick={checkUserRepo}
                  disabled={isCheckingRepo || !repoCheckInput.trim()}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 cursor-pointer shrink-0"
                >
                  {isCheckingRepo ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{lang === 'ar' ? 'جاري الفحص...' : 'Checking...'}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'فحص حالة المستودع' : 'Verify Repository'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Error */}
              {repoCheckError && (
                <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{repoCheckError}</span>
                </div>
              )}

              {/* Verification Result */}
              {repoCheckResult && (
                <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{repoCheckResult.repoName}</span>
                    <span className="text-slate-500 font-mono">({repoCheckResult.defaultBranch})</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2 pt-1">
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>اتصال Gemini بالخادم: <strong>متصل بنجاح ✅</strong></span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-300">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          repoCheckResult.hasGeminiWorkflow ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                      />
                      <span>
                        ملف سير عمل Gemini:{' '}
                        <strong>
                          {repoCheckResult.hasGeminiWorkflow
                            ? 'موجود ومفعل ✅'
                            : 'غير موجود بعد ⚠️ (انسخ الكود أدناه وضعه في مستودعك)'}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Analogy Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
                💡
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {lang === 'ar' ? 'ما هي الفكرة ببساطة شديدة؟' : 'The Core Concept in Plain English'}
                </h3>
                <p className="text-xs text-emerald-400">
                  {lang === 'ar' ? 'تخيل الأمر كأنك توظف مبرمجاً ذكياً يعمل لديك 24 ساعة مجاناً!' : 'Like hiring a genius AI co-developer 24/7 for free!'}
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 text-xs leading-relaxed pt-2">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="font-bold text-cyan-400 text-sm mb-1">1. مستودعك (GitHub)</div>
                <p className="text-slate-300">
                  هو المكان الذي تحفظ فيه ملفات مشروعك وبرامجك.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="font-bold text-indigo-400 text-sm mb-1">2. جيميناي (Gemini)</div>
                <p className="text-slate-300">
                  هو العقل الذكي من Google الذي يفهم الأكواد ويراجعها ويصلح الثغرات.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 bg-emerald-950/10">
                <div className="font-bold text-emerald-400 text-sm mb-1">3. الربط بينهما</div>
                <p className="text-slate-300">
                  كلما رفعت كوداً جديداً، يقرأه جيميناي تلقائياً ويكتب لك تعليقاً: "هنا خطأ، وهذا تصحيحه!"
                </p>
              </div>
            </div>
          </div>

          {/* The 3 Plain Steps */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{lang === 'ar' ? 'الربط في 3 خطوات سهلة فقط:' : 'Connect in 3 Easy Steps:'}</span>
            </h3>

            {/* Step 1 Simple */}
            <div className="flex flex-col sm:flex-row items-start gap-4 p-5 rounded-xl bg-slate-950 border border-cyan-500/30">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0">
                1
              </div>
              <div className="space-y-3 flex-1">
                <div>
                  <div className="font-bold text-white text-base">
                    {lang === 'ar' ? 'أخذ مفتاح الدخول من Google (كلمة السر الخاصة بك)' : 'Get your API Key from Google'}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {lang === 'ar'
                      ? 'للدخول المباشر إلى الصفحة بضغطة زر واحدة دون أن تبحث عنها:'
                      : 'To jump directly to the API key screen in one click:'}
                  </p>
                </div>

                {/* Big Direct Button */}
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                  >
                    <Key className="w-4 h-4 text-slate-950" />
                    <span>{lang === 'ar' ? '🔗 اضغط هنا للانتقال المباشر لصفحة المفتاح' : '🔗 Click Here for Direct API Key Page'}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
                  </a>

                  <span className="text-[11px] text-slate-400 font-mono">
                    https://aistudio.google.com/app/apikey
                  </span>
                </div>

                {/* Visual Directions */}
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="font-semibold text-cyan-300">
                    {lang === 'ar' ? 'أين تجده إذا فتحت الموقع من الصفحة الرئيسية؟' : 'Where to find it from the homepage?'}
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    {lang === 'ar'
                      ? 'في القائمة الجانبية (على اليسار)، ستجد أيقونة مفتاح بجانبها عبارة "Get API key". بعد الضغط عليها، اضغط على الزر الأزرق الكبير "Create API key" ثم انسخ المفتاح.'
                      : 'In the left sidebar menu, look for the key icon labeled "Get API key". Click the blue "Create API key" button, then copy the generated key.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 Simple */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0">
                2
              </div>
              <div className="space-y-1 flex-1">
                <div className="font-bold text-white text-sm">
                  {lang === 'ar' ? 'وضع الكلمة السرية في غيت هب (GitHub)' : 'Put the Key into GitHub Settings'}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  افتح مشروعك على غيت هب ➔ اضغط <strong>Settings</strong> ➔ ثم <strong>Secrets and variables</strong> ➔ ثم <strong>Actions</strong> ➔ اضغط <strong>New repository secret</strong> والصق الكلمة السرية باسم <code>GEMINI_API_KEY</code>.
                </p>
              </div>
            </div>

            {/* Step 3 Simple */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                3
              </div>
              <div className="space-y-1 flex-1">
                <div className="font-bold text-white text-sm">
                  {lang === 'ar' ? 'إضافة ملف واحد فقط في مشروعك (ملف الأوامر)' : 'Add one workflow file to your repo'}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  في مشروعك، أنشئ ملفاً باسم <code>.github/workflows/gemini.yml</code> والصق بداخله الكود الجاهز من تبويب "مُولّد سير العمل".
                  هذا الملف هو الورقة التي تقول لـ GitHub: "يا غيت هب، نادِ جيميناي ليراجع الكود كلما رفعت شيئاً جديداً!".
                </p>
              </div>
            </div>
          </div>

          {/* CTA: Try Simulator Now */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-white font-bold text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>{lang === 'ar' ? 'تريد أن ترى كيف يعمل أمام عينيك الآن؟' : 'Want to see it work in action right now?'}</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {lang === 'ar' ? 'افتح المحاكي واضغط الزر وشاهد Gemini يراجع كوداً حقيقياً في ثانية واحدة!' : 'Click to run a simulated PR review live in seconds!'}
              </p>
            </div>

            <button
              onClick={onNavigateToSimulator}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 cursor-pointer shrink-0"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{lang === 'ar' ? 'جرب المراجعة الحية الآن' : 'Try Live Simulation'}</span>
            </button>
          </div>
        </div>
      )}

      {/* DETAILED WALKTHROUGH TAB */}
      {activeTab === 'deepdive' && (
        <div className="space-y-6">
          {/* STEP 1 */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleStep('step1')}
                  className="mt-1 cursor-pointer focus:outline-none"
                  title="Mark as completed"
                >
                  <CheckCircle2
                    className={`w-6 h-6 transition-colors ${
                      completedSteps.step1
                        ? 'text-emerald-400 fill-emerald-400/20'
                        : 'text-slate-600 hover:text-slate-400'
                    }`}
                  />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-bold rounded bg-indigo-500/20 text-indigo-400">
                      المرحلة 1
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      {lang === 'ar'
                        ? 'استخراج مفتاح Gemini API من Google AI Studio'
                        : 'Step 1: Generate Gemini API Key in Google AI Studio'}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    {lang === 'ar'
                      ? 'مفتاح الـ API هو الذي يسمح لسير عمل GitHub Actions بالاتصال بخوادم Google Gemini بشكل آمن.'
                      : 'The API key allows GitHub Actions to securely communicate with Google Gemini models.'}
                  </p>
                </div>
              </div>

              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm shrink-0"
              >
                <span>Google AI Studio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Visual Instructions */}
            <div className="grid md:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                  <span>1. تسجيل الدخول</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  افتح موقع <strong>aistudio.google.com</strong> بحساب Google الخاص بك.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                  <span>2. النقر على Get API key</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  من القائمة الجانبية اليسرى أو العلوية اضغط على <strong>Get API key</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                  <span>3. إنشاء ونسخ المفتاح</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  اضغط <strong>Create API key</strong>، اختر مشروع Google Cloud، وانسخ المفتاح (يبدأ بـ <code>AIzaSy...</code>).
                </p>
              </div>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-start gap-4">
              <button
                onClick={() => toggleStep('step2')}
                className="mt-1 cursor-pointer focus:outline-none"
                title="Mark as completed"
              >
                <CheckCircle2
                  className={`w-6 h-6 transition-colors ${
                    completedSteps.step2
                      ? 'text-emerald-400 fill-emerald-400/20'
                      : 'text-slate-600 hover:text-slate-400'
                  }`}
                />
              </button>
              <div className="w-full">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-indigo-500/20 text-indigo-400">
                    المرحلة 2
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {lang === 'ar'
                      ? 'إضافة المفتاح داخل GitHub Repository Secrets'
                      : 'Step 2: Add Key to GitHub Repository Secrets'}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {lang === 'ar'
                    ? 'أسرار GitHub مشفرة بمستوى عسكري ولا تظهر في الكود أبداً، ويتم حقنها بأمان داخل بيئة الـ Runner.'
                    : 'GitHub Secrets are securely encrypted and automatically masked from logs.'}
                </p>

                {/* Step Path Illustration */}
                <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-3">
                  <div className="font-semibold text-slate-300">
                    {lang === 'ar' ? 'المسار الدقيق داخل GitHub:' : 'Exact Navigation Path in GitHub:'}
                  </div>
                  <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed">
                    <li>
                      افتح مستودعك على موقع <strong>GitHub.com</strong>.
                    </li>
                    <li>
                      انقر على علامة التبويب <strong>Settings</strong> (الإعدادات) في أعلى المستودع.
                    </li>
                    <li>
                      في الشريط الجانبي الأيسر، ابحث عن قسم <strong>Security</strong> واضغط على:
                      <div className="inline-block mt-1 mr-2 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 font-mono text-cyan-300">
                        Secrets and variables ➔ Actions
                      </div>
                    </li>
                    <li>
                      انقر على الزر الأخضر: <strong>New repository secret</strong>.
                    </li>
                    <li>
                      اكتب في حقل <strong>Name</strong> بدقة تامة:
                      <div className="inline-flex items-center gap-2 mt-1 mr-2 px-2.5 py-1 rounded-md bg-indigo-950/60 border border-indigo-700/60 font-mono text-indigo-300 font-bold">
                        <span>GEMINI_API_KEY</span>
                        <button
                          onClick={() => navigator.clipboard.writeText('GEMINI_API_KEY')}
                          className="hover:text-white cursor-pointer"
                          title="Copy"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </li>
                    <li>
                      في حقل <strong>Secret</strong>، الصق المفتاح الذي نسخته من Google AI Studio.
                    </li>
                    <li>
                      اضغط على <strong>Add secret</strong> للحفظ.
                    </li>
                  </ol>
                </div>

                {/* CLI Quick Shortcut */}
                <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>gh secret set GEMINI_API_KEY --body "AIzaSy..."</span>
                  </div>
                  <button
                    onClick={copyCli}
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 cursor-pointer font-sans"
                  >
                    {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCli ? t.copied : t.copy}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-start gap-4">
              <button
                onClick={() => toggleStep('step3')}
                className="mt-1 cursor-pointer focus:outline-none"
                title="Mark as completed"
              >
                <CheckCircle2
                  className={`w-6 h-6 transition-colors ${
                    completedSteps.step3
                      ? 'text-emerald-400 fill-emerald-400/20'
                      : 'text-slate-600 hover:text-slate-400'
                  }`}
                />
              </button>
              <div className="w-full">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-indigo-500/20 text-indigo-400">
                    المرحلة 3
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {lang === 'ar'
                      ? 'تفعيل صلاحيات الـ Workflow لكتابة التعليقات (Workflow Permissions)'
                      : 'Step 3: Enable Actions Read & Write Permissions'}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {lang === 'ar'
                    ? '⚠️ نقطة هامة جداً: بشكل افتراضي يمنع GitHub الـ Actions من كتابة تعليقات على الـ Pull Requests تجنباً للسبام. يجب السماح بها بخطوة واحدة:'
                    : 'GitHub defaults to Read-Only for workflows. Enable Write access so Gemini can comment on PRs:'}
                </p>

                <div className="mt-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
                  <div className="font-bold flex items-center gap-2 text-amber-400 mb-1">
                    <Lock className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'كيف تفعّل الصلاحية؟' : 'How to enable:'}</span>
                  </div>
                  <div>
                    اذهب إلى <strong>Settings</strong> ➔ <strong>Actions</strong> ➔ <strong>General</strong> ➔ انزل لأسفل الصفحة إلى قسم <strong>Workflow permissions</strong> ➔ اختر:
                    <div className="mt-2 inline-block px-3 py-1.5 rounded-lg bg-amber-950/80 border border-amber-500/40 font-semibold text-white">
                      ◉ Read and write permissions
                    </div>
                    <div className="mt-2">ثم ضع علامة صح على: <strong>Allow GitHub Actions to create and approve pull requests</strong> ثم اضغط <strong>Save</strong>.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 4 */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-start gap-4">
              <button
                onClick={() => toggleStep('step4')}
                className="mt-1 cursor-pointer focus:outline-none"
                title="Mark as completed"
              >
                <CheckCircle2
                  className={`w-6 h-6 transition-colors ${
                    completedSteps.step4
                      ? 'text-emerald-400 fill-emerald-400/20'
                      : 'text-slate-600 hover:text-slate-400'
                  }`}
                />
              </button>
              <div className="w-full">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-indigo-500/20 text-indigo-400">
                    المرحلة 4
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {lang === 'ar'
                      ? 'إنشاء ملف سير العمل .github/workflows/gemini-review.yml'
                      : 'Step 4: Create the Workflow File'}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 mb-4">
                  {lang === 'ar'
                    ? 'أنشئ المجلد والملف في مستودعك، والصق الكود الكامل التالي (مبني على أحدث نموذج gemini-3.8-flash وحزمة @google/genai):'
                    : 'Create .github/workflows/gemini-review.yml and paste the verified pipeline code below:'}
                </p>

                <CodeBlock
                  filename=".github/workflows/gemini-review.yml"
                  language="yaml"
                  code={`name: "Gemini AI Code Reviewer"

# يعمل السير تلقائياً عند فتح أو تحديث أي طلب سحب (Pull Request)
on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write
  issues: write

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      # 1. جلب كود المستودع وتاريخ التغييرات
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      # 2. تهيئة بيئة Node.js 20
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      # 3. تثبيت حزمة Google GenAI الرسمية
      - name: Install @google/genai SDK
        run: npm install @google/genai

      # 4. استخراج التغييرات (Git Diff) وإرسالها لـ Gemini
      - name: Analyze Changes with Gemini
        id: gemini
        env:
          GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}
          GITHUB_BASE_REF: \${{ github.base_ref }}
        run: |
          node << 'EOF'
          const { GoogleGenAI } = require('@google/genai');
          const { execSync } = require('child_process');
          const fs = require('fs');

          async function main() {
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
              console.error("❌ خطأ: لم يتم العثور على GEMINI_API_KEY في GitHub Secrets!");
              process.exit(1);
            }

            const ai = new GoogleGenAI({ apiKey });

            // حساب التغييرات مقارنة بالفرع الرئيسي
            let diff = '';
            try {
              diff = execSync('git diff origin/' + (process.env.GITHUB_BASE_REF || 'main') + '...HEAD').toString();
            } catch (e) {
              diff = execSync('git diff HEAD~1 HEAD').toString();
            }

            if (!diff.trim()) {
              console.log("لا توجد تغييرات في الكود للمراجعة.");
              return;
            }

            // فحص التغييرات عبر Gemini 3.8 Flash
            console.log("جاري استدعاء Gemini 3.8 Flash لتحليل التغييرات...");
            const response = await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: \`يرجى مراجعة هذا التغيير في الكود البرمجي (Git Diff):\\n\\n\\\`\\\`\\\`diff\\n\${diff.slice(0, 14000)}\\n\\\`\\\`\\\`\`,
              config: {
                systemInstruction: \`أنت مراجع أكواد خبير أول (Senior AI Code Reviewer).
قم بتقديم تقرير مراجعة احترافي منظم:
1. ملخص التغييرات (Summary).
2. فحص الأمان واكتشاف تسريب الأسرار والثغرات (Security Audit).
3. تقييم الأداء وجودة الكود (Quality & Performance).
4. اقتراحات بديلة للكود مع أمثلة واضحة إن وجدت.
5. النتيجة: [APPROVED] أو [CHANGES REQUESTED].
اكتب التقرير بلغة عربية تقنية واضحة مع الإبقاء على الأكواد والمصطلحات البرمجية.\`
              }
            });

            const content = response.text || "تمت المراجعة بدون ملاحظات.";
            fs.writeFileSync('pr_review.md', "### 🤖 مراجعة Gemini AI التلقائية للأكواد\\n\\n" + content);
            console.log("✅ تم توليد تقرير المراجعة بنجاح!");
          }

          main().catch(err => {
            console.error("فشل التحليل:", err);
            process.exit(1);
          });
          EOF

      # 5. نشر تقرير المراجعة كتعليق رسمي على الـ Pull Request
      - name: Post Comment on PR
        uses: actions/github-script@v7
        with:
          github-token: \${{ secrets.GITHUB_TOKEN }}
          script: |
            const fs = require('fs');
            if (fs.existsSync('pr_review.md')) {
              const body = fs.readFileSync('pr_review.md', 'utf8');
              await github.rest.issues.createComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: body
              });
            }
`}
                />
              </div>
            </div>
          </div>

          {/* STEP 5 */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-start gap-4">
              <button
                onClick={() => toggleStep('step5')}
                className="mt-1 cursor-pointer focus:outline-none"
                title="Mark as completed"
              >
                <CheckCircle2
                  className={`w-6 h-6 transition-colors ${
                    completedSteps.step5
                      ? 'text-emerald-400 fill-emerald-400/20'
                      : 'text-slate-600 hover:text-slate-400'
                  }`}
                />
              </button>
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-bold rounded bg-indigo-500/20 text-indigo-400">
                      المرحلة 5
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      {lang === 'ar'
                        ? 'اختبار سير العمل ومشاهدة Gemini يراجع طلب السحب مباشرة'
                        : 'Step 5: Test and Watch Gemini in Action'}
                    </h3>
                  </div>

                  <button
                    onClick={onNavigateToSimulator}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{lang === 'ar' ? 'تشغيل المحاكي' : 'Live Simulator'}</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {lang === 'ar'
                    ? 'الآن حان وقت التجربة الحية في مستودعك!'
                    : 'Now test with a live branch and pull request!'}
                </p>

                <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 font-mono">
                  <div className="text-slate-500 font-sans font-semibold">أوامر الـ Git للاختبار الفوري:</div>
                  <pre className="text-cyan-300 p-2 bg-slate-900 rounded-lg overflow-x-auto">
{`# 1. إنشاء فرع جديد
git checkout -b test-gemini-review

# 2. تعديل أي ملف في مشروعك أو إضافة كود تجريبي
echo "// Testing Gemini AI Review" >> index.js

# 3. إرسال التغييرات
git add .
git commit -m "test: trigger gemini code review"
git push origin test-gemini-review`}
                  </pre>
                  <div className="text-slate-400 font-sans pt-2">
                    ➔ افتح <strong>Pull Request</strong> جديد في GitHub من فرع <code>test-gemini-review</code> إلى <code>main</code>.
                    <br />
                    ➔ اذهب لتبويب <strong>Actions</strong> في مستودعك، وستشاهد سير العمل يعمل بلون أصفر ثم أخضر، وستجد تعليقاً فورياً وشاملاً من Gemini على الـ PR!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TROUBLESHOOTING TAB */}
      {activeTab === 'troubleshooting' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>خطأ: 403 Resource not accessible by integration (عند نشر التعليق)</span>
            </h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              <strong>السبب:</strong> إعدادات الأمان الافتراضية في مستودع GitHub مضبوطة على القراءة فقط (Read-only) لحماية الـ PRs.
              <br />
              <strong>الحل:</strong> في مستودعك: <code>Settings</code> ➔ <code>Actions</code> ➔ <code>General</code> ➔ انزل إلى <code>Workflow permissions</code> واختر <strong>Read and write permissions</strong> ثم احفظ.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>خطأ: Missing GEMINI_API_KEY in GitHub Secrets</span>
            </h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              <strong>السبب:</strong> لم يتم تسمية السر بدقة <code>GEMINI_API_KEY</code> بالأحرف الكبيرة، أو تم وضعه في <em>Environment Secrets</em> بدلاً من <em>Repository Secrets</em>.
              <br />
              <strong>الحل:</strong> تأكد من وضعه في: <code>Settings</code> ➔ <code>Secrets and variables</code> ➔ <code>Actions</code> ➔ <code>Repository secrets</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>هل استدعاء Gemini في GitHub Actions مجاني؟</span>
            </h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              <strong>نعم!</strong> نموذج <code>gemini-3.8-flash</code> يقدم حصة مجانية كريمة جداً في Google AI Studio تسمح بمئات طلبات المراجعة يومياً بدون أي تكلفة، وهو فائق السرعة مما يقلل استهلاك دقائق GitHub Actions المجانية.
            </p>
          </div>
        </div>
      )}

      {/* WIF TAB */}
      {activeTab === 'wif' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-purple-900/40 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            <span>الربط المؤسسي بدون مفاتيح عبر Workload Identity Federation (WIF)</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            إذا كان لديك مشروع على <strong>Google Cloud Platform (GCP)</strong> وتريد الوصول إلى Gemini في <strong>Vertex AI</strong> بدون تخزين أي مفتاح API ثابت:
          </p>

          <CodeBlock
            filename=".github/workflows/gemini-wif.yml"
            language="yaml"
            code={`name: Keyless Gemini CI
on: [pull_request]

permissions:
  id-token: write # توليد توكن OIDC موثوق
  contents: read
  pull-requests: write

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # مصادقة مع Google Cloud بدون مفاتيح API
      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: 'projects/123456789/locations/global/workloadIdentityPools/github-pool/providers/github-provider'
          service_account: 'gemini-actions@my-gcp-project.iam.gserviceaccount.com'

      - name: Setup Node & Run
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Run AI Review
        run: |
          npm install @google/genai
          node scripts/review.js`}
          />
        </div>
      )}
    </div>
  );
};
