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

// Create a new client
const create = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, nif, address, addressContinued, city, postalCode, country } = req.body;

    // Body of client
    const client = new Client({
      firstName,
      lastName,
      email,
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

module.exports = { getAll, getById, create, update, remove };
