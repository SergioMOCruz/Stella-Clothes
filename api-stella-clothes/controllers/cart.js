const Cart = require('../models/cart');

// Get all carts
const getAll = async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (error) {
    console.error('Get All Carts Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get cart by id
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await Cart.findById(id);
    res.status(200).json(cart);
  } catch (error) {
    console.error('Get Cart By Id Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new cart
const create = async (req, res) => {
  try {
    const { clientId, productsId } = req.body;

    // Check if all fields are filled
    if (!clientId || !productsId) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    // Body of cart
    const cart = new Cart({
      clientId,
      productsId,
    });

    await cart.save();
    console.log('Cart created with success!\nCart Id:', cart._id);

    res.status(201).json({ message: 'Cart registered!' });
  } catch (error) {
    console.error('Cart Registration Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a cart
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientId, productsId } = req.body;

    // Find cart by id
    let cart = await Cart.findById(id);

    // Update cart
    cart.clientId = clientId || cart.clientId;
    cart.productsId = productsId || cart.productsId;

    await cart.save();
    res.status(200).json({ message: 'Cart updated' });
  } catch (error) {
    console.error('Update Cart Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a cart
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Cart.findByIdAndDelete(id);
    res.status(200).json({ message: 'Cart deleted' });
  } catch (error) {
    console.error('Delete Cart Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAll, getById, create, update, remove };
