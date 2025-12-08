
# معيار توحيد Middleware - MyNet.tn

## 📋 قاعدة ذهبية: استخدم Named Imports دائماً

### ✅ الطريقة الصحيحة (REQUIRED):
```javascript
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const { validationMiddleware } = require('../middleware/validationMiddleware');
const { validateIdMiddleware } = require('../middleware/validateIdMiddleware');
```

### ❌ الطريقة الخاطئة (FORBIDDEN):
```javascript
const authMiddleware = require('../middleware/authMiddleware'); // ❌
router.get('/path', authMiddleware, handler); // ❌ سيفشل
```

---

## 🛡️ Middleware المتاحة

### 1. Authentication & Authorization
**من `authMiddleware.js`:**
- `verifyToken` - التحقق من JWT token
- `checkRole(['admin', 'buyer'])` - التحقق من الصلاحيات
- `checkPermission('create_tender')` - التحقق من الأذونات

**استخدام:**
```javascript
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// مصادقة فقط
router.get('/data', verifyToken, handler);

// مصادقة + صلاحيات
router.post('/admin/action', verifyToken, checkRole(['admin']), handler);
```

### 2. Input Validation
**من `validationMiddleware.js`:**
- `validationMiddleware` - تنظيف جميع المدخلات (XSS, SQL injection)

**استخدام:**
```javascript
const { validationMiddleware } = require('../middleware/validationMiddleware');

// تطبيق عام على جميع المسارات
router.use(validationMiddleware);
```

### 3. ID Parameter Validation
**من `validateIdMiddleware.js`:**
- `validateIdMiddleware(paramName)` - التحقق من معرّف واحد
- `validateIdMiddleware([param1, param2])` - التحقق من عدة معرّفات

**استخدام:**
```javascript
const { validateIdMiddleware } = require('../middleware/validateIdMiddleware');

router.get('/tender/:id', validateIdMiddleware('id'), verifyToken, handler);
router.get('/tender/:tenderId/offer/:offerId', 
  validateIdMiddleware(['tenderId', 'offerId']), 
  verifyToken, 
  handler
);
```

---

## 📐 النمط القياسي لملف Route

```javascript
const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const { validationMiddleware } = require('../middleware/validationMiddleware');
const { validateIdMiddleware } = require('../middleware/validateIdMiddleware');

// 1. تطبيق التحقق العام (Global Validation)
router.use(validationMiddleware);

// 2. مسارات عامة (Public Routes)
router.get('/public-data', async (req, res) => {
  // logic
});

// 3. مسارات محمية (Protected Routes)
router.get('/data', verifyToken, async (req, res) => {
  // logic
});

// 4. مسارات بمعرّفات (ID-based Routes)
router.get('/:id', 
  validateIdMiddleware('id'), 
  verifyToken, 
  async (req, res) => {
    // logic
  }
);

// 5. مسارات للمشرفين فقط (Admin-only Routes)
router.post('/admin/create', 
  verifyToken, 
  checkRole(['admin', 'super_admin']), 
  async (req, res) => {
    // logic
  }
);

module.exports = router;
```

---

## 🔍 أمر التحقق السريع

للبحث عن استيرادات خاطئة:
```bash
# البحث عن استيرادات authMiddleware الخاطئة
grep -r "require.*authMiddleware.*)" backend/routes/ | grep -v "verifyToken\|checkRole"

# البحث عن ملفات لا تستخدم validationMiddleware
grep -L "validationMiddleware" backend/routes/*.js
```

---

## ✅ Checklist لكل ملف Routes

- [ ] استيراد `verifyToken` من `authMiddleware`
- [ ] تطبيق `validationMiddleware` عالمياً
- [ ] استخدام `validateIdMiddleware` لجميع المسارات بمعرّفات
- [ ] استخدام `checkRole` للمسارات المحمية بصلاحيات
- [ ] عدم استيراد `authMiddleware` كـ default export

---

## 🚨 أخطاء شائعة يجب تجنبها

1. ❌ `const authMiddleware = require(...)` 
   ✅ `const { verifyToken } = require(...)`

2. ❌ `router.get('/path', authMiddleware, ...)`
   ✅ `router.get('/path', verifyToken, ...)`

3. ❌ عدم استخدام `validationMiddleware`
   ✅ `router.use(validationMiddleware)`

4. ❌ عدم التحقق من معرّفات URL
   ✅ `router.get('/:id', validateIdMiddleware('id'), ...)`
