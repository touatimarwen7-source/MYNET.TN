# 🔧 دليل التكامل الفوري للميزات الحرجة

## ✅ الملفات المستعدة للتكامل الفوري

جميع الملفات الجديدة موجودة وجاهزة. يحتاج فقط لـ **4 تعديلات** أساسية:

---

## 1️⃣ تحديث `backend/controllers/authController.js`

أضف في نهاية الملف قبل `module.exports`:

```javascript
// MFA Methods
async setupMFA(req, res) {
    try {
        const userId = req.user.userId;
        const email = req.user.email;
        const MFAValidator = require('../security/MFAValidator');
        
        const secret = MFAValidator.generateSecret(email);
        const backupCodes = MFAValidator.generateBackupCodes();

        res.status(200).json({
            success: true,
            secret: secret.base32,
            backupCodes: backupCodes,
            message: 'Scan with authenticator app'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async verifyMFASetup(req, res) {
    try {
        const { token, secret, backupCodes } = req.body;
        const userId = req.user.userId;
        const pool = getPool();
        const MFAValidator = require('../security/MFAValidator');

        const isValid = MFAValidator.verifyToken(token, secret);
        if (!isValid) return res.status(400).json({ error: 'Invalid token' });

        await pool.query(
            `UPDATE users SET mfa_enabled = TRUE, mfa_secret = $1, mfa_backup_codes = $2 
             WHERE id = $3`,
            [secret, JSON.stringify(backupCodes), userId]
        );

        res.status(200).json({ success: true, message: 'MFA enabled' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async verifyMFALogin(req, res) {
    try {
        const { email, token, backupCode } = req.body;
        const pool = getPool();
        const MFAValidator = require('../security/MFAValidator');

        const userResult = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND mfa_enabled = TRUE',
            [email]
        );

        if (!userResult.rows[0]) {
            return res.status(400).json({ error: 'MFA not enabled' });
        }

        const user = userResult.rows[0];
        let isValid = false;

        if (token) {
            isValid = MFAValidator.verifyToken(token, user.mfa_secret);
        } else if (backupCode) {
            const remaining = MFAValidator.verifyBackupCode(backupCode, user.mfa_backup_codes);
            if (remaining) {
                isValid = true;
                await pool.query(
                    'UPDATE users SET mfa_backup_codes = $1 WHERE id = $2',
                    [JSON.stringify(remaining), user.id]
                );
            }
        }

        if (!isValid) return res.status(400).json({ error: 'Invalid code' });

        res.status(200).json({ success: true, message: 'MFA verified' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
```

---

## 2️⃣ تحديث `backend/routes/authRoutes.js`

أضف هذه المسارات:

```javascript
router.post('/mfa/setup', 
    AuthorizationGuard.authenticateToken.bind(AuthorizationGuard),
    AuthorizationGuard.requireRole(['buyer']).bind(AuthorizationGuard),
    AuthController.setupMFA.bind(AuthController)
);

router.post('/mfa/verify-setup',
    AuthorizationGuard.authenticateToken.bind(AuthorizationGuard),
    AuthController.verifyMFASetup.bind(AuthController)
);

router.post('/mfa/verify-login', 
    AuthController.verifyMFALogin.bind(AuthController)
);
```

---

## 3️⃣ تحديث `backend/services/TenderService.js`

أضف هذه الوظائف في البداية:

```javascript
async checkIfTenderLocked(tenderId) {
    const pool = getPool();
    const result = await pool.query(
        'SELECT first_offer_at FROM tenders WHERE id = $1',
        [tenderId]
    );
    return result.rows[0]?.first_offer_at !== null;
}

async lockTenderAfterFirstOffer(tenderId) {
    const pool = getPool();
    await pool.query(
        'UPDATE tenders SET first_offer_at = CURRENT_TIMESTAMP WHERE id = $1 AND first_offer_at IS NULL',
        [tenderId]
    );
}
```

وفي `updateTender`، أضف في البداية:

```javascript
async updateTender(tenderId, updateData, userId) {
    const isLocked = await this.checkIfTenderLocked(tenderId);
    if (isLocked) {
        throw new Error('Tender cannot be modified after first offer received');
    }
    // ... باقي الكود
}
```

---

## 4️⃣ تحديث `backend/services/OfferService.js`

أضف هذه الوظيفة:

```javascript
async decryptOfferData(offerId, userId) {
    const pool = getPool();
    const result = await pool.query(
        `SELECT o.*, t.opening_date, t.buyer_id 
         FROM offers o 
         JOIN tenders t ON o.tender_id = t.id 
         WHERE o.id = $1`,
        [offerId]
    );

    if (!result.rows[0]) throw new Error('Offer not found');

    const offer = result.rows[0];
    const isBuyer = userId === offer.buyer_id;
    const currentTime = new Date();
    const openingDate = new Date(offer.opening_date);

    // Server Time Check ✅
    if (!isBuyer) throw new Error('Only buyer can decrypt');
    if (currentTime < openingDate) {
        throw new Error(`Cannot decrypt before ${openingDate.toISOString()}`);
    }

    return offer;
}
```

وفي `createOffer`، بعد إنشاء العرض أضف:

```javascript
// Lock the tender after first offer
const tenderService = require('./TenderService');
await tenderService.lockTenderAfterFirstOffer(offer.tender_id);
```

---

## 🧪 اختبار سريع

```bash
# 1. Setup MFA
curl -X POST http://localhost:5000/api/auth/mfa/setup \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"

# 2. Create Review
curl -X POST http://localhost:5000/api/procurement/reviews \
  -H "Authorization: Bearer BUYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "offer_id": 1,
    "supplier_id": 2,
    "rating": 5,
    "comment": "Great supplier",
    "po_id": 1
  }'

# 3. Get Supplier Reviews
curl http://localhost:5000/api/procurement/reviews/supplier/2
```

---

## ✅ Checklist

- [ ] تحديث authController.js بـ MFA methods
- [ ] تحديث authRoutes.js بـ MFA routes
- [ ] تحديث TenderService.js بـ lock logic
- [ ] تحديث OfferService.js بـ time check
- [ ] تحديث schema.js (موجود بالفعل)
- [ ] تحديث app.js (موجود بالفعل)
- [ ] اختبار جميع الـ endpoints
- [ ] النشر في الإنتاج

**الحالة**: كل شيء مستعد ✅

