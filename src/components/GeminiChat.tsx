import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  HelpCircle,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';
import { Language, ChatMessage } from '../types';
import { translations } from '../data/translations';

interface GeminiChatProps {
  lang: Language;
}

export const GeminiChat: React.FC<GeminiChatProps> = ({ lang }) => {
  const t = translations[lang];
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'gemini',
      text: t.emptyChat,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = lang === 'ar'
    ? [
        'كيف أضيف GEMINI_API_KEY إلى مستودع GitHub خطوة بخطوة؟',
        'كيف أجعل Gemini يفحص فقط الملفات البرمجية (.ts/.js/.py) ويتجاهل الـ lockfiles؟',
        'هل يمكن استخدام gemini-3.8-flash مجاناً لمراجعة طلبات السحب؟',
        'ما هي الصلاحيات (permissions) المطلوبة في GitHub Action لكتابة تعليق على PR؟',
      ]
    : [
        'How do I add GEMINI_API_KEY to GitHub Secrets step by step?',
        'How can I configure Gemini to only inspect code files (.ts/.py) and skip lockfiles?',
        'What permissions are strictly needed in GitHub Actions to comment on PRs?',
        'How do I avoid hitting Gemini API rate limits on large pull requests?',
      ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSend = async (messageText = input) => {
    if (!messageText.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText.trim(),
          language: lang,
          repoContext: 'GitHub Actions CI/CD with Google Gemini 3.8 Flash',
        }),
      });

      const data = await response.json();
      const geminiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'gemini',
        text: data.reply || (lang === 'ar' ? 'تعذر الحصول على رد من Gemini.' : 'No response received from Gemini.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, geminiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'system',
        text: lang === 'ar' ? 'حدث خطأ أثناء الاتصال بـ Gemini.' : 'An error occurred while connecting to Gemini.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[650px] rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{lang === 'ar' ? 'مساعد Gemini لربط غيت هب' : 'Gemini GitHub Assistant'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </h3>
            <p className="text-[11px] text-slate-400">
              {lang === 'ar'
                ? 'إجابات فورية واستشارات حول سير العمل، مفاتيح الأمان، وأخطاء CI/CD'
                : 'Direct troubleshooting, secret setup, and CI/CD pipeline guidance'}
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'welcome',
                sender: 'gemini',
                text: t.emptyChat,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ])
          }
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors text-xs flex items-center gap-1 cursor-pointer"
          title="Reset conversation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{lang === 'ar' ? 'محادثة جديدة' : 'New Chat'}</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isSystem = msg.sender === 'system';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                isUser ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : isSystem
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-slate-800 text-cyan-400 border border-slate-700'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : isSystem
                    ? 'bg-rose-950/40 border border-rose-900/50 text-rose-300'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                <div
                  className={`text-[10px] mt-2 font-mono ${
                    isUser ? 'text-indigo-200 text-right' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span>{lang === 'ar' ? 'Gemini يفكر في الإجابة...' : 'Gemini is thinking...'}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 overflow-x-auto flex items-center gap-2">
        <span className="text-[10px] font-semibold text-slate-500 uppercase shrink-0">
          {lang === 'ar' ? 'اقتراحات:' : 'Suggestions:'}
        </span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={isSending}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-[11px] text-slate-300 hover:text-white transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSending}
            placeholder={t.chatPlaceholder}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={isSending || !input.trim()}
            className="flex items-center justify-center p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all cursor-pointer shadow-lg shadow-indigo-600/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
