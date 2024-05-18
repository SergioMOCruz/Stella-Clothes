const express = require('express');
const router = express.Router();
const { createCheckoutSession, retrievePaymentId } = require('../controllers/stripe');
const { authenticateToken } = require('../middleware/authenticate');

// GET /stripe
// Get payment intent id
router.get('/retrieve-payment-id', authenticateToken, retrievePaymentId);

// POST /stripe
// Create checkout session
router.post('/create-checkout-session', authenticateToken, createCheckoutSession);

module.exports = router;
