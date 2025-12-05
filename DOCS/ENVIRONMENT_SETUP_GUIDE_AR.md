# ⚙️ دليل إعداد ملفات Environment - MyNet.tn

**تاريخ الإنشاء**: 2025-12-04

---

## 📋 الملخص

تم إنشاء ملفات `.env.example` للـ Backend و Frontend. هذا الدليل يوضح كيفية إعدادها واستخدامها.

---

## ✅ الملفات التي تم إنشاؤها

1. ✅ `backend/.env.example` - قالب متغيرات البيئة للـ Backend
2. ✅ `frontend/.env.example` - قالب متغيرات البيئة للـ Frontend

---

## 🚀 خطوات الإعداد

### 1. إنشاء ملفات .env من القوالب

```bash
# Backend
cd backend
cp .env.example .env

# Frontend
cd frontend
cp .env.example .env
```

### 2. تعديل ملفات .env بالقيم الصحيحة

افتح الملفات وعدّل القيم حسب بيئتك.

---

## 📝 محتوى ملفات Environment

### Backend (.env.example)

```env
# ============================================
# Application Configuration
# ============================================
NODE_ENV=development
PORT=3000
HOST=0.0.0.0
SKIP_DB_INIT=false

# ============================================
# Database Configuration (PostgreSQL)
# ============================================
# Required: Full database connection string
DATABASE_URL=postgresql://mynet_user:your_password@localhost:5432/mynet_db

# Alternative: Individual database settings
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mynet_db
DB_USER=mynet_user
DB_PASSWORD=your_secure_password_here
DB_SSL=false

# ============================================
# Redis Configuration (Cache)
# ============================================
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# ============================================
# JWT Authentication (REQUIRED)
# ============================================
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_minimum_32_characters_long_change_this_in_production
JWT_EXPIRY=24h
JWT_REFRESH_EXPIRY=7d

# ============================================
# Email Configuration
# ============================================
EMAIL_PROVIDER=gmail
# Options: gmail, sendgrid, resend

# For Gmail (nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password_here
EMAIL_FROM=noreply@mynet.tn
EMAIL_FROM_NAME=MyNet.tn

# For SendGrid
SENDGRID_API_KEY=

# For Resend
RESEND_API_KEY=

# ============================================
# Frontend URL (for email links)
# ============================================
FRONTEND_URL=http://localhost:5000

# ============================================
# Monitoring & Error Tracking (Sentry)
# ============================================
SENTRY_DSN=
SENTRY_ENVIRONMENT=development
SENTRY_TRACES_SAMPLE_RATE=1.0

# ============================================
# Monitoring
# ============================================
MONITORING_ENABLED=true
```

### Frontend (.env.example)

```env
# ============================================
# Application Configuration
# ============================================
VITE_APP_NAME=MyNet.tn
VITE_APP_VERSION=2.0.0
VITE_NODE_ENV=development

# ============================================
# API Configuration
# ============================================
VITE_API_URL=http://localhost:3000
VITE_API_VERSION=v1

# ============================================
# Application URLs
# ============================================
VITE_APP_URL=http://localhost:5000
VITE_PUBLIC_URL=http://localhost:5000

# ============================================
# WebSocket Configuration
# ============================================
VITE_SOCKET_URL=http://localhost:3000
VITE_WS_ENABLED=true

# ============================================
# Monitoring & Error Tracking (Sentry)
# ============================================
VITE_SENTRY_DSN=
VITE_SENTRY_ENVIRONMENT=development

# ============================================
# Feature Flags
# ============================================
VITE_FEATURE_MFA_ENABLED=true
VITE_FEATURE_EMAIL_VERIFICATION=true
VITE_FEATURE_SUBSCRIPTION_TIERS=true
VITE_FEATURE_DARK_MODE=true

# ============================================
# Localization
# ============================================
VITE_DEFAULT_LANGUAGE=fr
VITE_SUPPORTED_LANGUAGES=fr
```

---

## 🔐 المتغيرات المطلوبة (Required)

### Backend

- ✅ **DATABASE_URL** - Required (أو DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD)
- ✅ **JWT_SECRET** - Required (32+ characters)
- ✅ **JWT_REFRESH_SECRET** - Required (32+ characters)

### Frontend

- ✅ **VITE_API_URL** - Required

---

## ⚠️ المتغيرات الاختيارية (Optional)

### Backend

- `REDIS_HOST`, `REDIS_PORT` - Default: localhost:6379
- `EMAIL_PROVIDER` - Default: gmail
- `SENTRY_DSN` - Optional (for error tracking)
- `FRONTEND_URL` - Default: http://localhost:5000

### Frontend

- `VITE_SENTRY_DSN` - Optional
- `VITE_FEATURE_*` - Feature flags
- `VITE_DEFAULT_LANGUAGE` - Default: fr

---

## 🎯 إعدادات الإنتاج (Production)

### Backend

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db?ssl=true
FRONTEND_URL=https://mynet.tn
SENTRY_ENVIRONMENT=production
```

### Frontend

```env
VITE_NODE_ENV=production
VITE_API_URL=https://api.mynet.tn
VITE_APP_URL=https://mynet.tn
VITE_PUBLIC_URL=https://mynet.tn
VITE_SOCKET_URL=wss://ws.mynet.tn
VITE_SENTRY_ENVIRONMENT=production
```

---

## 🔒 الأمان

### ⚠️ تحذيرات مهمة

1. **لا ترفع ملفات .env إلى Git**
   - تأكد من وجود `.env` في `.gitignore`
   - استخدم فقط `.env.example`

2. **استخدم قيم قوية للمفاتيح**
   - JWT_SECRET: 32+ characters
   - JWT_REFRESH_SECRET: 32+ characters
   - DB_PASSWORD: قوي ومعقد

3. **لا تشارك ملفات .env**
   - احتفظ بها محلية فقط
   - استخدم secrets management في الإنتاج

---

## 📝 ملاحظات

### Backend

- `DATABASE_URL` يمكن أن يكون connection string كامل أو متغيرات منفصلة
- `EMAIL_PROVIDER` يدعم: gmail, sendgrid, resend
- `SKIP_DB_INIT` يمكن تعيينه إلى `true` لتخطي تهيئة قاعدة البيانات

### Frontend

- جميع المتغيرات يجب أن تبدأ بـ `VITE_` لتعمل مع Vite
- المتغيرات متاحة في الكود عبر `import.meta.env.VITE_*`
- بعد تغيير `.env`، أعد تشغيل dev server

---

## ✅ Checklist

### Backend Setup

- [ ] نسخ `backend/.env.example` إلى `backend/.env`
- [ ] تعديل `DATABASE_URL` أو إعدادات قاعدة البيانات
- [ ] تعديل `JWT_SECRET` و `JWT_REFRESH_SECRET`
- [ ] إعداد `EMAIL_*` إذا كان البريد الإلكتروني مطلوباً
- [ ] إعداد `SENTRY_DSN` إذا كان Sentry مستخدماً

### Frontend Setup

- [ ] نسخ `frontend/.env.example` إلى `frontend/.env`
- [ ] تعديل `VITE_API_URL` ليشير إلى Backend
- [ ] تعديل `VITE_APP_URL` و `VITE_PUBLIC_URL`
- [ ] إعداد `VITE_SENTRY_DSN` إذا كان Sentry مستخدماً

---

## 🚀 بعد الإعداد

### 1. التحقق من الملفات

```bash
# Backend
ls -la backend/.env

# Frontend
ls -la frontend/.env
```

### 2. اختبار الإعداد

```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

### 3. التحقق من الأخطاء

إذا ظهرت أخطاء متعلقة بـ environment variables:
- تأكد من وجود الملفات `.env`
- تأكد من صحة القيم
- تأكد من عدم وجود مسافات إضافية

---

## 📞 الدعم

إذا واجهت مشاكل في الإعداد:
1. راجع هذا الدليل
2. راجع `README.md`
3. افتح issue على GitHub

---

**آخر تحديث**: 2025-12-04

