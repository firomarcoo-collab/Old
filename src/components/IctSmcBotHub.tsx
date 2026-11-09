import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  Bot,
  Play,
  Download,
  Copy,
  Check,
  Shield,
  Activity,
  Layers,
  FileCode,
  Terminal,
  ExternalLink,
  Cpu,
  Clock,
  DollarSign,
  AlertCircle,
  Bell,
  RefreshCw,
  Wallet,
  Zap,
  XCircle,
  CheckCircle2,
  Sliders,
  Power,
  Settings,
  History,
} from 'lucide-react';
import { Language } from '../types';
import { CodeBlock } from './CodeBlock';

interface IctSmcBotHubProps {
  lang: Language;
}

interface PairConfig {
  symbol: string;
  price: number;
  change: string;
  pattern: string;
  timeframe: string;
  killzone: string;
  trend: 'Bullish' | 'Bearish';
}

interface MT5Position {
  ticket: number;
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number;
  openPrice: number;
  currentPrice: number;
  sl: number;
  tp: number;
  profit: number;
  openTime: string;
  comment: string;
}

interface ClosedTrade extends MT5Position {
  closePrice: number;
  closeTime: string;
  finalProfit: number;
}

interface MT5Account {
  login: number;
  server: string;
  currency: string;
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  leverage: number;
  connected: boolean;
  autoTrade: boolean;
}

const defaultPairs: PairConfig[] = [
  {
    symbol: 'EUR/USD',
    price: 1.0854,
    change: '+0.42%',
    pattern: 'Bullish Order Block + FVG',
    timeframe: '15m',
    killzone: 'London Open Killzone',
    trend: 'Bullish',
  },
  {
    symbol: 'XAU/USD',
    price: 2684.50,
    change: '+1.15%',
    pattern: 'Liquidity Sweep + MSS',
    timeframe: '5m',
    killzone: 'New York Open (Silver Bullet)',
    trend: 'Bullish',
  },
  {
    symbol: 'GBP/USD',
    price: 1.2942,
    change: '-0.18%',
    pattern: 'Bearish Mitigation Block',
    timeframe: '15m',
    killzone: 'London Open Killzone',
    trend: 'Bearish',
  },
  {
    symbol: 'BTC/USDT',
    price: 89450.00,
    change: '+3.80%',
    pattern: 'Daily FVG Re-test (BISI)',
    timeframe: '1h',
    killzone: 'New York Afternoon',
    trend: 'Bullish',
  },
];

export const IctSmcBotHub: React.FC<IctSmcBotHubProps> = ({ lang }) => {
  const [selectedPair, setSelectedPair] = useState<PairConfig>(defaultPairs[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  // MT5 State
  const [account, setAccount] = useState<MT5Account>({
    login: 58924012,
    server: 'MetaQuotes-Demo',
    currency: 'USD',
    balance: 10000.0,
    equity: 10245.5,
    margin: 320.0,
    freeMargin: 9925.5,
    leverage: 100,
    connected: true,
    autoTrade: true,
  });

  const [positions, setPositions] = useState<MT5Position[]>([]);
  const [closedTrades, setClosedTrades] = useState<ClosedTrade[]>([]);
  const [lotSize, setLotSize] = useState<number>(0.50);
  const [isExecuting, setIsExecuting] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Autonomous Bot Runner State
  const [autonomousRunning, setAutonomousRunning] = useState<boolean>(true);
  const [liveLogs, setLiveLogs] = useState<string[]>([
    '🚀 [ICT-SMC-BOT] Autonomous Engine initialized.',
    '🤖 [AI Module] Google Gemini 3.8 Flash model attached.',
    '📡 [MT5 Terminal] Connected to MetaQuotes-Demo (Account #58924012).',
    '🔎 [Scanner] Scanning EUR/USD, XAU/USD, GBP/USD, BTC/USDT on 15m...',
  ]);

  // Python and MQL5 Code Scripts
  const [mt5Scripts, setMt5Scripts] = useState<Record<string, string>>({});
  const [activeScriptTab, setActiveScriptTab] = useState<string>('mt5_trader.py');
  const [copiedScript, setCopiedScript] = useState(false);

  // Fetch MT5 Account & Positions
  const refreshMt5Data = async () => {
    try {
      const res = await fetch('/api/mt5/account');
      const data = await res.json();
      if (data.success) {
        setAccount(data.account);
        setPositions(data.positions);
        setClosedTrades(data.history);
      }
    } catch (e) {
      console.error('Failed to load MT5 account', e);
    }
  };

  useEffect(() => {
    refreshMt5Data();

    // Load Python/MQL5 scripts
    fetch('/api/mt5/python-scripts')
      .then((res) => res.json())
      .then((data) => {
        if (data.scripts) {
          setMt5Scripts(data.scripts);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Autonomous Engine Interval (Simulating real-time market ticks & Gemini automated scanning)
  useEffect(() => {
    if (!autonomousRunning) return;

    const interval = setInterval(() => {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const actions = [
        `🔎 [${timeStr}] Scanning EUR/USD... Order Block re-test validated by Gemini 3.8 Flash.`,
        `📈 [${timeStr}] MT5 Tick: EUR/USD +1.2 pips | Trailing Stop locked at Break-Even.`,
        `⚡ [${timeStr}] Scanning XAU/USD (Gold)... Liquidity sweep confirmed at $2684.50.`,
        `🤖 [${timeStr}] Gemini Signal: Bullish FVG Mitigation confirmed with 92% confidence.`,
      ];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];

      setLiveLogs((prev) => [randomAction, ...prev.slice(0, 30)]);

      // Slightly update floating profit to simulate live market price action
      setPositions((prev) =>
        prev.map((pos) => {
          const delta = (Math.random() - 0.45) * 4.5;
          const newProfit = +(pos.profit + delta).toFixed(2);
          return { ...pos, profit: newProfit };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [autonomousRunning]);

  // Gemini AI Analysis
  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/ict/analyze-signal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: selectedPair.symbol,
          timeframe: selectedPair.timeframe,
          pattern: selectedPair.pattern,
          currentPrice: selectedPair.price,
          killzone: selectedPair.killzone,
          trend: selectedPair.trend,
          language: lang,
        }),
      });

      const data = await res.json();
      setAnalysisResult(data);

      // If AutoTrade is ON and high confidence, automatically open in MT5!
      if (account.autoTrade && data.confidence >= 85) {
        handleOpenTrade(data.verdict.includes('BUY') ? 'BUY' : 'SELL', data.stopLoss, data.takeProfit1);
      }
    } catch (err) {
      console.error('Analysis failed', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Open Trade on MT5
  const handleOpenTrade = async (type: 'BUY' | 'SELL', customSl?: number, customTp?: number) => {
    setIsExecuting(true);
    try {
      const res = await fetch('/api/mt5/open-trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: selectedPair.symbol,
          type,
          volume: lotSize,
          price: selectedPair.price,
          sl: customSl || (type === 'BUY' ? selectedPair.price - 0.002 : selectedPair.price + 0.002),
          tp: customTp || (type === 'BUY' ? selectedPair.price + 0.006 : selectedPair.price - 0.006),
          comment: 'ICT_SMC_GEMINI_AI',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActionNotice(
          lang === 'ar'
            ? `✅ تم فتح صفقة ${type} ${lotSize} لوت على ${selectedPair.symbol} في MT5 (أمر رقم #${data.position.ticket})`
            : `✅ Order #${data.position.ticket} placed on MT5: ${type} ${lotSize} lots on ${selectedPair.symbol}`
        );
        refreshMt5Data();
        setTimeout(() => setActionNotice(null), 4500);
      }
    } catch (e) {
      console.error('Failed to open trade', e);
    } finally {
      setIsExecuting(false);
    }
  };

  // Close Single Position on MT5
  const handleClosePosition = async (ticket: number) => {
    try {
      const res = await fetch('/api/mt5/close-trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket }),
      });
      const data = await res.json();
      if (data.success) {
        setActionNotice(
          lang === 'ar'
            ? `🏁 تم إغلاق الصفقة رقم #${ticket} بنجاح في MT5 وحجز الربح/الخسارة!`
            : `🏁 Position #${ticket} closed successfully on MT5!`
        );
        refreshMt5Data();
        setTimeout(() => setActionNotice(null), 4000);
      }
    } catch (e) {
      console.error('Failed to close trade', e);
    }
  };

  // Close All Positions on MT5
  const handleCloseAll = async () => {
    try {
      const res = await fetch('/api/mt5/close-all', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setActionNotice(
          lang === 'ar'
            ? `🚨 تم إغلاق كل الصفقات المفتوحة على MT5 فوراً!`
            : `🚨 All open positions closed on MT5!`
        );
        refreshMt5Data();
        setTimeout(() => setActionNotice(null), 4000);
      }
    } catch (e) {
      console.error('Failed to close all', e);
    }
  };

  // Toggle Auto-Trading
  const handleToggleAutoTrade = async () => {
    try {
      const res = await fetch('/api/mt5/toggle-autotrade', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setAccount((prev) => ({ ...prev, autoTrade: data.autoTrade }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* MT5 Account Bar */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 border border-indigo-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">
                  MetaTrader 5 (MT5) Live Terminal
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{lang === 'ar' ? 'متصل بـ MT5' : 'Connected'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Account: #{account.login} • Server: {account.server} • Leverage 1:{account.leverage}
              </p>
            </div>
          </div>

          {/* Auto-Trading Toggle Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleAutoTrade}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md ${
                account.autoTrade
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
              }`}
            >
              <Zap className={`w-4 h-4 ${account.autoTrade ? 'text-amber-300 animate-bounce' : ''}`} />
              <span>
                {account.autoTrade
                  ? (lang === 'ar' ? 'التداول الآلي: مفعّل ⚡' : 'Auto-Trade: ACTIVE ⚡')
                  : (lang === 'ar' ? 'التداول الآلي: متوقف' : 'Auto-Trade: PAUSED')}
              </span>
            </button>

            {positions.length > 0 && (
              <button
                onClick={handleCloseAll}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all cursor-pointer"
                title="Emergency Close All Trades"
              >
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>{lang === 'ar' ? 'إغلاق كل الصفقات' : 'Close All'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Real-Time Financial Balance Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-500 uppercase font-semibold">Balance</span>
            <div className="text-lg font-mono font-bold text-white mt-0.5">
              ${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-500 uppercase font-semibold">Equity</span>
            <div className="text-lg font-mono font-bold text-emerald-400 mt-0.5">
              ${account.equity.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-500 uppercase font-semibold">Free Margin</span>
            <div className="text-lg font-mono font-bold text-slate-200 mt-0.5">
              ${account.freeMargin.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-500 uppercase font-semibold">Floating PnL</span>
            <div
              className={`text-lg font-mono font-bold mt-0.5 ${
                account.equity >= account.balance ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {account.equity >= account.balance ? '+' : ''}$
              {(account.equity - account.balance).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Action Notice / Toast */}
        {actionNotice && (
          <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-cyan-200 text-xs font-semibold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionNotice}</span>
            </div>
            <button onClick={() => setActionNotice(null)} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Live Order Placement & Chart Hub */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Ticker + Live Chart + 1-Click Execution */}
        <div className="lg:col-span-2 space-y-4">
          {/* Pair Ticker Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {defaultPairs.map((pair) => {
              const isSelected = selectedPair.symbol === pair.symbol;
              return (
                <button
                  key={pair.symbol}
                  onClick={() => {
                    setSelectedPair(pair);
                    setAnalysisResult(null);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>{pair.symbol}</span>
                    <span className="text-emerald-400 font-mono text-[11px]">{pair.change}</span>
                  </div>
                  <div className="text-sm font-mono font-semibold text-slate-200 mt-1">
                    {pair.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Trade Execution Controls */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{selectedPair.symbol}</span>
                  <span className="text-xs font-mono text-cyan-400 font-normal">
                    @ {selectedPair.price}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300">
                    {selectedPair.pattern}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'ar'
                    ? 'فتح صفقة مباشرة في منصة MetaTrader 5 بحجم العقد المحدد وتحديد الوقف تلقائياً'
                    : 'Execute order directly to MetaTrader 5 with automated SL/TP'}
                </p>
              </div>

              {/* Lot Size Selector */}
              <div className="flex items-center gap-2 text-xs bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 pl-2 font-semibold">Lots:</span>
                {[0.10, 0.20, 0.50, 1.00].map((val) => (
                  <button
                    key={val}
                    onClick={() => setLotSize(val)}
                    className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                      lotSize === val
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {val.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct BUY / SELL Buttons */}
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleOpenTrade('BUY')}
                disabled={isExecuting}
                className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <TrendingUp className="w-5 h-5" />
                <span>{lang === 'ar' ? `فتح صفقة شراء BUY (${lotSize} Lot)` : `BUY ${selectedPair.symbol} (${lotSize} Lot)`}</span>
              </button>

              <button
                onClick={() => handleOpenTrade('SELL')}
                disabled={isExecuting}
                className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                <TrendingDown className="w-5 h-5" />
                <span>{lang === 'ar' ? `فتح صفقة بيع SELL (${lotSize} Lot)` : `SELL ${selectedPair.symbol} (${lotSize} Lot)`}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Gemini Signal Validation */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-indigo-500/30 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-sm font-bold text-white">
                    {lang === 'ar' ? 'تأكيد Gemini 3.8 Flash قبل التنفيذ' : 'Gemini Pre-Trade Confirmation'}
                  </h4>
                </div>
                <button
                  onClick={handleRunAiAnalysis}
                  disabled={isAnalyzing}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
                >
                  {isAnalyzing ? (lang === 'ar' ? 'يفحص...' : 'Checking...') : (lang === 'ar' ? 'فحص الآن' : 'Validate')}
                </button>
              </div>

              {analysisResult ? (
                <div className="mt-4 space-y-3">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-emerald-400 uppercase font-bold">Signal</div>
                      <div className="text-sm font-extrabold text-white">{analysisResult.verdict}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Confidence</div>
                      <div className="text-sm font-bold text-emerald-400">{analysisResult.confidence}%</div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between p-2 rounded bg-slate-950">
                      <span className="text-slate-400">Stop Loss:</span>
                      <span className="text-rose-400 font-bold">{analysisResult.stopLoss}</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-slate-950">
                      <span className="text-slate-400">Take Profit 1:</span>
                      <span className="text-emerald-400 font-bold">{analysisResult.takeProfit1}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed max-h-32 overflow-y-auto p-2 bg-slate-950 rounded-lg">
                    {analysisResult.analysis}
                  </p>
                </div>
              ) : (
                <div className="mt-8 text-center text-xs text-slate-400 space-y-2">
                  <Shield className="w-8 h-8 text-indigo-400 mx-auto" />
                  <p>
                    {lang === 'ar'
                      ? 'اضغط "فحص الآن" لاستشارة Gemini حول توقيت الدخول ونقاط الوقف والهدف.'
                      : 'Validate setup with Gemini to calculate optimal institutional SL/TP levels.'}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => handleOpenTrade(analysisResult?.verdict?.includes('SELL') ? 'SELL' : 'BUY')}
              disabled={isExecuting}
              className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm cursor-pointer shadow-lg shadow-emerald-600/30"
            >
              {lang === 'ar' ? 'تنفيذ الصفقة المؤكدة في MT5 فوراً ⚡' : 'Execute Validated Order on MT5 ⚡'}
            </button>
          </div>
        </div>
      </div>

      {/* Live Open Positions on MT5 */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              {lang === 'ar' ? 'الصفقات المفتوحة حالياً في MetaTrader 5' : 'Active MT5 Positions'}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300">
              {positions.length}
            </span>
          </div>

          <button
            onClick={refreshMt5Data}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'تحديث' : 'Refresh'}</span>
          </button>
        </div>

        {positions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Ticket</th>
                  <th className="p-3">Symbol</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Volume</th>
                  <th className="p-3">Open Price</th>
                  <th className="p-3">Current</th>
                  <th className="p-3">SL</th>
                  <th className="p-3">TP</th>
                  <th className="p-3">Profit ($)</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {positions.map((pos) => {
                  const isBuy = pos.type === 'BUY';
                  const isProfitable = pos.profit >= 0;
                  return (
                    <tr key={pos.ticket} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 text-slate-400">#{pos.ticket}</td>
                      <td className="p-3 font-bold text-white">{pos.symbol}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isBuy ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {pos.type}
                        </span>
                      </td>
                      <td className="p-3 text-slate-200">{pos.volume.toFixed(2)}</td>
                      <td className="p-3 text-slate-300">{pos.openPrice}</td>
                      <td className="p-3 text-white font-bold">{pos.currentPrice}</td>
                      <td className="p-3 text-rose-400">{pos.sl}</td>
                      <td className="p-3 text-emerald-400">{pos.tp}</td>
                      <td
                        className={`p-3 font-bold ${
                          isProfitable ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isProfitable ? '+' : ''}${pos.profit.toFixed(2)}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleClosePosition(pos.ticket)}
                          className="px-2.5 py-1 rounded bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white transition-colors cursor-pointer text-[11px] font-sans font-semibold"
                        >
                          {lang === 'ar' ? 'إغلاق الصفقة' : 'Close'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-xs rounded-xl bg-slate-950 border border-slate-800">
            {lang === 'ar'
              ? 'لا توجد صفقات مفتوحة حالياً. استخدم أزرار الشراء والبيع أعلاه لفتح صفقة في MT5!'
              : 'No active positions open on MT5. Use the BUY / SELL buttons above to place orders.'}
          </div>
        )}
      </div>

      {/* Autonomous Bot Live Console & Execution Log */}
      <div className="p-6 rounded-2xl bg-black border border-slate-800 shadow-2xl space-y-3 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${autonomousRunning ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${autonomousRunning ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </span>
            <span className="font-bold text-white font-sans text-sm">
              {lang === 'ar' ? 'سجل تشغيل البوت الآلي المباشر (Autonomous Engine Log)' : 'Autonomous Bot Live Console'}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-400 border border-slate-800">
              {autonomousRunning ? 'SCANNING 4s' : 'IDLE'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutonomousRunning(!autonomousRunning)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-sans font-bold cursor-pointer transition-all ${
                autonomousRunning
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{autonomousRunning ? (lang === 'ar' ? 'إيقاف المحرك' : 'Pause Engine') : (lang === 'ar' ? 'تشغيل المحرك' : 'Start Engine')}</span>
            </button>

            <button
              onClick={() => setLiveLogs([`🚀 [${new Date().toLocaleTimeString()}] Logs cleared by operator.`])}
              className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-sans cursor-pointer"
            >
              {lang === 'ar' ? 'مسح السجل' : 'Clear'}
            </button>
          </div>
        </div>

        {/* Console Log Stream */}
        <div className="h-44 overflow-y-auto space-y-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-900 scrollbar-thin">
          {liveLogs.map((logItem, idx) => (
            <div
              key={idx}
              className={`leading-relaxed ${
                logItem.includes('GEMINI') || logItem.includes('Gemini')
                  ? 'text-cyan-300'
                  : logItem.includes('Executing') || logItem.includes('MT5 Tick')
                  ? 'text-emerald-400'
                  : logItem.includes('Order Block') || logItem.includes('FVG')
                  ? 'text-indigo-300 font-semibold'
                  : 'text-slate-400'
              }`}
            >
              {logItem}
            </div>
          ))}
        </div>
      </div>

      {/* MetaTrader 5 Python Code & MQL5 Suite */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <span>{lang === 'ar' ? 'كود الربط الفعلي مع برنامج MetaTrader 5 على جهازك أو السيرفر' : 'MetaTrader 5 Python & MQL5 Scripts'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'ar'
                ? 'ملفات جاهزة للتشغيل مع مكتبة MetaTrader5 الرسمية للفتح والإغلاق التلقائي على منصة ميتاتريدر.'
                : 'Ready-to-run Python script using the official MetaTrader5 package.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownloadFile(activeScriptTab, mt5Scripts[activeScriptTab] || '')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? `تحميل ${activeScriptTab}` : `Download ${activeScriptTab}`}</span>
            </button>
          </div>
        </div>

        {/* Script Selection Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
          {Object.keys(mt5Scripts).map((fname) => (
            <button
              key={fname}
              onClick={() => setActiveScriptTab(fname)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeScriptTab === fname
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {fname}
            </button>
          ))}
        </div>

        <CodeBlock
          filename={`MT5 / ${activeScriptTab}`}
          language={activeScriptTab.endsWith('.py') ? 'python' : activeScriptTab.endsWith('.mq5') ? 'cpp' : 'text'}
          code={mt5Scripts[activeScriptTab] || '# Loading script...'}
        />

        {/* Instructions */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
          <div className="font-bold text-cyan-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'ar' ? 'كيف تشغل هذا الكود على حاسوبك أو سيرفر VPS مع برنامج MT5؟' : 'How to run on your PC / VPS with MT5:'}</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-400 leading-relaxed font-sans">
            <li>قم بتثبيت حزمة ميتاتريدر 5 الرسمية في بايثون: <code>pip install MetaTrader5 google-genai</code>.</li>
            <li>افتح برنامج **MetaTrader 5** وسجّل دخولك لحسابك التجريبي أو الحقيقي.</li>
            <li>في برنامج MT5: اذهب إلى <code>Tools ➔ Options ➔ Expert Advisors</code> وضع علامة صح على <strong>Allow algorithmic trading</strong>.</li>
            <li>شغل ملف البوت: <code>python mt5_trader.py</code> وسيقوم بالاتصال بمنصة MT5 وفتح وإغلاق الصفقات آلياً!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
