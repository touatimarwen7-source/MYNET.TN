const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/reviewController');
const AuthorizationGuard = require('../security/AuthorizationGuard');

router.post('/', 
    AuthorizationGuard.authenticateToken.bind(AuthorizationGuard),
    AuthorizationGuard.requireRole(['buyer']).bind(AuthorizationGuard),
    ReviewController.createReview.bind(ReviewController)
);

router.get('/supplier/:supplierId', ReviewController.getSupplierReviews.bind(ReviewController));

module.exports = router;
