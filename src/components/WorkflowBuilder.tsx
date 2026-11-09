import React, { useState } from 'react';
import {
  FileCode,
  Download,
  Copy,
  Check,
  Sparkles,
  Layers,
  Cpu,
  Settings2,
  Sliders,
  Send,
  Loader2,
} from 'lucide-react';
import { Language, WorkflowTemplate } from '../types';
import { workflowTemplates } from '../data/workflowTemplates';
import { translations } from '../data/translations';
import { CodeBlock } from './CodeBlock';

interface WorkflowBuilderProps {
  lang: Language;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ lang }) => {
  const t = translations[lang];
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate>(workflowTemplates[0]);
  const [model, setModel] = useState<'gemini-3.8-flash' | 'gemini-4-argon'>('gemini-3.8-flash');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<string | null>(null);

  const activeYaml = generatedWorkflow || selectedTemplate.yaml.replace('gemini-3.8-flash', model);

  const handleDownload = () => {
    const blob = new Blob([activeYaml], { type: 'text/yaml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'gemini-workflow.yml');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCustomGenerate = async () => {
    if (!customPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini/generate-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowType: selectedTemplate.id,
          language: lang,
          customRequirements: customPrompt,
        }),
      });
      const data = await res.json();
      if (data.workflow) {
        setGeneratedWorkflow(data.workflow);
      }
    } catch (err) {
      console.error('Failed to generate workflow', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCode className="w-5 h-5 text-indigo-400" />
            {lang === 'ar' ? 'مُولّد وتخصيص ملفات سير العمل لـ GitHub Actions' : 'GitHub Actions Workflow Generator & Customizer'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {lang === 'ar'
              ? 'اختر من القوالب الجاهزة أو قم بتوليد سير عمل مخصص بنقرة واحدة باستخدام Gemini.'
              : 'Choose production-ready workflow templates or generate a custom pipeline with Gemini.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-indigo-600/30"
          >
            <Download className="w-4 h-4" />
            <span>{t.download}</span>
          </button>
        </div>
      </div>

      {/* Template Cards Grid */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          {t.selectTemplate}
        </label>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {workflowTemplates.map((template) => {
            const isSelected = selectedTemplate.id === template.id && !generatedWorkflow;
            return (
              <button
                key={template.id}
                onClick={() => {
                  setSelectedTemplate(template);
                  setGeneratedWorkflow(null);
                }}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {template.badge}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 uppercase">
                      {template.runtime}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white line-clamp-1">
                    {template.name[lang]}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {template.description[lang]}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                  <span>Trigger:</span>
                  <span className="text-slate-300">{template.trigger}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Model & Settings Tweaks */}
      <div className="grid md:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'ar' ? 'نموذج Gemini المستهدف' : 'Target Gemini Model'}</span>
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended & Fast)</option>
            <option value="gemini-4-argon">gemini-4-argon (Deep Reasoning)</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{lang === 'ar' ? 'طلب تخصيص سير العمل عبر الذكاء الاصطناعي' : 'Customize with Gemini AI Prompt'}</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder={
                lang === 'ar'
                  ? 'مثال: أضف فحص أمان للأسرار وتنبيه على Slack في حال فشل الفحص...'
                  : 'E.g., Add secret scanning check and send Slack notification on failure...'
              }
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleCustomGenerate}
              disabled={isGenerating || !customPrompt.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-all cursor-pointer shrink-0"
            >
              {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>{lang === 'ar' ? 'توليد' : 'Generate'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Workflow Code Display */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>
              {lang === 'ar'
                ? 'الملف الناتج: .github/workflows/gemini.yml'
                : 'Generated Output: .github/workflows/gemini.yml'}
            </span>
          </div>

          {generatedWorkflow && (
            <button
              onClick={() => setGeneratedWorkflow(null)}
              className="text-xs text-indigo-400 hover:underline cursor-pointer"
            >
              {lang === 'ar' ? 'الرجوع للقالب الأصلي' : 'Reset to template'}
            </button>
          )}
        </div>

        <CodeBlock
          filename=".github/workflows/gemini.yml"
          language="yaml"
          code={activeYaml}
        />
      </div>

      {/* Explanation Banner */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <Sliders className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-300">
            {lang === 'ar' ? 'كيف يعمل هذا السير في GitHub؟' : 'How does this workflow operate in GitHub?'}
          </span>
          <p className="mt-1 leading-relaxed">
            {selectedTemplate.explanation[lang]}
          </p>
        </div>
      </div>
    </div>
  );
};
