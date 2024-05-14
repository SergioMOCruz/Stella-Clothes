const Order = require('../models/order');
const Account = require('../models/account');
const Product = require('../models/product');

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
    const order = await Order.findById(id);
    res.status(200).json(order);
  } catch (error) {
    console.error('Get Order By Id Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get order by account id
const getByAccountId = async (req, res) => {
  try {
    const orders = await Order.find({ accountId: req.user._id });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Get Order By Account Id Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new order
const create = async (req, res) => {
  try {
    const { productsIds, address, nif } = req.body;

    // Check if all fields are filled except nif (nif is optional)
    if (!productsIds.length > 0 && !address.street && !address.city && !address.postalCode && !address.country) {
      return res.status(400).json({ message: 'Todos os campos devem ser preenchidos!' });
    }

    // Body of order
    const order = new Order({
      accountId: req.user._id,
      productsIds,
      address,
      nif: nif || null,
      status : {
        status: 'Em processo',
      },
      paymentId: 1, // TODO: Change this to the actual paymentId when the payment system is implemented
    });

    await order.save();
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

module.exports = { getAll, getById, getByAccountId, create, update, remove };
