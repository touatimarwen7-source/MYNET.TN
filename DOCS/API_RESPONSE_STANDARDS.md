
# 📋 معايير استجابة API الموحدة - MyNet.tn

**آخر تحديث:** 2025-01-04  
**الإصدار:** v1.3.0

---

## 🎯 هيكل الاستجابة القياسي

### ✅ استجابة النجاح (Success Response)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "عملية ناجحة",
  "data": {
    // البيانات المطلوبة
  },
  "timestamp": "2025-01-04T10:30:45.123Z",
  "requestId": "req_abc123xyz"
}
```

### ❌ استجابة الخطأ (Error Response)

```json
{
  "success": false,
  "statusCode": 400,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "خطأ في التحقق من البيانات",
    "details": [
      {
        "field": "email",
        "message": "البريد الإلكتروني مطلوب",
        "code": "REQUIRED_FIELD"
      }
    ]
  },
  "timestamp": "2025-01-04T10:30:45.123Z",
  "requestId": "req_abc123xyz",
  "path": "/api/auth/register"
}
```

---

## 📊 رموز الحالة HTTP القياسية

### **2xx - نجاح العملية**

| الرمز | الاستخدام | مثال |
|------|-----------|------|
| 200 OK | نجاح GET, PUT, PATCH, DELETE | `GET /api/tenders` |
| 201 Created | نجاح POST لإنشاء مورد | `POST /api/tenders` |
| 204 No Content | نجاح DELETE بدون محتوى | `DELETE /api/tenders/:id` |

### **4xx - أخطاء العميل**

| الرمز | الاستخدام | رمز الخطأ |
|------|-----------|-----------|
| 400 Bad Request | بيانات غير صحيحة | `VALIDATION_ERROR` |
| 401 Unauthorized | غير مصادق عليه | `UNAUTHORIZED` |
| 403 Forbidden | ممنوع الوصول | `FORBIDDEN` |
| 404 Not Found | المورد غير موجود | `NOT_FOUND` |
| 409 Conflict | تعارض في البيانات | `CONFLICT` |
| 422 Unprocessable Entity | كيان غير قابل للمعالجة | `UNPROCESSABLE_ENTITY` |
| 429 Too Many Requests | تجاوز الحد المسموح | `RATE_LIMIT_EXCEEDED` |

### **5xx - أخطاء الخادم**

| الرمز | الاستخدام | رمز الخطأ |
|------|-----------|-----------|
| 500 Internal Server Error | خطأ في الخادم | `INTERNAL_SERVER_ERROR` |
| 502 Bad Gateway | بوابة غير صحيحة | `BAD_GATEWAY` |
| 503 Service Unavailable | الخدمة غير متاحة | `SERVICE_UNAVAILABLE` |

---

## 🔤 رموز الأخطاء الموحدة

### **أخطاء التحقق (V001-V099)**
- `VALIDATION_ERROR` - خطأ عام في التحقق
- `REQUIRED_FIELD` - حقل مطلوب
- `INVALID_EMAIL` - بريد إلكتروني غير صحيح
- `INVALID_PHONE` - رقم هاتف غير صحيح
- `INVALID_FORMAT` - صيغة غير صحيحة

### **أخطاء المصادقة (A001-A099)**
- `UNAUTHORIZED` - غير مصادق عليه
- `INVALID_CREDENTIALS` - بيانات اعتماد غير صحيحة
- `TOKEN_EXPIRED` - انتهت صلاحية التوكن
- `INVALID_TOKEN` - توكن غير صحيح

### **أخطاء الصلاحيات (P001-P099)**
- `FORBIDDEN` - ممنوع الوصول
- `INSUFFICIENT_PERMISSIONS` - صلاحيات غير كافية
- `ROLE_NOT_AUTHORIZED` - الدور غير مصرح له

### **أخطاء الموارد (R001-R099)**
- `NOT_FOUND` - المورد غير موجود
- `RESOURCE_NOT_FOUND` - المورد المحدد غير موجود
- `ALREADY_EXISTS` - المورد موجود بالفعل
- `CONFLICT` - تعارض في البيانات

### **أخطاء الخادم (S001-S099)**
- `INTERNAL_SERVER_ERROR` - خطأ داخلي في الخادم
- `DATABASE_ERROR` - خطأ في قاعدة البيانات
- `SERVICE_UNAVAILABLE` - الخدمة غير متاحة

---

## 📝 أمثلة تطبيقية

### مثال 1: تسجيل مستخدم ناجح (POST 201)

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "role": "buyer"
}
```

**Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "تم التسجيل بنجاح",
  "data": {
    "user": {
      "id": 123,
      "email": "user@example.com",
      "role": "buyer"
    },
    "accessToken": "eyJhbGc..."
  },
  "timestamp": "2025-01-04T10:30:45.123Z",
  "requestId": "req_abc123"
}
```

### مثال 2: خطأ التحقق (POST 400)

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "invalid-email",
  "password": "123"
}
```

**Response:**
```json
{
  "success": false,
  "statusCode": 400,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "فشل التحقق من البيانات",
    "details": [
      {
        "field": "email",
        "message": "صيغة البريد الإلكتروني غير صحيحة",
        "code": "INVALID_EMAIL"
      },
      {
        "field": "password",
        "message": "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل",
        "code": "PASSWORD_TOO_SHORT"
      }
    ]
  },
  "timestamp": "2025-01-04T10:30:45.123Z",
  "requestId": "req_abc124",
  "path": "/api/auth/register"
}
```

### مثال 3: غير مصرح (GET 401)

**Request:**
```http
GET /api/procurement/my-tenders
```

**Response:**
```json
{
  "success": false,
  "statusCode": 401,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "يجب تسجيل الدخول للوصول إلى هذا المورد"
  },
  "timestamp": "2025-01-04T10:30:45.123Z",
  "requestId": "req_abc125",
  "path": "/api/procurement/my-tenders"
}
```

### مثال 4: ممنوع الوصول (GET 403)

**Request:**
```http
GET /api/admin/users
Authorization: Bearer <supplier_token>
```

**Response:**
```json
{
  "success": false,
  "statusCode": 403,
  "error": {
    "code": "FORBIDDEN",
    "message": "ليس لديك الصلاحيات الكافية",
    "details": {
      "requiredRole": "admin",
      "currentRole": "supplier"
    }
  },
  "timestamp": "2025-01-04T10:30:45.123Z",
  "requestId": "req_abc126",
  "path": "/api/admin/users"
}
```

### مثال 5: مورد غير موجود (GET 404)

**Request:**
```http
GET /api/procurement/tenders/99999
```

**Response:**
```json
{
  "success": false,
  "statusCode": 404,
  "error": {
    "code": "NOT_FOUND",
    "message": "العطاء غير موجود",
    "details": {
      "resource": "Tender",
      "id": 99999
    }
  },
  "timestamp": "2025-01-04T10:30:45.123Z",
  "requestId": "req_abc127",
  "path": "/api/procurement/tenders/99999"
}
```

### مثال 6: تعارض في البيانات (POST 409)

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "existing@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": false,
  "statusCode": 409,
  "error": {
    "code": "CONFLICT",
    "message": "البريد الإلكتروني مستخدم بالفعل",
    "details": {
      "field": "email",
      "value": "existing@example.com"
    }
  },
  "timestamp": "2025-01-04T10:30:45.123Z",
  "requestId": "req_abc128",
  "path": "/api/auth/register"
}
```

### مثال 7: تجاوز الحد المسموح (POST 429)

**Request:**
```http
POST /api/auth/login
```

**Response:**
```json
{
  "success": false,
  "statusCode": 429,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "تجاوزت الحد الأقصى للطلبات. يرجى المحاولة لاحقاً",
    "details": {
      "retryAfter": 60,
      "limit": 5,
      "window": "15 minutes"
    }
  },
  "timestamp": "2025-01-04T10:30:45.123Z",
  "requestId": "req_abc129",
  "path": "/api/auth/login"
}
```

### مثال 8: خطأ في الخادم (GET 500)

**Request:**
```http
GET /api/procurement/tenders
```

**Response:**
```json
{
  "success": false,
  "statusCode": 500,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "حدث خطأ داخلي في الخادم. يرجى المحاولة لاحقاً"
  },
  "timestamp": "2025-01-04T10:30:45.123Z",
  "requestId": "req_abc130",
  "path": "/api/procurement/tenders"
}
```

---

## 🔧 تطبيق المعايير في الكود

### استخدام ErrorResponseFormatter

```javascript
const { ErrorResponseFormatter } = require('../utils/errorHandler');

// نجاح
return res.status(200).json(
  ErrorResponseFormatter.success(data, 'تم بنجاح')
);

// خطأ تحقق
return res.status(400).json(
  ErrorResponseFormatter.validationError(errors)
);

// غير مصرح
return res.status(401).json(
  ErrorResponseFormatter.authorizationError('يجب تسجيل الدخول')
);

// غير موجود
return res.status(404).json(
  ErrorResponseFormatter.notFoundError('Tender')
);
```

---

## ✅ قائمة التحقق للمطورين

- [ ] استخدام رمز الحالة الصحيح (200, 201, 400, 404, إلخ)
- [ ] استخدام ErrorResponseFormatter لجميع الاستجابات
- [ ] إضافة requestId لكل استجابة
- [ ] تضمين timestamp بصيغة ISO 8601
- [ ] استخدام رموز الأخطاء الموحدة
- [ ] تضمين path في استجابات الأخطاء
- [ ] توثيق جميع المسارات باستخدام JSDoc
- [ ] اختبار جميع حالات الأخطاء المحتملة

---

**MyNet.tn: استجابات API موحدة واحترافية** ✅
