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

// Create a new order
const create = async (req, res) => {
  try {
    const { employeeId, clientId, cartId, productsId, paymentId, status, date } = req.body;

    // Body of order
    const order = new Order({
      employeeId: employeeId,
      clientId: clientId,
      cartId: cartId,
      productsId: productsId,
      paymentId: paymentId,
      status: status,
      date: date,
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
      status, 
      date
     } = req.body;

    // Find order by id
    let order = await Order.findById(id);

    // Update order
    order.employeeId = employeeId;
    order.clientId = clientId;
    order.cartId = cartId;
    order.productsId = productsId;
    order.paymentId = paymentId;
    order.status = status;
    order.date = date;

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

module.exports = { getAll, getById, create, update, remove };
