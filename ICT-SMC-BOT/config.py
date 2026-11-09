"""
ICT-SMC-BOT Global Configuration
"""
BOT_CONFIG = {
    # Active Forex, Commodities, and Crypto Symbols
    'SYMBOLS': ['EURUSD', 'GBPUSD', 'XAUUSD', 'BTCUSD'],
    'TIMEFRAME': '15m',
    
    # Risk Management & Lot Sizing
    'DEFAULT_LOTS': 0.50,
    'RISK_PER_TRADE_PERCENT': 1.0,
    'MIN_CONFIDENCE': 85,
    'SCAN_INTERVAL_SECONDS': 15,

    # MetaTrader 5 Terminal Credentials
    'MT5_LOGIN': 58924012,
    'MT5_PASSWORD': 'DemoPassword123',
    'MT5_SERVER': 'MetaQuotes-Demo',

    # Google Gemini API Key
    'GEMINI_API_KEY': '',
}
