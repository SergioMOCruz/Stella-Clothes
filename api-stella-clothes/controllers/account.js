require('dotenv').config();
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Account = require('../models/account');

// Login an account
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
      res.status(401).json({ message: 'Incorrect Password' });
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
    const { firstName, lastName, email, password, phone, nif } = req.body;
    let accountExists = false;

    // Check if all fields are filled
    if (!firstName) 
      return res.status(406).json({ message: 'The first name field is mandatory' });
    
    if (!lastName) 
      return res.status(406).json({ message: 'The last name field is mandatory' });
    
    if (!email) 
      return res.status(406).json({ message: 'The email field is mandatory' });
    
    if (!password)
      return res.status(406).json({ message: 'The password field is mandatory' });
    
    if (!phone) 
      return res.status(406).json({ message: 'The phone field is mandatory' });

    if (!nif) 
      return res.status(406).json({ message: 'The nif  field is mandatory' });
    

    // if any of the fields don't have the same name as the variable return an error
    if (
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.email ||
      !req.body.password ||
      !req.body.phone ||
      !req.body.nif
    ) {
      return res.status(406).json({ message: 'Invalid field name' });
    }

    // Check if account already exists
    accountExists = await Account.findOne({ email });
    if (accountExists) {
      return res.status(409).json({ message: 'The email you entered already belongs to an account' });
    }

    accountExists = await Account.findOne({ nif });
    if (accountExists) {
      return res.status(409).json({ message: 'The nif you entered already belongs to an account' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Body of account
    const account = new Account({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      nif,
      role: 'user',
    });

    await account.save();
    console.log('Account created with success!\nAccount Id:', account._id);

    res.status(201).json({ message: 'Account registered!' });
  } catch (error) {
    console.error('Account Registration Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// TODO: Remove this route in production
const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if all fields are filled
    if (!email) {
      return res.status(406).json({ message: 'The email field is mandatory' });
    }
    if (!password) {
      return res.status(406).json({ message: 'The password field is mandatory' });
    }

    // if any of the fields don't have the same name as the variable return an error
    if (!req.body.email || !req.body.password) {
      return res.status(406).json({ message: 'Invalid field name' });
    }

    // Check if account already exists
    const accountExists = await Account.findOne({ email });
    if (accountExists) {
      return res.status(409).json({ message: 'The email you entered already belongs to an account' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Body of account
    const account = new Account({
      firstName: 'Admin',
      lastName: 'Admin',
      email,
      password: hashedPassword,
      phone: '000000000',
      role: 'admin',
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
    const { firstName, lastName, phone } = req.body;

    let account = await Account.findById(id);

    account.firstName = firstName || account.firstName;
    account.lastName = lastName || account.lastName;
    account.phone = phone || account.phone;

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

module.exports = { login, getAll, getById, create, createAdmin, update, remove };
