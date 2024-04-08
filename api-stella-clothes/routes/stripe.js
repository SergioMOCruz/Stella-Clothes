const express = require('express');
const router = express.Router();
const { CreatePaymentIntent, WebhookEvents } = require('../middleware/stripe');
const { authenticateUser } = require('../middleware/authenticate');

// POST /stripe
// Create a new stripe
router.post('/create-payment-intent', authenticateUser, CreatePaymentIntent);
router.post('/webhook', authenticateUser, WebhookEvents);

module.exports = router;