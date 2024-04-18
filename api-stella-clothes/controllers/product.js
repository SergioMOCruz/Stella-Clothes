const Product = require('../models/product');
const Category = require('../models/category');

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

    if (!products.length) return res.status(500).json({ message: 'No products ' });

    res.status(200).json(products);
  } catch (error) {
    console.error('Get Last Products Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get products by category
const getByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Check if the category exists
    const cat = await Category.find({ description: category });
    if (!cat) return res.status(400).json({ message: 'Category not found' });

    const products = await Product.find({ category: cat[0]._id });

    res.status(200).json(products);
  } catch (error) {
    console.error('Get Products By Category Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new product
const create = async (req, res) => {
  try {
    const { ref, description, price, size, stock, category } = req.body;
    const image = req.file.path;

    // Check if the fields are empty
    if (!ref || !description || !price || !size || !stock || !category)
      //|| !image)
      return res.status(400).json({ message: 'All fields are required' });

    const allowedSizes = ['XS', 'S', 'M', 'L', 'XL'];
    if (!allowedSizes.includes(size)) {
      return res.status(400).json({ message: 'Invalid size value. Allowed values: XS, S, M, L, XL' });
    }

    const existingProduct = await Product.findOne({ ref, size });
    if (existingProduct) {
      return res.status(409).json({ message: `Product with ref '${ref}' and size '${size}' already exists` });
    }

    // Check if image is empty
    //if (!image) return res.status(400).json({ message: 'Image is required' });

    // Check if the category exists
    const cat = await Category.find({ description: category });
    if (!cat) return res.status(400).json({ message: 'Category not found' });

    // Body of product
    const product = new Product({
      ref,
      name,
      description,
      price,
      size,
      stock,
      category: cat[0]._id,
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
    const { ref, description, price, size, stock, category } = req.body;
    const image = req.file.path;

    let product = await Product.findById(id);

    product.ref = ref ? ref : product.ref;
    product.description = description ? description : product.description;
    product.price = price ? price : product.price;
    product.size = size ? size : product.size;
    product.stock = stock ? stock : product.stock;
    product.category = category ? category : product.category;
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

module.exports = {
  getAll,
  getById,
  getByRef,
  getByCategory,
  getStock,
  getLastFour,
  create,
  update,
  remove,
};
