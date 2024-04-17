const stripe = require('stripe')(process.env.STRIPE_KEY);

// Calculate the order amount
const calculateOrderAmount = (items) => {
  let total = 0;
  items.forEach((item) => {
    total += item.price * item.quantity;
  });

  return total;
};

// Create a PaymentIntent
async function CreatePaymentIntent(req, res) {
  try {
    const { items } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: 'eur',
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Create Payment Intent Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Endpoint to handle webhook events from Stripe (optional)
async function WebhookEvents(req, res) {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, 'your_stripe_webhook_secret');

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        break;
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object;
        break;
    }

    res.status(200).end();
  } catch (error) {
    console.error('Error handling webhook event:', error);
    res.status(400).send('Webhook Error:', error.message);
  }
};

export { CreatePaymentIntent, WebhookEvents }