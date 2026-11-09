# ICT-SMC-BOT • MetaTrader 5 & Gemini AI Automated Trading System

> بوت التداول المؤسسي الكامل المتكامل لمنصة **MetaTrader 5 (MT5)** المدعوم بنموذج **Google Gemini 3.8 Flash** واستراتيجيات **Smart Money Concepts (SMC) & ICT**.

---

## 🌟 مميزات البوت الرئيسية (Key Features)

1. **كشف نماذج ICT & SMC المؤسسية آلياً:**
   - كتل الأوامر (**Order Blocks**).
   - فجوات القيمة العادلة (**Fair Value Gaps - FVG**).
   - سحب السيولة (**Liquidity Sweeps**) وكسر هيكل السوق (**MSS / BOS**).
   - توقيتات الجلسات الحساسة (**London Open** و **New York Silver Bullet Killzones**).

2. **فلترة وتأكيد الصفقات عبر الذكاء الاصطناعي (Google Gemini 3.8 Flash):**
   - استشارة نموذج الذكاء الاصطناعي قبل فتح كل صفقة للتأكد من عدم وجود مصائد سيولة.
   - حساب دقيق لوقف الخسارة وأهداف الأرباح بنسبة عائد إلى مخاطرة **1:3.5 RRR**.

3. **التنفيذ التلقائي لفتح وإغلاق الصفقات في MetaTrader 5 (MT5):**
   - فتح صفقات الشراء والبيع فوري عبر دالة `TRADE_ACTION_DEAL`.
   - إدارة الصفقات وتفعيل وقف الخسارة المتحرك (**Trailing Stop**).
   - إغلاق الصفقات تلقائياً عند تحقيق الهدف أو كسر منطقة الهيكل.

---

## 🚀 طريقة التشغيل والربط بـ MT5 في 3 دقائق:

### 1. تثبيت الحزم المطلوبة:
```bash
pip install -r requirements.txt
```

### 2. ضبط إعدادات حسابك في `config.py`:
افتح ملف `config.py` واكتب رقم حسابك وسيرفر شركة الوساطة الخاصة بك:
```python
BOT_CONFIG = {
    'MT5_LOGIN': 58924012,          # رقم حسابك في MT5
    'MT5_PASSWORD': 'YourPassword', # كلمة السر
    'MT5_SERVER': 'MetaQuotes-Demo',# اسم السيرفر (مثال: Exness-Real أو ICMarkets-Live)
    'DEFAULT_LOTS': 0.50,           # حجم العقد الافتراضي
    ...
}
```

### 3. تفعيل التداول الآلي داخل برنامج MetaTrader 5:
- افتح برنامج **MetaTrader 5**.
- اذهب إلى القائمة: `Tools` ➔ `Options` ➔ `Expert Advisors`.
- ضع علامة صح على:
  - ✅ **Allow algorithmic trading**
  - ✅ **Allow WebRequest for listed URL**

### 4. تشغيل البوت:
```bash
python main.py
```
سيبدأ البوت فوراً بفحص السوق وفتح الصفقات المؤكدة وإغلاقها تلقائياً على منصة MT5!

---

## 📦 رفع المشروع إلى GitHub:
```bash
git init
git add .
git commit -m "feat: complete autonomous ICT-SMC-BOT for MetaTrader 5"
git branch -M main
git remote add origin https://github.com/oabufodeh/ICT-SMC-BOT.git
git push -u origin main
```
