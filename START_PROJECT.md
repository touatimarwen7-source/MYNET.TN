# 🚀 دليل تشغيل المشروع - MyNet.tn

## ✅ التحقق من المتطلبات

- ✅ Node.js: v24.11.0
- ✅ npm: 11.6.1
- ✅ Backend .env: موجود
- ✅ Frontend .env: موجود
- ✅ قاعدة البيانات: Neon configured

---

## 🚀 طريقة التشغيل

### الطريقة 1: تشغيل Backend و Frontend معاً

```bash
npm run dev
```

سيتم تشغيل:
- Backend على: http://localhost:3000
- Frontend على: http://localhost:5000

### الطريقة 2: تشغيل منفصل

#### Backend فقط:
```bash
npm run dev:backend
# أو
cd backend
npm run dev
```

#### Frontend فقط:
```bash
npm run dev:frontend
# أو
cd frontend
npm run dev
```

---

## 📋 قبل التشغيل

### 1. تأكد من ملفات .env

- ✅ `backend/.env` - موجود
- ✅ `frontend/.env` - موجود

### 2. تأكد من قاعدة البيانات

قاعدة بيانات Neon محددة في `backend/.env`:
```
DATABASE_URL=postgresql://neondb_owner:npg_6QbcPhxVJZ0M@ep-lively-resonance-a4f2drvy-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 3. تأكد من JWT_SECRET

في `backend/.env` يجب أن يكون:
```
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_minimum_32_characters_long_change_this_in_production
```

---

## 🎯 تشغيل المشروع الآن

### الخطوة 1: تثبيت Dependencies (إذا لزم الأمر)

```bash
npm run install:all
```

### الخطوة 2: تشغيل المشروع

```bash
npm run dev
```

---

## 🌐 الوصول للتطبيق

بعد التشغيل:

- **Frontend**: http://localhost:5000
- **Backend API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api-docs

---

## 🔍 التحقق من التشغيل

### Backend
- يجب أن ترى: `✅ Database initialized successfully`
- يجب أن ترى: `🚀 Server running on port 3000`

### Frontend
- يجب أن ترى: `VITE ready in XXX ms`
- يجب أن ترى: `Local: http://localhost:5000`

---

## ⚠️ حل المشاكل

### مشكلة: "Cannot find module"
```bash
# أعد تثبيت dependencies
npm run install:all
```

### مشكلة: "Port already in use"
```bash
# ابحث عن العملية
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# أو غير المنفذ في .env
```

### مشكلة: "Database connection failed"
- تحقق من DATABASE_URL في `backend/.env`
- تأكد من أن قاعدة البيانات متاحة
- تحقق من الاتصال بالإنترنت

---

## 📝 ملاحظات

- Backend يحتاج قاعدة بيانات Neon للعمل
- Frontend يحتاج Backend للعمل
- يمكن تشغيل Backend و Frontend بشكل منفصل

---

**جاهز للتشغيل!** 🚀

