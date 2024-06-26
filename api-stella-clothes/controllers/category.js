const Category = require('../models/category');

// Get all categories
const getAll = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Get All Categorys Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get category by id
const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada!' });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error('Get Category By Id Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get category by description
const getByDescription = async (req, res) => {
  try {
    const { description } = req.params;

    const category = await Category.findOne({ description });
    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada!' });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error('Get Category By Description Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new category
const create = async (req, res) => {
  try {
    const { description } = req.body;

    // check if category already exists
    const categoryExists = await Category.findOne({ description });
    if (categoryExists) {
      return res.status(409).json({ message: 'A categoria já existe!' });
    }

    // Body of category
    const category = new Category({
      description,
    });

    await category.save();
    console.log('Category created with success!\nCategory Id:', category._id);

    res.status(201).json({ message: 'Categoria adicionada com sucesso!' });
  } catch (error) {
    console.error('Category Registration Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a category
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    // Check if category exists
    const categoryExists = await Category.findOne({ description });
    if (categoryExists) {
      return res.status(400).json({ message: 'A categoria já existe!' });
    }

    // Find category by id
    let category = await Category.findById(id);

    // Update category
    category.description = description;

    await category.save();
    res.status(200).json({ message: 'Categoria atualizada com sucesso!' });
  } catch (error) {
    console.error('Update Category Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a category
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const cateogory = await Category.findByIdAndDelete(id);
    if (!cateogory) {
      return res.status(404).json({ message: 'Categoria não encontrada!' });
    }
    res.status(200).json({ message: 'Categoria removida com sucesso!' });
  } catch (error) {
    console.error('Delete Category Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAll, getById, getByDescription, create, update, remove };
