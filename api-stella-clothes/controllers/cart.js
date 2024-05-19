const Cart = require('../models/cart');
const Product = require('../models/product');

const getCartByClientId = async (req, res) => {
  try {
    const clientId = req.user.id;

    let cart = await Cart.find({ clientId: clientId });

    if (!cart) return res.status(404).json({ message: 'Carrinho não encontrado!' });

    cart = cart.map((item) => {
      const obj = item.toObject();
      delete obj.clientId;
      return obj;
    });

    return res.status(200).json(cart);
  } catch (error) {
    console.error('Error retrieving cart:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getCartByClientIdOrganized = async (req, res) => {
  try {
    const carts = await Cart.find({ clientId: req.user.id });

    if (!carts) return res.status(404).json({ message: 'Carrinho não encontrado!' });

    const organizedCarts = carts.map((cart) => cart.toObject()).sort((a, b) => a._id - b._id);

    return res.status(200).json(organizedCarts);
  } catch (error) {
    console.error('Error retrieving cart:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Create a new cart
const create = async (req, res) => {
  try {
    const clientId = req.user.id;
    const products = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'Produtos não enviados!' });
    }

    for (const product of products) {
      const { productReference, quantity, size } = product;

      const allowedSizes = ['XS', 'S', 'M', 'L', 'XL'];
      if (!allowedSizes.includes(size)) {
        return res
          .status(400)
          .json({
            message: `Tamanho inválido do produto ${productReference}. Os tamanhos permitidos são XS, S, M, L e XL.`,
          });
      }

      const existingProduct = await Product.findOne({ reference: productReference, size: size });
      if (!existingProduct) {
        return res
          .status(404)
          .json({
            message: `Produto com a referência '${productReference}' e tamanho '${size}' não existe!`,
          });
      }

      if (!productReference || !quantity || !size) {
        return res.status(400).json({ message: 'Existem campos não preenchidos!' });
      }
    }

    for (const product of products) {
      const { productReference, name, image, quantity, size } = product;

      const existingCartItem = await Cart.findOne({
        clientId: clientId,
        productReference: productReference,
        size: size,
      });
      if (existingCartItem) {
        existingCartItem.quantity += product.quantity;

        await existingCartItem.save();
        res.status(201).json({ message: 'Quantidade do produto atualizada!\n' });
      } else {
        const newCartItem = new Cart({
          clientId,
          productReference,
          name,
          image,
          quantity,
          size,
        });

        await newCartItem.save();
        res.status(201).json({ message: 'Produto adicionado ao carrinho com sucesso!\n' });
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
    if (!existingCart) {
      return res.status(404).json({ message: 'Carrinho não encontrado!' });
    }

    existingCart.quantity = quantity;

    await existingCart.save();
    res.status(200).json({ message: 'Quantidade do produto atualizada!' });
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

    const cart = await Cart.findOneAndRemove({ clientId, productReference, size });
    if (!cart) {
      return res.status(404).json({ message: 'Carrinho não encontrado!' });
    }

    res.status(200).json({ message: 'Carrinho removido com sucesso!' });
  } catch (error) {
    console.error('Delete Cart Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getCartByClientId,
  getCartByClientIdOrganized,
  create,
  updateQuantityInCart,
  removeItemfromCart,
};
