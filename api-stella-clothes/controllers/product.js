const Product = require('../models/product');

// Get all products
const getAll = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(201).json(products);
  } catch (error) {
    console.error('Get All Products Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get product by id
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    res.status(200).json(product);
  } catch (error) {
    console.error('Get Product By Id Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get products by ref
const getByRef = async (req, res) => {
  try {
    const { ref } = req.params;
    const products = await Product.find({ ref });

    res.status(200).json(products);
  } catch (error) {
    console.error('Get Product By Ref Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get stock by ref and size
const getStock = async (req, res) => {
  try {
    const { ref, size } = req.body;
    const products = await Product.find({ ref });

    const product = products.filter((product) => product.size === size);
    const stock = product[0].stock;

    res.status(200).json({ stock });
  } catch (error) {
    console.error('Get Stock By Ref Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get the last 4 products added
const getLastFour = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(4);

    if (!products.length)
      return res.status(500).json({ message: 'No products ' });

    res.status(200).json(products);
  } catch (error) {
    console.error('Get Last Products Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new product
const create = async (req, res) => {
  try {
    const { ref, description, price, size, stock } = req.body;
    const image = req.file.path;

    // Check if the fields are empty
    if (!ref || !description || !price || !size || !stock)
      return res.status(400).json({ message: 'All fields are required' });

    // Check if image is empty
    //if (!image) return res.status(400).json({ message: 'Image is required' });

    // Check if the product already exists
    const productExists = await Product.findOne({
      ref,
      description,
      price,
      size,
      stock,
    });
    if (productExists)
      return res.status(400).json({ message: 'Product already exists' });

    // Body of product
    const product = new Product({
      ref,
      description,
      price,
      size,
      stock,
      image: image ? image : '',
    });

    await product.save();
    console.log('Product created with success!\nProduct Id:', product._id);

    res.status(201).json({ message: 'Product registered!' });
  } catch (error) {
    console.error('Product Registration Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Upload image to a product
const uploadImage = async (req, res) => {
  try {
    const { id } = req.params;
    const imagePath = req.file.path;

    let product = await Product.findById(id);
    product.image = imagePath ? imagePath : '';

    res.status(200).json({ message: 'Image uploaded' });
  } catch (error) {
    console.error('Upload Image Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a product
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { ref, description, price, size, stock } = req.body;
    const image = req.file.path;

    let product = await Product.findById(id);

    product.ref = ref;
    product.description = description;
    product.price = price;
    product.size = size;
    product.stock = stock;
    product.image = image ? image : product.image;

    await product.save();
    res.status(200).json({ message: 'Product updated' });
  } catch (error) {
    console.error('Update Product Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a product
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete Product Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAll, getById, getByRef, getStock, getLastFour, create, update, remove };
