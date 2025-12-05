# 🔧 إعداد قاعدة البيانات Neon - MyNet.tn

## 📋 معلومات الاتصال

تم توفير معلومات الاتصال بقاعدة بيانات Neon:

```
postgresql://neondb_owner:npg_6QbcPhxVJZ0M@ep-lively-resonance-a4f2drvy-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## ✅ الخطوات المطلوبة

### 1. إنشاء ملف .env في Backend

```bash
cd backend
cp .env.example .env
```

### 2. تعديل ملف .env

افتح `backend/.env` وأضف/عدّل السطر التالي:

```env
DATABASE_URL=postgresql://neondb_owner:npg_6QbcPhxVJZ0M@ep-lively-resonance-a4f2drvy-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 3. التحقق من الإعدادات

تأكد من أن الملف يحتوي على:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://neondb_owner:npg_6QbcPhxVJZ0M@ep-lively-resonance-a4f2drvy-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_minimum_32_characters_long_change_this_in_production
```

### 4. اختبار الاتصال

```bash
cd backend
npm run dev
```

## ⚠️ ملاحظات مهمة

1. **ملف .env محمي من Git** - لا تقلق، لن يتم رفعه
2. **DATABASE_URL مطلوب** - بدونها لن يعمل Backend
3. **JWT_SECRET مطلوب** - بدونها لن يعمل Authentication

## 🔍 حل المشاكل

### مشكلة: "Missing required environment variable: DATABASE_URL"

**الحل**: تأكد من وجود `DATABASE_URL` في `backend/.env`

### مشكلة: "Database connection failed"

**الحل**: 
- تحقق من صحة DATABASE_URL
- تأكد من أن قاعدة البيانات متاحة
- تحقق من إعدادات SSL

### مشكلة: "Connection timeout"

**الحل**:
- تحقق من الاتصال بالإنترنت
- تأكد من أن عنوان قاعدة البيانات صحيح
- تحقق من Firewall settings

