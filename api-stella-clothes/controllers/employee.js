const Employee = require('../models/employee');

// Get all employees
const getAll = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error('Get All Employees Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get employee by id
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    res.status(200).json(employee);
  } catch (error) {
    console.error('Get Employee By Id Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new employee
const create = async (req, res) => {
  try {
    const { name, position } = req.body;

    // Body of employee
    const employee = new Employee({
      name: name,
      position: position,
    });

    await employee.save();
    console.log('Employee created with success!\nEmployee Id:', employee._id);

    res.status(201).json({ message: 'Employee registered!' });
  } catch (error) {
    console.error('Employee Registration Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a employee
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position } = req.body;

    // Find employee by id
    let employee = await Employee.findById(id);

    // Update employee
    employee.name = name;
    employee.position = position;

    await employee.save();
    res.status(200).json({ message: 'Employee updated' });
  } catch (error) {
    console.error('Update Employee Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a employee
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Employee.findByIdAndDelete(id);
    res.status(200).json({ message: 'Employee deleted' });
  } catch (error) {
    console.error('Delete Employee Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAll, getById, create, update, remove };
