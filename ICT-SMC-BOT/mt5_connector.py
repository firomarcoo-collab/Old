"""
MetaTrader 5 Direct Bridge Connector
Executes and closes orders using the official MetaTrader5 Python package
"""
import random
import time

try:
    import MetaTrader5 as mt5
    HAS_MT5_LIB = True
except ImportError:
    HAS_MT5_LIB = False

class MT5Connector:
    def __init__(self, login=58924012, password="DemoPassword123", server="MetaQuotes-Demo"):
        self.login = login
        self.password = password
        self.server = server
        self.connected = False
        self.simulated_positions = []

    def connect(self):
        if HAS_MT5_LIB:
            try:
                if not mt5.initialize():
                    print(f"❌ MT5 Init error: {mt5.last_error()}")
                    self.connected = False
                    return False
                
                auth = mt5.login(self.login, password=self.password, server=self.server)
                if auth:
                    print(f"✅ Connected to MT5 Account #{self.login} on {self.server}")
                    self.connected = True
                    return True
                else:
                    print(f"⚠️ MT5 login failed ({mt5.last_error()}). Running in virtual sandbox execution mode.")
                    self.connected = False
                    return False
            except Exception as e:
                print(f"⚠️ MT5 exception: {e}")
                self.connected = False
                return False
        else:
            print("💡 MetaTrader5 library not installed in this environment. Using sandbox simulation mode.")
            self.connected = False
            return False

    def open_order(self, symbol, order_type, lots=0.50, sl_points=200, tp_points=600, comment="ICT_SMC"):
        """
        Sends order to MT5. If terminal is not present, simulates execution and returns ticket.
        """
        is_buy = order_type.upper() == "BUY"

        if HAS_MT5_LIB and self.connected:
            mt5.symbol_select(symbol, True)
            tick = mt5.symbol_info_tick(symbol)
            if not tick:
                return None
            
            point = mt5.symbol_info(symbol).point
            price = tick.ask if is_buy else tick.bid
            sl = price - (sl_points * point) if is_buy else price + (sl_points * point)
            tp = price + (tp_points * point) if is_buy else price - (tp_points * point)

            request = {
                "action": mt5.TRADE_ACTION_DEAL,
                "symbol": symbol,
                "volume": float(lots),
                "type": mt5.ORDER_TYPE_BUY if is_buy else mt5.ORDER_TYPE_SELL,
                "price": price,
                "sl": sl,
                "tp": tp,
                "deviation": 20,
                "magic": 777999,
                "comment": comment,
                "type_time": mt5.ORDER_TIME_GTC,
                "type_filling": mt5.ORDER_FILLING_IOC,
            }

            res = mt5.order_send(request)
            if res.retcode == mt5.TRADE_RETCODE_DONE:
                return res.order
            return None
        else:
            # Sandbox Virtual Execution
            ticket = random.randint(1085000, 1999999)
            print(f"📈 [MT5 Execution] #{ticket} {order_type} {lots} Lots on {symbol} (SL: -{sl_points}pts, TP: +{tp_points}pts)")
            self.simulated_positions.append({
                'ticket': ticket,
                'symbol': symbol,
                'type': order_type,
                'lots': lots,
                'opened_at': time.time()
            })
            return ticket

    def close_order(self, ticket):
        if HAS_MT5_LIB and self.connected:
            positions = mt5.positions_get(ticket=ticket)
            if not positions:
                return False
            pos = positions[0]
            tick = mt5.symbol_info_tick(pos.symbol)
            is_buy = pos.type == mt5.ORDER_TYPE_BUY
            price = tick.bid if is_buy else tick.ask

            req = {
                "action": mt5.TRADE_ACTION_DEAL,
                "position": ticket,
                "symbol": pos.symbol,
                "volume": pos.volume,
                "type": mt5.ORDER_TYPE_SELL if is_buy else mt5.ORDER_TYPE_BUY,
                "price": price,
                "deviation": 20,
                "magic": 777999,
                "comment": "CLOSE_ICT",
                "type_time": mt5.ORDER_TIME_GTC,
                "type_filling": mt5.ORDER_FILLING_IOC,
            }
            res = mt5.order_send(req)
            return res.retcode == mt5.TRADE_RETCODE_DONE
        else:
            print(f"📉 [MT5 Execution] Closed position #{ticket} successfully.")
            self.simulated_positions = [p for p in self.simulated_positions if p['ticket'] != ticket]
            return True

    def manage_trailing_stops(self):
        # Trailing stop logic to protect profits
        pass

    def disconnect(self):
        if HAS_MT5_LIB and self.connected:
            mt5.shutdown()
