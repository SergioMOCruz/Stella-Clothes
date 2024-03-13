const Service = require('../models/product');
const ClientModel = require('../models/client');
const EmployeeModel = require('../models/employee');

// Get all services
const getAll = async (req, res) => {
  try {
    const services = await Service.find();
    //get car licence plate and client phone if any service is found
    if (services.length == 0) {
      return res.status(200).json({ message: 'No services found' });
    }
    res.status(201).json(services);
  } catch (error) {
    console.error('Get All Services Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all finished services
const getAllFinished = async (req, res) => {
  try {
    const services = await Service.find({ state: false });
    //get car licence plate and client phone if any service is found
    if (services.length == 0) {
      return res.status(200).json({ message: 'No services found' });
    }
    res.status(201).json(services);
  } catch (error) {
    console.error('Get All Services Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get service by id
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    res.status(200).json(service);
  } catch (error) {
    console.error('Get Service By Id Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get service by phone (client)
const getByPhone = async (req, res) => {
  try {
    const phone = req.params.phone;

    const service = await Service.find({ phone: phone });

    res.status(201).json(service);
  } catch (error) {
    console.error('Get Service By Phone Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get service by phone (client), finished services
const getByPhoneFinished = async (req, res) => {
  try {
    const phone = req.params.phone;

    const service = await Service.find({ phone: phone, state: false });

    res.status(201).json(service);
  } catch (error) {
    console.error('Get Service By Phone Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get service by licence plate (car)
const getByLicencePlate = async (req, res) => {
  try {
    const licencePlate = req.params.licencePlate.toUpperCase();

    const service = await Service.find({ licencePlate: licencePlate});

    res.status(201).json(service);
  } catch (error) {
    console.error('Get Service By Licence Plate Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get service by licence plate (car), finished services
const getByLicencePlateFinished = async (req, res) => {
  try {
    const licencePlate = req.params.licencePlate.toUpperCase();

    const service = await Service.find({ licencePlate: licencePlate, state: false });

    res.status(201).json(service);
  } catch (error) {
    console.error('Get Service By Licence Plate Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new service
const create = async (req, res) => {
  try {
    const { licencePlate, phone, deliveryDate, code, services, obs, price, clientType, prePaid } = req.body;

    // Get car by licence plate
    let car = await CarModel.findOne({ licencePlate: licencePlate });

    // Get client by phone
    let client = await ClientModel.findOne({ phone: phone });

    // Get employee by code
    let employee = await EmployeeModel.findOne({ code: code });

    // Body of service
    const service = new Service({
      car: car._id,
      licencePlate,
      client: client._id,
      phone,
      deliveryDate,
      employee: employee._id,
      code,
      services,
      obs,
      price,
      clientType,
      prePaid,
      state: true,
    });

    await service.save();
    console.log('Service created with success!\nService Id:', service._id);

    res.status(201).json({ message: 'Service registered!' });
  } catch (error) {
    console.error('Service Registration Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a service
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { services, obs, finalPrice, state, paid, receipt } = req.body;

    let service = await Service.findById(id);
    service.services = services;
    service.obs = obs;
    service.finalPrice = finalPrice;
    service.state = state;
    service.paid = paid;
    service.receipt = receipt;

    await service.save();
    res.status(200).json({ message: 'Service updated' });
  } catch (error) {
    console.error('Update Service Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a service
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Service.findByIdAndDelete(id);
    res.status(200).json({ message: 'Service deleted' });
  } catch (error) {
    console.error('Delete Service Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAll, getAllFinished, getById, getByPhone, getByPhoneFinished, getByLicencePlate, getByLicencePlateFinished, create, update, remove };
