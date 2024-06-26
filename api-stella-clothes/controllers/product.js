const Product = require('../models/product');
const Category = require('../models/category');
const { uploadSingleFile } = require('../utils/google-storage');

// Get all products
const getAll = async (req, res) => {
  try {
    const products = await Product.find();

    // check if product are active
    const activeProducts = products.filter((product) => product.active === true);

    res.status(200).json(activeProducts);
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
    if (!product) return res.status(404).json({ message: 'Produto não encontrado' });

    res.status(200).json(product);
  } catch (error) {
    console.error('Get Product By Id Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get products by reference
const getByRef = async (req, res) => {
  try {
    const { reference } = req.params;
    const products = await Product.find({ reference });

    // check if product are active
    const activeProducts = products.filter((product) => product.active === true);

    res.status(200).json(activeProducts);
  } catch (error) {
    console.error('Get Product By Reference Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get products by reference for dash
const getAllbyRef = async (req, res) => {
  try {
    const products = await Product.find();

    let productsByRef = products.map((product) => {
      return {
        reference: product.reference,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        active: product.active,
        image: product.image,
      };
    });

    // get the stock of each product by size and create an array of
    // objects with the size and stock of each product
    productsByRef = productsByRef.map((product) => {
      const productRefs = products.filter((p) => p.reference === product.reference);
      const sizes = productRefs.map((s) => {
        return { size: s.size, stock: s.stock };
      });
      return { ...product, stock: sizes };
    });

    // remove duplicates
    productsByRef = productsByRef.filter(
      (product, index, self) => index === self.findIndex((t) => t.reference === product.reference)
    );

    // get the category of the product and return its name
    productsByRef = productsByRef.map(async (product) => {
      const category = await Category.findById(product.category);
      return { ...product, category: category.description };
    });

    Promise.all(productsByRef).then((modifiedProducts) => {
      res.status(200).json(modifiedProducts);
    });
  } catch (error) {
    console.error('Get Product By Reference Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get stock by reference and size
const getStock = async (req, res) => {
  try {
    const { reference, size } = req.body;
    const products = await Product.find({ reference });
    if (!products) return res.status(404).json({ message: 'Produto não encontrado!' });

    const product = products.filter((product) => product.size === size);
    if (!product)
      return res.status(404).json({ message: 'Não existem tamanhos para a referência indicada!' });
    const stock = product[0].stock;

    res.status(200).json({ stock });
  } catch (error) {
    console.error('Get Stock By Reference Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get the last 4 products added
const getLastFour = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $group: { _id: '$reference', doc: { $first: '$$ROOT' } } },
      { $replaceRoot: { newRoot: '$doc' } },
    ]).limit(4);

    if (!products.length) return res.status(500).json({ message: 'No products ' });

    // check if product are active
    const activeProducts = products.filter((product) => product.active === true);

    res.status(200).json(activeProducts);
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

    const products = await Product.aggregate([
      {
        $addFields: {
          categoryString: { $toString: '$category' },
        },
      },
      { $match: { categoryString: { $regex: cat[0]._id.toString(), $options: 'i' } } },
      {
        $group: {
          _id: '$reference',
          doc: { $first: '$$ROOT' },
        },
      },
      { $replaceRoot: { newRoot: '$doc' } },
    ]);

    // check if product are active
    const activeProducts = products.filter((product) => product.active === true);

    res.status(200).json(activeProducts);
  } catch (error) {
    console.error('Get Products By Category Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Search products by name
const searchProducts = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm;
    const products = await Product.aggregate([
      { $match: { name: { $regex: searchTerm, $options: 'i' } } },
      { $group: { _id: '$reference', doc: { $first: '$$ROOT' } } },
      { $replaceRoot: { newRoot: '$doc' } },
    ]);

    // check if product are active
    const activeProducts = products.filter((product) => product.active === true);

    if (!activeProducts)
      return res.status(404).json({ message: 'Não foram encontrados produtos!' });

    res.status(200).json(activeProducts);
  } catch (error) {
    console.error('Search Products Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Search products by reference
const searchProductsByRef = async (req, res) => {
  try {
    const { reference } = req.params;
    const products = await Product.find({ reference });
    if (!products) return res.status(404).json({ message: 'Produto não encontrado!' });

    let productsByRef = products.map((product) => {
      return {
        reference: product.reference,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        active: product.active,
        image: product.image,
      };
    });

    // get the stock of each product by size and create an array of
    // objects with the size and stock of each product
    productsByRef = productsByRef.map((product) => {
      const productRefs = products.filter((p) => p.reference === product.reference);
      const sizes = productRefs.map((s) => {
        return { size: s.size, stock: s.stock };
      });
      return { ...product, stock: sizes };
    });

    // remove duplicates
    productsByRef = productsByRef.filter(
      (product, index, self) => index === self.findIndex((t) => t.reference === product.reference)
    );

    // get the category of the product and return its name
    productsByRef = productsByRef.map(async (product) => {
      const category = await Category.findById(product.category);
      return { ...product, category: category.description };
    });

    Promise.all(productsByRef).then((modifiedProducts) => {
      res.status(200).json(modifiedProducts);
    });
  } catch (error) {
    console.error('Search Products By Reference Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new product
const create = async (req, res) => {
  try {
    let { reference, name, description, price, size, stock, category } = req.body;

    // Check if the fields are empty
    if (
      !reference ||
      !name ||
      !description ||
      !price ||
      !size ||
      typeof stock !== 'number' ||
      !category
    )
      return res.status(400).json({ message: 'All fields are required' });

    // convert price to number
    price = parseFloat(price);

    const allowedSizes = ['XS', 'S', 'M', 'L', 'XL'];
    if (!allowedSizes.includes(size)) {
      return res
        .status(400)
        .json({ message: 'Tamanho inválido. Os tamanhos permitidos são XS, S, M, L e XL' });
    }

    const existingProduct = await Product.findOne({ reference, size });
    if (existingProduct) {
      return res.status(409).json({
        message: `Product with reference '${reference}' and size '${size}' already exists`,
      });
    }

    // Check if the category exists
    const cat = await Category.find({ description: category });
    if (!cat.length) return res.status(400).json({ message: 'Categoria não encontrada!' });

    // Body of product
    const product = new Product({
      reference,
      name,
      description,
      price,
      size,
      stock,
      category: cat[0]._id,
    });

    await product.save();
    console.log('Product created with success!\nProduct Id:', product._id);

    res.status(201).json({ message: 'Produto adicionado com sucesso!' });
  } catch (error) {
    console.error('Product Registration Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a product by reference
const updateByRef = async (req, res) => {
  try {
    const { reference } = req.params;
    let { ref, name, description, price, category } = req.body;

    let products = await Product.find({ reference });
    if (!products) return res.status(404).json({ message: 'Produto não encontrado!' });

    // check if price is a number
    if (isNaN(price)) {
      // check if price has a comma
      if (price.includes(',')) {
        price = price.replace(',', '.');
      }
      // convert price to number
      price = parseFloat(price);
    }

    // Check if the category exists
    const cat = await Category.find({ description: category });
    if (!cat.length) return res.status(400).json({ message: 'Categoria não encontrada!' });

    products.forEach(async (product) => {
      product.reference = ref ? ref : product.reference;
      product.name = name ? name : product.name;
      product.description = description ? description : product.description;
      product.price = price ? price : product.price;
      product.category = category ? cat[0]._id : product.category;

      await product.save();
    });

    res.status(200).json({ message: 'Produto atualizado com sucesso!' });
  } catch (error) {
    console.error('Update Product By Reference Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a image of a product
const updateImage = async (req, res) => {
  try {
    const { reference } = req.params;
    const image = req.file;

    const products = await Product.find({ reference });

    if (!products) {
      return res.status(404).json({ message: 'Produtos não encontrado!' });
    }

    if (!image) {
      return res.status(400).json({ message: 'Erro ao ler a imagem.' });
    }

    // Upload image to Google Cloud Storage
    const imageURL = await uploadSingleFile(image, reference);
    console.log('Image URL:', imageURL);

    // Update image of all the products
    products.forEach(async (product) => {
      product.image = imageURL;
      await product.save();
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Update Logo Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update stock of a product by reference
const updateStock = async (req, res) => {
  try {
    const { reference, size, stock } = req.body;

    const products = await Product.find({ reference });

    if (!products) return res.status(404).json({ message: 'Produto não encontrado!' });

    let product = products.filter((product) => product.size === size);
    if (product.length > 0) {
      product = product[0];
      product.stock += parseInt(stock);
    } else {
      product = new Product({
        reference: products[0].reference,
        name: products[0].name,
        description: products[0].description,
        price: products[0].price,
        size: size,
        stock: stock,
        category: products[0].category,
        image: products[0].image,
      });
    }

    await product.save();

    res.status(200).json({ message: 'Stock atualizado com sucesso!' });
  } catch (error) {
    console.error('Update Stock Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Hide all products with the same reference
const hideAllByRef = async (req, res) => {
  try {
    const { reference } = req.params;
    const products = await Product.find({ reference });
    if (!products) return res.status(404).json({ message: 'Produto não encontrado!' });

    products.forEach(async (product) => {
      product.active = false;
      await product.save();
    });

    res.status(200).json({ message: 'Produto escondido com sucesso!' });
  } catch (error) {
    console.error('Hide Products By Reference Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Show product by reference
const showByRef = async (req, res) => {
  try {
    const { reference } = req.params;
    const products = await Product.find({ reference });
    if (!products) return res.status(404).json({ message: 'Produto não encontrado!' });

    products.forEach(async (product) => {
      product.active = true;
      await product.save();
    });

    res.status(200).json({ message: 'Produto mostrado com sucesso!' });
  } catch (error) {
    console.error('Show Products By Reference Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a product
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: 'Produto não encontrado' });

    res.status(200).json({ message: 'Produto removido com sucesso!' });
  } catch (error) {
    console.error('Delete Product Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAll,
  getById,
  getByRef,
  getAllbyRef,
  getByCategory,
  getStock,
  getLastFour,
  searchProducts,
  searchProductsByRef,
  create,
  updateByRef,
  updateImage,
  updateStock,
  hideAllByRef,
  showByRef,
  remove,
};
