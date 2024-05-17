const Stripe = require('stripe');
const stripeSecretKey = process.env.STRIPE_KEY;
const Cart = require('../models/cart');
const Account = require('../models/account');
const Product = require('../models/product');
const stripe = require('stripe')(stripeSecretKey);

const retrievePaymentId = async (req, res) => {
    try {
        const accountId = req.user.id;

        let account = await Account.findOne({ _id: accountId });
        const sessionId = account.orderInfo.sessionId;

        if (!sessionId) {
            return res.status(400).send({ error: 'Missing session ID' });
        }

        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId, {
                expand: ['payment_intent'],
            });

            return res.status(200).send({ "paymentId": session.payment_intent.id });
        } catch (error) {
            console.error('Error retrieving Checkout Session:', error);
            throw error; 
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
};


const createCheckoutSession = async (req, res) => {
    let hash = "";
    const stripe = Stripe(stripeSecretKey);
    const domain = `http://localhost:4200`;

    const amount = req.body.amount;
    let deliveryInfo = req.body.orderInfo;

    if (!amount) return res.status(400).send('Amount is required');
    if (!deliveryInfo) return res.status(400).send('Delivery information is required');

    const carts = await Cart.find({ clientId: req.user.id });
    if (!carts) return res.status(404).json({ message: "Cart not found" });

    let wrongOrderQuantity = false;
    for (const cart of carts ){
        const product = await Product.findOne({ reference: cart.productReference, size: cart.size });
        
        if (cart.quantity > product.stock) {
            wrongOrderQuantity = true;
            break;
        }
    }
    if (wrongOrderQuantity == true) return res.status(400).send('Item quantity is higher than stock');

    let orderInfo = {
        contactInfo: deliveryInfo.contactInfo,
        firstName: deliveryInfo.firstName,
        lastName: deliveryInfo.lastName,
        street: deliveryInfo.street,
        addressExtra: deliveryInfo.addressExtra,
        postalCode: deliveryInfo.postalCode,
        city: deliveryInfo.city,
        country: deliveryInfo.country,
        nif: deliveryInfo.nif || null
    };

    await Account.findByIdAndUpdate(req.user.id, { $set: { orderInfo: orderInfo } }, { new: true });

    const organizedCarts = carts.map(cart => cart.toObject())
        .sort((a, b) => a._id - b._id);

    for (const cartItem of organizedCarts) {
        hash += cartItem._id;
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: 'Pagamento Encomenda PDS',
                        },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${domain}/successful-payment?hash=${hash}`,
            cancel_url: `${domain}/unsuccessful-payment`,
            expand: ['payment_intent']
        });

        await Account.findByIdAndUpdate(req.user.id, { $set: { "orderInfo.sessionId": session.id } }, { new: true });

        return res.send(session);
    } catch (error) {
        console.log('Stripe ERROR', error);
    }
}

module.exports = { createCheckoutSession, retrievePaymentId };
