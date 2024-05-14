require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Account = require('../models/account');

// Login account
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const account = await Account.findOne({ email });

    if (!account) {
      return res.status(204).json({ message: 'Account not found' });
    }

    const passwordMatch = await bcrypt.compare(password, account.password);

    if (passwordMatch) {
      const jwtSecret = process.env.JWT_SECRET;

      const token = jwt.sign({ id: account._id, email: account.email }, jwtSecret, {
        expiresIn: '30d',
      });

      res.status(200).json({
        token,
        accID: account._id,
      });
    } else {
      res.status(403).json({ message: 'Incorrect Password' });
    }
  } catch (error) {
    console.error('Account Login Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all accounts
const getAll = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.status(200).json(accounts);
  } catch (error) {
    console.error('Get All Accounts Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get account by id
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.findById(id);
    res.status(200).json(account);
  } catch (error) {
    console.error('Get Account By Id Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new account
const create = async (req, res) => {
  try {
    const {
      email,
      password,
      role,
    } = req.body;

    // Check if all fields are filled
    if (!email) {
      return res.status(406).json({ message: 'O campo email é obrigatório!' });
    }
    if (!password) {
      return res.status(406).json({ message: 'O campo password é obrigatório!' });
    }
    if (!role) {
      return res.status(406).json({ message: 'O campo perfil é obrigatório!' });
    }

    // if any of the fields don't have the same name as the variable return an error
    if (
      !req.body.email ||
      !req.body.password ||
      !req.body.role
    ) {
      return res.status(406).json({ message: 'Campo com nome inválido' });
    }

    // Check if account already exists
    const accountExists = await Account.findOne({ email });
    if (accountExists) {
      return res.status(409).json({ message: 'O email que introduziu já pertence a uma conta!' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Body of account
    const account = new Account({
      email,
      password: hashedPassword,
      role,
    });

    await account.save();
    console.log('Account created with success!\nAccount Id:', account._id);

    res.status(201).json({ message: 'Account registered!' });
  } catch (error) {
    console.error('Account Registration Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a account
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      email,
      password,
      role,
    } = req.body;

    let account = await Account.findById(id);

    account.email = email || account.email;
    account.password = password || account.password;
    account.role = role || account.role;

    await account.save();
    res.status(200).json({ message: 'Account updated' });
  } catch (error) {
    console.error('Update Account Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a account
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Account.findByIdAndDelete(id);
    res.status(200).json({ message: 'Account deleted' });
  } catch (error) {
    console.error('Delete Account Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { login, getAll, getById, create, update, remove };
