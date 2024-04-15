const express = require('express');
const router = express.Router();
const { CreatePaymentIntent, WebhookEvents } = require('../middleware/stripe');
const { authenticateToken } = require('../middleware/authenticate');

// POST /stripe
// Create a new stripe
router.post('/create-payment-intent', authenticateToken, CreatePaymentIntent);
router.post('/webhook', authenticateToken, WebhookEvents);

module.exports = router;