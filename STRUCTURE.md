# 📁 هيكل المشروع - MyNet.tn

## البنية النهائية

```
workspace/
│
├── 📂 backend/                 Backend API Server
│   ├── config/                 التكوينات
│   ├── security/               الأمان والمصادقة
│   ├── models/                 نماذج البيانات
│   ├── services/               الخدمات الأساسية
│   ├── controllers/            المتحكمات
│   ├── routes/                 المسارات
│   ├── middleware/             معالجة الأخطاء
│   ├── utils/                  أدوات مساعدة
│   ├── server.js               نقطة دخول Backend
│   ├── app.js                  تطبيق Express
│   ├── package.json
│   └── README.md (موجود)
│
├── 📂 frontend/                React Frontend
│   ├── src/
│   │   ├── pages/              7 صفحات جاهزة
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── TenderList.jsx
│   │   │   ├── TenderDetail.jsx
│   │   │   ├── CreateTender.jsx
│   │   │   ├── MyOffers.jsx
│   │   │   └── Profile.jsx
│   │   ├── api.js              خدمة الاتصالات
│   │   ├── App.jsx             التطبيق الرئيسي
│   │   ├── App.css             الأنماط
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── node_modules/
│   ├── dist/                   Build output
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
├── 📄 server.js                Backend Entry Point
├── 📄 package.json             Root dependencies
├── 📄 README.md                توثيق شامل
├── 📄 STRUCTURE.md             هذا الملف
└── 📄 .env                     متغيرات البيئة
```

## 🚀 كيفية التشغيل

### Backend
```bash
# من الجذر
PORT=5000 npm run dev
```
**يعمل على**: http://localhost:5000

### Frontend
```bash
# من المجلد frontend
cd frontend
npm run dev
```
**يعمل على**: http://localhost:5000

## 📦 المحتويات

### Backend ✅
- ✅ 10 جداول قاعدة بيانات
- ✅ نظام أمان JWT متقدم
- ✅ RBAC (نظام الأدوار والصلاحيات)
- ✅ 20+ API endpoint
- ✅ معالجة أخطاء مركزية
- ✅ نظام البحث المتقدم
- ✅ نظام الإشعارات

### Frontend ✅
- ✅ 7 صفحات React جاهزة
- ✅ React Router للتنقل
- ✅ Axios للاتصالات
- ✅ تصميم عربي RTL
- ✅ CSS حديث وجميل
- ✅ معالجة التوكنات تلقائية

## 🔌 الاتصال

Frontend → `/api` → Backend على نفس port (5000)

## ⚙️ Environment Variables

**Backend (.env)**
```
DATABASE_URL=postgresql://...
JWT_SECRET=secret_key
JWT_REFRESH_SECRET=refresh_key
PORT=5000
NODE_ENV=development
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000/api
```

## 📊 قاعدة البيانات

جداول المتوفرة:
- users
- tenders
- offers
- purchase_orders
- invoices
- notifications
- messages
- reviews
- user_profiles

## 🎯 الدور الأساسي المدعوم

1. Admin
2. Buyer
3. Supplier
4. Accountant
5. Viewer

---

**النظام جاهز للعمل الفوري! 🎉**
