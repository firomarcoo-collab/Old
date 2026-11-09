"""
ICT-SMC-BOT: Main Autonomous Trading Engine for MetaTrader 5
Powered by Google Gemini 3.8 Flash AI and Smart Money Concepts (SMC)
"""
import time
import os
import sys
from datetime import datetime
from ict_engine import ICTEngine
from mt5_connector import MT5Connector
from gemini_ai import GeminiAIFilter
from config import BOT_CONFIG

def log(msg):
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] {msg}")

def main():
    print("=" * 65)
    print("🚀 ICT-SMC-BOT: Autonomous Institutional MT5 Trading Engine")
    print("🤖 Powered by Google Gemini 3.8 Flash")
    print(f"📊 Active Pairs: {', '.join(BOT_CONFIG['SYMBOLS'])}")
    print("=" * 65)

    # 1. Initialize MT5 Connection
    mt5 = MT5Connector(
        login=BOT_CONFIG['MT5_LOGIN'],
        password=BOT_CONFIG['MT5_PASSWORD'],
        server=BOT_CONFIG['MT5_SERVER']
    )
    if not mt5.connect():
        log("❌ Could not connect to MetaTrader 5 terminal. Running in simulated execution mode.")

    # 2. Initialize Gemini AI & ICT Engine
    gemini = GeminiAIFilter(api_key=os.environ.get("GEMINI_API_KEY", BOT_CONFIG.get("GEMINI_API_KEY", "")))
    ict = ICTEngine()

    log("⚡ Auto-trading loop started. Monitoring Killzones and Liquidity Pools...")

    while True:
        try:
            # Check current Killzone
            killzone = ict.get_current_killzone()
            log(f"⏰ Active Trading Session: {killzone}")

            for symbol in BOT_CONFIG['SYMBOLS']:
                # Scan for ICT Order Blocks and Fair Value Gaps
                setup = ict.scan_setup(symbol, timeframe=BOT_CONFIG['TIMEFRAME'])
                
                if setup['detected']:
                    log(f"🔍 Pattern Detected on {symbol}: {setup['pattern']} at {setup['current_price']}")
                    
                    # Consult Gemini AI for confirmation
                    log(f"🧠 Consulting Gemini 3.8 Flash for {symbol} validation...")
                    ai_verdict = gemini.validate_setup(
                        symbol=symbol,
                        pattern=setup['pattern'],
                        price=setup['current_price'],
                        killzone=killzone,
                        bias=setup['bias']
                    )

                    log(f"🎯 Gemini Decision: {ai_verdict['verdict']} | Confidence: {ai_verdict['confidence']}%")

                    # If confidence is above threshold, execute in MT5!
                    if ai_verdict['confidence'] >= BOT_CONFIG['MIN_CONFIDENCE'] and ai_verdict['action'] in ['BUY', 'SELL']:
                        log(f"⚡ SENDING ORDER TO MT5: {ai_verdict['action']} {BOT_CONFIG['DEFAULT_LOTS']} Lot on {symbol}")
                        
                        ticket = mt5.open_order(
                            symbol=symbol,
                            order_type=ai_verdict['action'],
                            lots=BOT_CONFIG['DEFAULT_LOTS'],
                            sl_points=ai_verdict['sl_points'],
                            tp_points=ai_verdict['tp_points'],
                            comment=f"GEMINI_{setup['pattern'][:15]}"
                        )

                        if ticket:
                            log(f"✅ Order Executed in MT5! Ticket: #{ticket} | Target 1:3.5 RRR")
                    else:
                        log(f"⏸️ Trade skipped by Gemini AI filter: Low confluence.")

            # Monitor and manage open positions
            mt5.manage_trailing_stops()

            log(f"💤 Sleeping for {BOT_CONFIG['SCAN_INTERVAL_SECONDS']} seconds before next scan...")
            time.sleep(BOT_CONFIG['SCAN_INTERVAL_SECONDS'])

        except KeyboardInterrupt:
            log("🛑 Bot gracefully stopped by user.")
            mt5.disconnect()
            break
        except Exception as e:
            log(f"⚠️ Error in loop: {e}")
            time.sleep(10)

if __name__ == "__main__":
    main()
