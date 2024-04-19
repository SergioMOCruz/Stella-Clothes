const Order = require('../models/order');

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

// Get order by client id
const getByClientId = async (req, res) => {
  try {
    const { user } = req.user;
    const orders = await Order.find({ clientId: user._id });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Get Order By Client Id Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new order
const create = async (req, res) => {
  try {
    const { employeeId, clientId, cartId, productsId, paymentId, status } = req.body;

    // Check if all fields are filled
    if (!employeeId || !clientId || !cartId || !productsId || !paymentId || !status) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    // Body of order
    const order = new Order({
      employeeId,
      clientId,
      cartId,
      productsId,
      paymentId,
      status,
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
      employeeId, 
      clientId, 
      cartId, 
      productsId, 
      paymentId, 
      status
     } = req.body;

    // Find order by id
    let order = await Order.findById(id);

    // Update order and verify if all fields are filled
    order.employeeId = employeeId || order.employeeId;
    order.clientId = clientId || order.clientId;
    order.cartId = cartId || order.cartId;
    order.productsId = productsId || order.productsId;
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

module.exports = { getAll, getById, getByClientId, create, update, remove };
