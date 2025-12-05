# 🚀 كيفية تشغيل المشروع - MyNet.tn

## ✅ المتطلبات المكتملة

- ✅ Node.js v24.11.0 - مثبت
- ✅ npm 11.6.1 - مثبت
- ✅ Dependencies - مثبتة
- ✅ ملفات .env - موجودة
- ✅ قاعدة بيانات Neon - محددة

---

## 🚀 خطوات التشغيل

### الطريقة السريعة (Backend + Frontend معاً)

```bash
npm run dev
```

سيتم تشغيل:
- **Backend** على http://localhost:3000
- **Frontend** على http://localhost:5000

---

### الطريقة المنفصلة

#### 1. تشغيل Backend فقط

**Terminal 1:**
```bash
cd backend
npm run dev
```

**النتيجة المتوقعة:**
```
========================================
MyNet.tn Backend Server Starting...
========================================
✅ Error tracking initialized
✅ Database initialized successfully
✅ WebSocket initialized
========================================
🚀 Server running on port 3000
📍 Access API at: http://localhost:3000
🔌 WebSocket available at: ws://localhost:3000
========================================
```

#### 2. تشغيل Frontend فقط

**Terminal 2:**
```bash
cd frontend
npm run dev
```

**النتيجة المتوقعة:**
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5000/
➜  Network: use --host to expose
```

---

## 🌐 الوصول للتطبيق

بعد التشغيل، افتح المتصفح:

1. **Frontend (الواجهة الرئيسية)**
   - URL: http://localhost:5000
   - الواجهة الرئيسية للتطبيق

2. **Backend API**
   - URL: http://localhost:3000
   - API endpoints

3. **API Documentation (Swagger)**
   - URL: http://localhost:3000/api-docs
   - توثيق API التفاعلي

---

## ✅ التحقق من التشغيل الصحيح

### Backend يعمل إذا رأيت:

```
✅ Database initialized successfully
🚀 Server running on port 3000
```

### Frontend يعمل إذا رأيت:

```
VITE ready in XXX ms
Local: http://localhost:5000
```

### في المتصفح:

- Frontend: يجب أن ترى صفحة MyNet.tn
- API Docs: يجب أن ترى Swagger UI

---

## 🔧 حل المشاكل الشائعة

### 1. Port Already in Use

**المشكلة**: المنفذ مستخدم بالفعل

**الحل**:
```bash
# Windows - ابحث عن العملية
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# أو غير المنفذ في .env
PORT=3001  # في backend/.env
```

### 2. Database Connection Failed

**المشكلة**: لا يمكن الاتصال بقاعدة البيانات

**الحل**:
1. تحقق من `DATABASE_URL` في `backend/.env`
2. تأكد من أن قاعدة بيانات Neon متاحة
3. تحقق من الاتصال بالإنترنت
4. تحقق من إعدادات SSL

### 3. Module Not Found

**المشكلة**: خطأ في استيراد module

**الحل**:
```bash
# أعد تثبيت dependencies
npm run install:all
```

### 4. JWT_SECRET Missing

**المشكلة**: "Missing required environment variable: JWT_SECRET"

**الحل**:
1. افتح `backend/.env`
2. تأكد من وجود:
   ```
   JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
   JWT_REFRESH_SECRET=your_super_secret_refresh_key_minimum_32_characters_long
   ```

---

## 📋 Checklist قبل التشغيل

- [ ] Node.js 20+ مثبت
- [ ] npm 10+ مثبت
- [ ] `backend/.env` موجود ومحدد
- [ ] `frontend/.env` موجود ومحدد
- [ ] `DATABASE_URL` محددة في `backend/.env`
- [ ] `JWT_SECRET` و `JWT_REFRESH_SECRET` محددة
- [ ] Dependencies مثبتة (`npm run install:all`)

---

## 🎯 الأوامر المفيدة

### تثبيت Dependencies
```bash
npm run install:all
```

### تشغيل المشروع
```bash
npm run dev
```

### تشغيل Backend فقط
```bash
npm run dev:backend
```

### تشغيل Frontend فقط
```bash
npm run dev:frontend
```

### إيقاف المشروع
اضغط `Ctrl + C` في Terminal

---

## 📝 ملاحظات مهمة

1. **قاعدة البيانات**: المشروع يستخدم قاعدة بيانات Neon
   - محددة في `backend/.env`
   - يجب أن تكون متاحة عبر الإنترنت

2. **المنافذ**:
   - Backend: 3000
   - Frontend: 5000
   - تأكد من أنها غير مستخدمة

3. **البيئة**:
   - Development: `NODE_ENV=development`
   - Production: `NODE_ENV=production`

---

## 🎉 جاهز للتشغيل!

المشروع جاهز الآن. استخدم:

```bash
npm run dev
```

ثم افتح المتصفح على: **http://localhost:5000**

---

**آخر تحديث**: 2025-12-04

