const Cart = require('../models/cart');
const Product = require('../models/product');

const getCartByClientId = async (req, res) => {
  try {
    const clientId = req.user.id;
    
    const cart = await Cart.find({ clientId: clientId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error("Error retrieving cart:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create a new cart
const create = async (req, res) => {
  try {
    const clientId = req.user.id;
    const products = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No products provided' });
    }

    for (const product of products) {
      const { productReference, quantity, size } = product;

      const allowedSizes = ['XS', 'S', 'M', 'L', 'XL'];
      if (!allowedSizes.includes(size)) {
        return res.status(400).json({ message: `Invalid size value for product ${productReference}. Allowed values: XS, S, M, L, XL` });
      }

      const existingProduct = await Product.findOne({ reference: productReference, size: size });
      if (!existingProduct) {
        return res.status(409).json({ message: `Product with reference '${productReference}' and size '${size}' doesn't exist` });
      }

      if (!productReference || !quantity || !size) {
        return res.status(400).json({ message: 'All fields must be filled for each product' });
      }
    }

    for (const product of products) {
      const { productReference, quantity, size } = product;

      const existingCartItem = await Cart.findOne({ clientId: clientId, productReference: productReference, size: size });
      if (existingCartItem) {
        existingCartItem.quantity += product.quantity;

        await existingCartItem.save();
        res.status(201).json({ message: 'Product quantity updated with success!\n'});
      } else {
        const newCartItem = new Cart({
          clientId,
          productReference,
          quantity,
          size
        });
        
        await newCartItem.save();
        res.status(201).json({ message: 'Product added to cart with success!\n'});
      }
    }
  } catch (error) {
    console.error('Cart Registration Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a cart
const updateQuantityInCart = async (req, res) => {
  try {
    const { item, quantity } = req.body;
    const clientId = req.user.id;

    const existingCart = await Cart.findOne({ clientId, productReference: item.productReference });

    existingCart.quantity = quantity;

    await existingCart.save();
    res.status(200).json({ message: 'Cart updated' });
  } catch (error) {
    console.error('Update Cart Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a cart
const removeItemfromCart = async (req, res) => {
  try {
    const clientId = req.user.id;
    const { productReference, size } = req.body;
    
    await Cart.findOneAndRemove({ clientId, productReference, size });
    res.status(200).json({ message: 'Cart deleted' });
  } catch (error) {
    console.error('Delete Cart Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getCartByClientId, create, updateQuantityInCart, removeItemfromCart };
