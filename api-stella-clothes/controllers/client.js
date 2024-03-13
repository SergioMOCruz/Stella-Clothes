const Client = require('../models/client');

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

// Get client by phone
const getByPhone = async (req, res) => {
  try {
    const phone = req.params.phone;
    const client = await Client.find({ phone: phone });
    res.status(200).json(client);
  } catch (error) {
    console.error('Get Client By Id Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get client by nif
const getByNif = async (req, res) => {
  try {
    const nif = req.params.nif;
    const client = await Client.find({ nif: nif });
    res.status(200).json(client);
  } catch (error) {
    console.error('Get Client By Id Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new client
const create = async (req, res) => {
  try {
    const { name, phone, nif, calledIn } = req.body;

    // Body of client
    const client = new Client({
      name,
      phone,
      nif,
      calledIn,
      cars: []
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
    const { name, phone, nif, calledIn, cars } = req.body;

    let client = await Client.findById(id);

    client.name = name;
    client.phone = phone;
    client.nif = nif;
    client.calledIn = calledIn;
    client.cars = cars;

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

module.exports = { getAll, getById, getByPhone, getByNif, create, update, remove };
