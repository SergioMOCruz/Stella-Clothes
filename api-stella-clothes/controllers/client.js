require('dotenv').config();
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Client = require('../models/client');

// Login an client
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const client = await Client.findOne({ email });

    if (!client) {
      return res.status(204).json({ message: 'Client not found' });
    }

    const passwordMatch = await bcrypt.compare(password, client.password);

    if (passwordMatch) {
      const jwtSecret = process.env.JWT_SECRET;

      const token = jwt.sign({ id: client._id, email: client.email }, jwtSecret, {
        expiresIn: '30d',
      });

      res.status(200).json({
        token,
        accID: client._id,
      });
    } else {
      res.status(403).json({ message: 'Incorrect Password' });
    }
  } catch (error) {
    console.error('Client Login Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all clients
const getAll = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    console.error('Get All Clients Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get client by id
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findById(id);
    res.status(200).json(client);
  } catch (error) {
    console.error('Get Client By Id Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new client
const create = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, nif, address, addressContinued, city, postalCode, country } =
      req.body;

    // Check if all fields are filled
    if (!firstName) {
      return res.status(406).json({ message: 'O campo primeiro nome é obrigatório!' });
    }
    if (!lastName) {
      return res.status(406).json({ message: 'O campo último nome é obrigatório!' });
    }
    if (!email) {
      return res.status(406).json({ message: 'O campo email é obrigatório!' });
    }
    if (!password) {
      return res.status(406).json({ message: 'O campo password é obrigatório!' });
    }
    if (!phone) {
      return res.status(406).json({ message: 'O campo telefone é obrigatório!' });
    }
    if (!nif) {
      return res.status(406).json({ message: 'O campo NIF é obrigatório!' });
    }
    if (!address) {
      return res.status(406).json({ message: 'O campo morada é obrigatório!' });
    }
    if (!city) {
      return res.status(406).json({ message: 'O campo cidade é obrigatório!' });
    }
    if (!postalCode) {
      return res.status(406).json({ message: 'O campo código postal é obrigatório!' });
    }
    if (!country) {
      return res.status(406).json({ message: 'O campo país é obrigatório!' });
    }

    // Check if client already exists
    const clientExists = await Client.findOne({ email });
    if (clientExists) {
      return res.status(409).json({ message: 'O email que introduziu já pertence a uma conta!' });
    }

    // Check if nif already exists
    const nifExists = await Client.findOne({ nif });
    if (nifExists) {
      return res.status(409).json({ message: 'O NIF que introduziu já pertence a uma conta!' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    // Body of client
    const client = new Client({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      nif,
      address,
      addressContinued,
      city,
      postalCode,
      country,
    });

    await client.save();
    console.log('Client created with success!\nClient Id:', client._id);

    res.status(201).json({ message: 'Client registered!' });
  } catch (error) {
    console.error('Client Registration Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a client
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, nif, address, addressContinued, city, postalCode, country } = req.body;

    let client = await Client.findById(id);

    client.firstName = firstName;
    client.lastName = lastName;
    client.email = email;
    client.phone = phone;
    client.nif = nif;
    client.address = address;
    client.addressContinued = addressContinued;
    client.city = city;
    client.postalCode = postalCode;
    client.country = country;

    await client.save();
    res.status(200).json({ message: 'Client updated' });
  } catch (error) {
    console.error('Update Client Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a client
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Client.findByIdAndDelete(id);
    res.status(200).json({ message: 'Client deleted' });
  } catch (error) {
    console.error('Delete Client Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { login, getAll, getById, create, update, remove };
