
const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const { validationMiddleware } = require('../middleware/validationMiddleware');
const EmailVerificationService = require('../services/email/EmailVerificationService');

// Apply validation middleware globally
router.use(validationMiddleware);

// Send verification email
router.post('/send-verification', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const email = req.user.email;

    await EmailVerificationService.sendVerificationEmail(userId, email);

    res.json({
      success: true,
      message: 'Email de vérification envoyé avec succès',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Verify email token
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const result = await EmailVerificationService.verifyEmailToken(token);

    if (result.success) {
      res.json({
        success: true,
        message: 'Email vérifié avec succès',
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Resend verification email
router.post('/resend-verification', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const email = req.user.email;

    await EmailVerificationService.sendVerificationEmail(userId, email);

    res.json({
      success: true,
      message: 'Email de vérification renvoyé avec succès',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
