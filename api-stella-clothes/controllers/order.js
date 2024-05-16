const Order = require('../models/order');
const Account = require('../models/account');
const Cart = require('../models/cart');
const Product = require('../models/product');
const Category = require('../models/category');
const OrderData = require('../models/order_data');

// Get all orders
const getAll = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error('Get All Orders Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get order by id
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const accountId = req.user.id;
    
    let order = await Order.findOne({ _id: id, accountId: accountId });
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    let orderData = await OrderData.find({ orderId: id });

    order = order.toObject();
    delete order.accountId;
    delete order.paymentId;

    orderData = orderData.map(item => {
      const obj = item.toObject();
      delete obj._id;
      return obj;
    });

    order.orderData = orderData;
    
    res.status(200).json(order);
  } catch (error) {
    console.error('Get Order By Id Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Get order by account id
const getByAccount = async (req, res) => {
  try {
    let orders = await Order.find({ accountId: req.user._id });

    // Convert each Mongoose document to a plain JavaScript object
    orders = orders.map(order => order.toObject());

    // Get order data for each order since this will be received by end user
    for (let order of orders) {
      const orderData = await OrderData.find({ orderId: order._id});

      // Removing order account id for security measures
      delete order.accountId;
      order.orderData = orderData;
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Get Order By Account Id Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const verifyOrder = async (req, res) => {
  try {
    const accountId = req.user.id;
    const { id } = req.params;

    const order = await Order.findOne({ _id: id, accountId: accountId });

    res.status(200).json(order);

    res.status(201);
  } catch (error) {
    console.error('Order Registration Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}


// Create a new order
const create = async (req, res) => {
  try {
    const accountId = req.user.id;
    const paymentId = req.body.paymentId;
    let total = 0;

    if (!paymentId) return res.status(400).json({ message: 'Payment id is required' });

    let account = await Account.findOne({ _id: accountId });
    const orderInfo = account.orderInfo;

    const productsWithQuantity = await Cart.find({ clientId: req.user.id });

    // Check if all fields are filled except nif (nif is optional)
    if (
      !orderInfo.contactInfo || 
      !orderInfo.firstName || 
      !orderInfo.lastName || 
      !orderInfo.street || 
      !orderInfo.addressExtra || 
      !orderInfo.postalCode || 
      !orderInfo.city || 
      !orderInfo.country ||
      !productsWithQuantity ||
      !Array.isArray(productsWithQuantity) ||
      !productsWithQuantity.every(product => product.productReference && product.quantity && product.size)
    ) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    // Check if product exists
    for (const product of productsWithQuantity) {
      const { productReference, quantity, size } = product;
      const reference = productReference;

      const existingProduct = await Product.findOne({ reference, size });
      if (!existingProduct)
        return res.status(409).json({ message: `Product with reference '${reference}' and size '${size}' doesn't exist` });
      if (existingProduct.stock < quantity)
        return res.status(409).json({ message: `Product with reference '${reference}' and size '${size}' doesn't have enough stock` });

      const subTotal = quantity * existingProduct.price;
      total += subTotal
    };
    
    // Body of order
    const order = new Order({
      accountId: req.user._id,
      contactInfo: orderInfo.contactInfo,
      firstName: orderInfo.firstName,
      lastName: orderInfo.lastName,
      address: {
        street: orderInfo.street,
        addressExtra: orderInfo.addressExtra || null,
        city: orderInfo.city,
        postalCode: orderInfo.postalCode,
        country: orderInfo.country,
      },
      paymentId: paymentId,
      nif: orderInfo.nif || null,
      status: [
        {
          status: 'Pago',
          date: Date.now(),
        }
      ],
      total: total
    });
    await order.save();
    
    // Create order data for each product and remove stock from products after order is made
    for (const product of productsWithQuantity) {
      const { productReference, quantity, size } = product;
      const reference = productReference;

      const existingProduct = await Product.findOne({ reference, size });
      const productCategory = await Category.findOne({ _id: existingProduct.category });

      const orderData = new OrderData({
        orderId: order._id,
        productId: existingProduct._id,
        reference: existingProduct.reference,
        name: existingProduct.name,
        description: existingProduct.description,
        category: productCategory.description,
        quantity: quantity,
        image: existingProduct.image,
        priceAtTime: existingProduct.price,
        size: size
      });
      await orderData.save();  

      existingProduct.stock -= quantity;
      existingProduct.save();
    }

    await Cart.deleteMany({ clientId: accountId });
    await Account.updateOne({ _id: accountId }, { $unset: { orderInfo: "" } });
    
    console.log('Order created with success!\nOrder Id:', order._id);

    res.status(201).json({ message: 'Order registered!' });
  } catch (error) {
    console.error('Order Registration Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a order
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      accountId,
      productsIds, 
      paymentId, 
      status,
    } = req.body;

    // Find order by id
    let order = await Order.findById(id);

    // Update order and verify if all fields are filled
    order.accountId = accountId || order.accountId;
    order.cartId = cartId || order.cartId;
    order.productsIds = productsIds || order.productsIds;
    order.paymentId = paymentId || order.paymentId;
    order.status = status || order.status;

    await order.save();
    res.status(200).json({ message: 'Order updated' });
  } catch (error) {
    console.error('Update Order Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a order
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.status(200).json({ message: 'Order deleted' });
  } catch (error) {
    console.error('Delete Order Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAll, getById, verifyOrder, getByAccount, create, update, remove };
