# 📚 دليل فهم المشروع - MyNet.tn

**تاريخ الإنشاء**: 2025-12-04  
**الإصدار**: 1.2.0

---

## 🎯 نظرة عامة على المشروع

### ما هو MyNet.tn؟

**MyNet.tn** هو منصة B2B شاملة لإدارة المشتريات والمناقصات الإلكترونية في تونس. المنصة تربط بين المشترين (Buyers) والموردين (Suppliers) لإدارة دورة حياة كاملة للمناقصات من الإنشاء حتى الدفع.

### الهدف الرئيسي

تسهيل عملية إدارة المناقصات الإلكترونية بشكل آمن وشفاف وفعال بين الشركات التونسية.

---

## 🏗️ البنية المعمارية

### Stack التكنولوجي

#### Backend
```
Express.js (Node.js)
├── PostgreSQL (قاعدة البيانات)
├── Redis (التخزين المؤقت)
├── Socket.io (الاتصال الفوري)
├── JWT (المصادقة)
└── AES-256 (التشفير)
```

#### Frontend
```
React 18 + Vite
├── Material-UI (واجهة المستخدم)
├── React Router (التنقل)
├── Axios (طلبات HTTP)
├── i18next (الترجمة - الفرنسية)
└── Socket.io Client (الاتصال الفوري)
```

### هيكل المشروع

```
MYNETTN04-12/
├── backend/              # الخادم الخلفي
│   ├── routes/           # 42 ملف route
│   ├── controllers/     # 14 ملف controller
│   ├── services/        # 34 ملف service
│   ├── middleware/     # 39 ملف middleware
│   ├── models/          # 14 ملف model
│   ├── config/          # إعدادات قاعدة البيانات والخدمات
│   └── utils/           # أدوات مساعدة
│
├── frontend/            # الواجهة الأمامية
│   └── src/
│       ├── pages/       # 139+ صفحة
│       ├── components/  # 83+ مكون
│       ├── services/    # خدمات API
│       ├── contexts/    # React Contexts
│       ├── hooks/       # Custom Hooks
│       └── utils/       # أدوات مساعدة
│
└── DOCS/                # 87+ ملف توثيق
```

---

## 👥 الأدوار والصلاحيات

### الأدوار المتاحة

1. **Buyer (المشتري)**
   - إنشاء المناقصات
   - تقييم العروض
   - اختيار الفائزين
   - إدارة أوامر الشراء

2. **Supplier (المورد)**
   - البحث عن المناقصات
   - تقديم العروض
   - إدارة المنتجات/الخدمات
   - إنشاء الفواتير

3. **Admin (المدير)**
   - إدارة المستخدمين
   - إدارة المحتوى
   - الإحصائيات والتقارير

4. **Super Admin (المدير العام)**
   - إدارة النظام بالكامل
   - النسخ الاحتياطي والاستعادة
   - إدارة الاشتراكات
   - التحكم في الميزات

5. **Viewer (المشاهد)**
   - عرض المناقصات فقط
   - لا يمكنه التعديل

### نظام الصلاحيات (RBAC)

```javascript
// مثال على الصلاحيات
const permissions = {
  buyer: [
    'CREATE_TENDER',
    'VIEW_TENDER',
    'EVALUATE_OFFER',
    'AWARD_TENDER'
  ],
  supplier: [
    'VIEW_TENDER',
    'SUBMIT_OFFER',
    'MANAGE_PRODUCTS',
    'CREATE_INVOICE'
  ],
  admin: [
    'MANAGE_USERS',
    'MANAGE_CONTENT',
    'VIEW_ANALYTICS'
  ]
};
```

---

## 🔄 سير العمل الكامل (Complete Workflow)

### المرحلة 1: إنشاء المناقصة (Tender Creation)

#### الخطوات:

1. **المشتري ينشئ المناقصة**
   - الواجهة: `CreateTenderWizard.jsx` (8 خطوات)
   - الحالة: `draft`
   - البيانات المطلوبة:
     - العنوان والوصف
     - التصنيف (UNSPSC)
     - الميزانية (min/max)
     - المواعيد النهائية
     - المتطلبات (تقنية، تجارية، إدارية، قانونية)
     - معايير التقييم
     - المرفقات

2. **نشر المناقصة**
   - API: `POST /api/procurement/tenders/:id/publish`
   - الحالة: `draft` → `published` (Ouverte)
   - الإشعارات: يتم إرسال إشعار لجميع الموردين
   - السجل: يتم تسجيل العملية في Audit Log

#### الملفات الرئيسية:

```
Backend:
- routes/procurementRoutes.js
- services/TenderService.js
- controllers/procurement/TenderController.js

Frontend:
- pages/CreateTenderWizard.jsx
- pages/TenderList.jsx
```

---

### المرحلة 2: تقديم العروض (Offer Submission)

#### الخطوات:

1. **المورد يبحث عن المناقصات**
   - الواجهة: `TenderList.jsx`
   - الفلاتر: التصنيف، الميزانية، الموعد النهائي
   - البحث: نص حر

2. **المورد يقدم عرضاً**
   - الواجهة: `CreateBid.jsx` (8 خطوات)
   - API: `POST /api/procurement/offers`
   - الحالة: `submitted` (Soumis)
   - البيانات:
     - العرض التقني
     - المواصفات
     - **البيانات المالية (مشفرة AES-256)** 🔒
     - شروط الدفع (مشفرة) 🔒
     - وقت التسليم
     - المرفقات
     - الإعلانات

3. **إغلاق المناقصة تلقائياً**
   - Trigger: Scheduled Job عند الموعد النهائي
   - الحالة: `published` → `closed` (Fermée)
   - الإجراء: رفض أي عروض جديدة بعد الموعد النهائي

#### الملفات الرئيسية:

```
Backend:
- routes/procurementRoutes.js
- services/OfferService.js
- jobs/tenderAutoCloseJob.js

Frontend:
- pages/CreateBid.jsx
- pages/BidSubmission.jsx
```

---

### المرحلة 3: التقييم والاختيار (Evaluation & Award)

#### الخطوات:

1. **مراجعة العروض**
   - الواجهة: `TenderEvaluation.jsx`
   - المشتري يرى جميع العروض في جدول مقارنة
   - فك التشفير التلقائي للبيانات المالية

2. **تقييم العروض**
   - API: `POST /api/procurement/offers/:id/evaluate`
   - الحالة: `submitted` → `evaluated`
   - البيانات:
     - `evaluation_score`: النتيجة المحسوبة
     - `evaluation_notes`: ملاحظات المشتري

3. **اختيار الفائز(ين)**
   - الواجهة: `TenderAwarding.jsx`
   - الميزة: دعم اختيار عدة موردين (Partial Award)
   - الحالة:
     - الفائز: `accepted` (Gagnant)
     - الخاسرون: `rejected` (Perdu)
     - المناقصة: `awarded` (Adjugée)

4. **الإشعارات**
   - للفائز: إشعار بالفوز مع التفاصيل
   - للخاسرين: إشعار بالرفض

#### الملفات الرئيسية:

```
Backend:
- routes/offerEvaluationRoutes.js
- routes/tenderManagementRoutes.js
- services/TenderAwardService.js

Frontend:
- pages/TenderEvaluation.jsx
- pages/TenderAwarding.jsx
- pages/PartialAward.jsx
```

---

### المرحلة 4: ما بعد الاختيار (Post-Award)

#### الخطوات:

1. **أوامر الشراء (Purchase Orders)**
   - الواجهة: `PurchaseOrders.jsx`
   - API: `POST /api/procurement/purchase-orders`
   - يتم إنشاء أمر شراء من العرض الفائز

2. **طلبات التوريد (Supply Requests)**
   - الواجهة: `CreateSupplyRequest.jsx` (8 خطوات)
   - المورد ينشئ طلب توريد مرتبط بأمر الشراء

3. **الفواتير (Invoices)**
   - الواجهة: `CreateInvoice.jsx` (8 خطوات)
   - API: `POST /api/procurement/invoices`
   - حساب الضرائب التلقائي (19%)
   - ربط بالفواتير بأوامر الشراء

4. **تتبع الأداء**
   - الواجهة: `PerformanceMonitoring.jsx`
   - تتبع أداء الموردين
   - التقييمات والمراجعات

#### الملفات الرئيسية:

```
Backend:
- routes/purchaseOrdersRoutes.js
- services/InvoiceService.js
- services/PurchaseOrderService.js

Frontend:
- pages/CreateInvoice.jsx
- pages/CreateSupplyRequest.jsx
- pages/PurchaseOrders.jsx
```

---

## 🔐 نظام الأمان

### طبقات الأمان

#### 1. المصادقة (Authentication)

```javascript
// JWT Tokens
- Access Token: صالح لمدة 1 ساعة
- Refresh Token: صالح لمدة 7 أيام
- httpOnly Cookies: لحماية من XSS
- MFA Support: المصادقة متعددة العوامل
```

**الملفات:**
- `backend/security/AuthorizationGuard.js`
- `backend/middleware/authMiddleware.js`
- `backend/middleware/tokenIntegrityMiddleware.js`

#### 2. التفويض (Authorization)

```javascript
// Role-Based Access Control (RBAC)
- Permission-based access
- Role validation
- Resource ownership checks
```

**الملفات:**
- `backend/config/Roles.js`
- `backend/middleware/authorizationMiddleware.js`

#### 3. التشفير (Encryption)

```javascript
// AES-256 Encryption
- البيانات المالية في العروض
- مفاتيح فريدة لكل عملية
- IV (Initialization Vector) عشوائي
```

**الملفات:**
- `backend/security/EncryptionService.js`
- `backend/security/KeyManagementService.js`

#### 4. التحقق من المدخلات (Input Validation)

```javascript
// Multi-layer Validation
- Frontend: Real-time validation
- Backend: Joi schemas
- Middleware: Input sanitization
- SQL Injection prevention
- XSS prevention
```

**الملفات:**
- `backend/middleware/inputSanitizationMiddleware.js`
- `backend/middleware/validationMiddleware.js`
- `backend/middleware/validateIdMiddleware.js`

#### 5. Rate Limiting

```javascript
// Multiple Layers
- Global rate limiting
- Per-user rate limiting
- Per-IP rate limiting
- Per-endpoint rate limiting
- DDoS protection
```

**الملفات:**
- `backend/middleware/enhancedRateLimiting.js`
- `backend/middleware/ddosProtectionMiddleware.js`

---

## 🗄️ قاعدة البيانات

### الجداول الرئيسية (22 جدول)

#### 1. المستخدمون (users)
```sql
- id, username, email, password_hash
- role (buyer/supplier/admin/super_admin/viewer)
- company_name, company_registration
- is_verified, is_active
- mfa_enabled, mfa_secret
```

#### 2. المناقصات (tenders)
```sql
- id, tender_number, title, description
- category, budget_min, budget_max
- status (draft/published/closed/awarded)
- publish_date, deadline, opening_date
- buyer_id, requirements (JSONB)
- evaluation_criteria (JSONB)
```

#### 3. العروض (offers)
```sql
- id, tender_id, supplier_id
- offer_number, total_amount
- status (submitted/evaluated/accepted/rejected)
- encrypted_data (AES-256)
- evaluation_score, evaluation_notes
- is_winner
```

#### 4. أوامر الشراء (purchase_orders)
```sql
- id, po_number, tender_id, offer_id
- supplier_id, buyer_id
- total_amount, status
- issue_date, delivery_date
- items (JSONB)
```

#### 5. الفواتير (invoices)
```sql
- id, invoice_number, po_id
- supplier_id, buyer_id
- amount, tax_amount, total_amount
- status (pending/paid/cancelled)
- issue_date, due_date, payment_date
```

#### 6. الإشعارات (notifications)
```sql
- id, user_id, type, title, message
- is_read, created_at
- related_entity_type, related_entity_id
```

#### 7. سجلات التدقيق (audit_logs)
```sql
- id, user_id, action, entity_type
- entity_id, details (JSONB)
- ip_address, user_agent
- created_at
```

### العلاقات

```
users (1) ──→ (N) tenders (buyer_id)
users (1) ──→ (N) offers (supplier_id)
tenders (1) ──→ (N) offers
offers (1) ──→ (N) purchase_orders
purchase_orders (1) ──→ (N) invoices
```

---

## 📡 API Structure

### Endpoints الرئيسية

#### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh-token
POST   /api/auth/logout
POST   /api/auth/password-reset
```

#### Procurement
```
GET    /api/procurement/tenders
POST   /api/procurement/tenders
GET    /api/procurement/tenders/:id
PUT    /api/procurement/tenders/:id
POST   /api/procurement/tenders/:id/publish
POST   /api/procurement/tenders/:id/close

POST   /api/procurement/offers
GET    /api/procurement/offers/:id
POST   /api/procurement/offers/:id/evaluate

GET    /api/procurement/purchase-orders
POST   /api/procurement/purchase-orders

GET    /api/procurement/invoices
POST   /api/procurement/invoices
```

#### Admin
```
GET    /api/admin/users
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id
GET    /api/admin/statistics
```

#### Super Admin
```
GET    /api/super-admin/pages
POST   /api/super-admin/pages
GET    /api/super-admin/backups
POST   /api/super-admin/backups/restore
```

### Request/Response Format

#### Request Example
```json
POST /api/procurement/tenders
{
  "title": "Fourniture de matériel informatique",
  "description": "Description détaillée...",
  "category": "43211500",
  "budget_min": 50000,
  "budget_max": 100000,
  "currency": "TND",
  "deadline": "2025-12-31T23:59:59Z"
}
```

#### Response Example
```json
{
  "success": true,
  "data": {
    "id": 123,
    "tender_number": "TND-2025-00123",
    "title": "Fourniture de matériel informatique",
    "status": "draft",
    "created_at": "2025-12-04T10:00:00Z"
  }
}
```

---

## 🎨 الواجهة الأمامية

### الصفحات الرئيسية (139+ صفحة)

#### للمشترين (Buyers)
- `CreateTenderWizard.jsx` - إنشاء مناقصة
- `BuyerDashboard.jsx` - لوحة التحكم
- `BuyerActiveTenders.jsx` - المناقصات النشطة
- `TenderEvaluation.jsx` - تقييم العروض
- `TenderAwarding.jsx` - اختيار الفائزين
- `PurchaseOrders.jsx` - أوامر الشراء
- `BuyerAnalytics.jsx` - التحليلات

#### للموردين (Suppliers)
- `TenderList.jsx` - قائمة المناقصات
- `CreateBid.jsx` - تقديم عرض
- `SupplierDashboard.jsx` - لوحة التحكم
- `MyOffers.jsx` - عروضي
- `SupplierCatalog.jsx` - الكتالوج
- `CreateInvoice.jsx` - إنشاء فاتورة
- `SupplierAnalytics.jsx` - التحليلات

#### للإدارة (Admin)
- `AdminDashboard.jsx` - لوحة التحكم
- `UserManagement.jsx` - إدارة المستخدمين
- `ContentManagement.jsx` - إدارة المحتوى
- `AnalyticsDashboard.jsx` - التحليلات

#### Super Admin
- `SuperAdminDashboard.jsx` - لوحة التحكم الشاملة
- `BackupRestore.jsx` - النسخ الاحتياطي
- `SubscriptionManagement.jsx` - إدارة الاشتراكات
- `FeatureControl.jsx` - التحكم في الميزات

### المكونات المشتركة (83+ مكون)

- `UnifiedHeader.jsx` - رأس الصفحة الموحد
- `Sidebar.jsx` - القائمة الجانبية
- `TenderCard.jsx` - بطاقة المناقصة
- `StatusBadge.jsx` - شارة الحالة
- `LoadingSpinner.jsx` - مؤشر التحميل
- `ErrorBoundary.jsx` - معالج الأخطاء
- `ToastContainer.jsx` - الإشعارات

---

## 🔔 النظام الإشعاري

### أنواع الإشعارات

1. **إشعارات المناقصات**
   - نشر مناقصة جديدة
   - إغلاق مناقصة
   - تعديل مناقصة

2. **إشعارات العروض**
   - قبول عرض
   - رفض عرض
   - طلب توضيحات

3. **إشعارات الأوامر**
   - إنشاء أمر شراء
   - تحديث حالة الأمر
   - استلام أمر شراء

4. **إشعارات الفواتير**
   - إنشاء فاتورة
   - دفع فاتورة
   - فاتورة مستحقة

### قنوات الإشعارات

- **في الموقع**: Notification Center
- **البريد الإلكتروني**: Email Notifications
- **WebSocket**: إشعارات فورية
- **Push Notifications**: (مخطط)

---

## 📊 التحليلات والتقارير

### التحليلات المتاحة

#### للمشترين
- عدد المناقصات المنشورة
- عدد العروض المستلمة
- متوسط وقت التقييم
- توزيع الميزانيات
- أداء الموردين

#### للموردين
- عدد العروض المقدمة
- معدل الفوز
- إجمالي المبيعات
- المناقصات المفتوحة
- أداء المنافسين

#### للإدارة
- إحصائيات المستخدمين
- نشاط المناقصات
- الإيرادات
- استخدام النظام

---

## 🚀 الأداء والتحسينات

### التحسينات المطبقة

#### Backend
- ✅ Database Connection Pooling
- ✅ Redis Caching (100+ endpoints)
- ✅ Query Optimization مع Indexes
- ✅ Pagination على جميع القوائم
- ✅ Batch Operations

#### Frontend
- ✅ Code Splitting
- ✅ Lazy Loading للصفحات
- ✅ Image Optimization
- ✅ Bundle Size Optimization
- ✅ Memoization
- ✅ Virtual Scrolling

### مقاييس الأداء

| المقياس | القيمة المستهدفة | الحالة |
|---------|------------------|--------|
| First Load Time | < 2s | ✅ |
| API Response Time | < 500ms | ✅ |
| Page Navigation | < 300ms | ✅ |
| Memory Usage | < 50MB | ✅ |

---

## 🌐 الترجمة واللغة

### اللغة الرسمية: الفرنسية (100%)

- ✅ جميع النصوص بالفرنسية
- ✅ التواريخ والأرقام بالصيغة الفرنسية
- ✅ رسائل الخطأ بالفرنسية
- ✅ الوثائق بالفرنسية

**الملفات:**
- `frontend/src/locales/fr/common.json`
- `frontend/src/i18n.js`

---

## 🧪 الاختبارات

### أنواع الاختبارات

#### Backend Tests
- Unit Tests (services.test.js)
- Integration Tests (integration.test.js)
- API Tests (api.integration.test.js)
- Performance Tests (performance.test.js)

#### Frontend Tests
- Component Tests (components.unit.test.js)
- Integration Tests (integration.test.js)
- Utils Tests (utils.test.js)

#### E2E Tests
- Workflow Tests (e2eTests.js)
- UAT Tests (uatTests.js)

---

## 📝 التوثيق

### أنواع التوثيق المتوفرة

1. **API Documentation**
   - ADMIN_API.md (1051 سطر)
   - Swagger/OpenAPI Integration

2. **Security Documentation**
   - SECURITY_AUDIT_REPORT.md
   - SECURITY_IMPLEMENTATION_SUMMARY.md

3. **Implementation Reports**
   - AUDIT_COMPLETION_REPORT.md
   - IMPLEMENTATION_COMPLETE.md
   - WORKFLOW_VERIFICATION.md

4. **Testing Documentation**
   - TEST_REPORT.md
   - TESTING_GUIDE.md

**إجمالي ملفات التوثيق**: 87+ ملف

---

## 🔧 التطوير والصيانة

### كيفية البدء

#### Backend
```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:3000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5000
```

### المتطلبات

- Node.js 20+
- PostgreSQL
- Redis (للـ Caching)
- Environment Variables (.env)

---

## 📈 الإحصائيات

### الكود
- Backend Files: 341+ ملف
- Frontend Files: 200+ ملف
- Total LOC: ~50,000+ سطر
- Documentation: 87+ ملف

### الوظائف
- API Endpoints: 200+ endpoint
- Frontend Pages: 139+ صفحة
- Components: 83+ مكون
- Routes: 42+ route file
- Middleware: 39+ middleware

---

## 🎯 الخلاصة

### ما تم إنجازه

✅ **منصة متكاملة** لإدارة المناقصات  
✅ **أمان شامل** مع تشفير AES-256  
✅ **سير عمل كامل** من الإنشاء حتى الدفع  
✅ **واجهة مستخدم احترافية** متجاوبة  
✅ **توثيق شامل** (87+ ملف)  
✅ **أداء محسّن** مع Caching و Code Splitting  
✅ **ترجمة فرنسية كاملة** (100%)  

### الحالة الحالية

**✅ جاهز للإنتاج** - يمكن النشر بأمان

---

**تاريخ الإنشاء**: 2025-12-04  
**آخر تحديث**: 2025-12-04  
**الإصدار**: 1.2.0

