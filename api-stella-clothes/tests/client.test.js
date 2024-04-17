const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const client = require('../routes/client');
const Client = require('../models/client');
const { authenticateToken } = require('../middleware/authenticate');

// Create a mock Express app
const app = express();
app.use(express.json());
app.use('/clients', client);

// Mock the authenticateToken middleware
jest.mock('../middleware/authenticate', () => ({
  authenticateToken: jest.fn((req, res, next) => {
    // Mock authentication by setting a mock user in req.user
    req.user = { id: 'mockUserId', email: 'mock@example.com' };
    next();
  }),
}));

describe('Client Routes', () => {
  describe('GET /clients', () => {
    it('should respond with all clients', async () => {
      // Mock client data
      const mockClients = [
        { id: 1, name: 'User 1', email: 'user1@example.com' },
        { id: 2, name: 'User 2', email: 'user2@example.com' },
      ];

      // Mock the Client.find() method to return the mockClients array
      jest.spyOn(Client, 'find').mockResolvedValue(mockClients);

      // Make the request to retrieve all clients
      const response = await request(app).get('/clients').set('Content-Type', 'application/json');

      // Ensure the response status is 200 OK
      expect(response.status).toBe(200);

      // Ensure the response body contains the expected client data
      expect(response.body).toEqual(mockClients);

      // Ensure the Client.find() method was called once
      expect(Client.find).toHaveBeenCalledTimes(1);
    });

    it('should respond with 500 if an error occurs', async () => {
      // Mock the Client.find() method to throw an error
      jest.spyOn(Client, 'find').mockRejectedValue(new Error('Database error'));

      // Make the request to retrieve all clients
      const response = await request(app).get('/clients').set('Content-Type', 'application/json');

      // Ensure the response status is 500 Internal Server Error
      expect(response.status).toBe(500);

      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: 'Internal server error' });

      // Ensure the Client.find() method was called twice
      expect(Client.find).toHaveBeenCalledTimes(2);
    });
  });
  describe('POST /clients', () => {
    it('should create a new client', async () => {
      // Mock request body
      const requestBody = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        phone: '1234567890',
        nif: '123456789',
        address: '123 Main St',
        addressContinued: 'Apt 4B',
        city: 'New York',
        postalCode: '12345',
        country: 'USA',
      };

      // Mock the Client.findOne() method to return null (client does not exist)
      jest.spyOn(Client, 'findOne').mockResolvedValue(null);

      // Mock the bcrypt.hash() method to return the hashed password
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      // Mock the client.save() method to return the created client
      const saveMock = jest.fn().mockResolvedValue({
        _id: 'mockClientId',
      });
      jest.spyOn(Client.prototype, 'save').mockImplementation(saveMock);

      // Make the request to create a new client
      const response = await request(app)
        .post('/clients/register')
        .send(requestBody)
        .set('Content-Type', 'application/json');

      // Ensure the response status is 201 Created
      expect(response.status).toBe(201);

      // Ensure the response body contains the success message
      expect(response.body).toEqual({ message: 'Client registered!' });

      // Ensure the Client.findOne() method was called twice (for email and nif check)
      expect(Client.findOne).toHaveBeenCalledTimes(2);

      // Ensure the bcrypt.hash() method was called once
      expect(bcrypt.hash).toHaveBeenCalledTimes(1);

      // Ensure the client.save() method was called once
      expect(saveMock).toHaveBeenCalledTimes(1);

      // Ensure the client was saved with the correct data
      expect(saveMock).toHaveBeenCalledWith();
    });

    it('should return 409 if client email already exists', async () => {
      // Mock request body
      const requestBody = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        phone: '1234567890',
        nif: '123456789',
        address: '123 Main St',
        addressContinued: 'Apt 4B',
        city: 'New York',
        postalCode: '12345',
        country: 'USA',
      };

      // Mock the Client.findOne() method to return a client (email already exists)
      jest.spyOn(Client, 'findOne').mockResolvedValue({});

      // Make the request to create a new client
      const response = await request(app)
        .post('/clients/register')
        .send(requestBody)
        .set('Content-Type', 'application/json');

      // Ensure the response status is 409 Conflict
      expect(response.status).toBe(409);

      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: 'O email que introduziu já pertence a uma conta!' });

      // Ensure the Client.findOne() method was called once (for email and nif check)
      expect(Client.findOne).toHaveBeenCalledTimes(3);

      // Ensure the bcrypt.hash() method was not called
      expect(bcrypt.hash).toHaveBeenCalledTimes(1);

      // Ensure the client.save() method was not called
      expect(Client.prototype.save).toHaveBeenCalledTimes(1);
    });

    it('should return 409 if client nif already exists', async () => {
      // Mock request body
      const requestBody = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        phone: '1234567890',
        nif: '123456789',
        address: '123 Main St',
        addressContinued: 'Apt 4B',
        city: 'New York',
        postalCode: '12345',
        country: 'USA',
      };

      // Mock the Client.findOne() method to return a client (nif already exists)
      jest.spyOn(Client, 'findOne').mockResolvedValue({});

      // Make the request to create a new client
      const response = await request(app)
        .post('/clients/register')
        .send(requestBody)
        .set('Content-Type', 'application/json');

      // Ensure the response status is 409 Conflict
      expect(response.status).toBe(409);

      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: 'O NIF que introduziu já pertence a uma conta!', message: 'O email que introduziu já pertence a uma conta!' });

      // Ensure the Client.findOne() method was called twice (for email and nif check)
      expect(Client.findOne).toHaveBeenCalledTimes(4);

      // Ensure the bcrypt.hash() method was not called
      expect(bcrypt.hash).toHaveBeenCalledTimes(1);

      // Ensure the client.save() method was not called
      expect(Client.prototype.save).toHaveBeenCalledTimes(1);
    });

    it('should return 406 if any required field is missing', async () => {
      // Mock request body with missing fields
      const requestBody = {
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        phone: '1234567890',
        nif: '123456789',
        address: '123 Main St',
        addressContinued: 'Apt 4B',
        city: 'New York',
        postalCode: '12345',
        country: 'USA',
      };

      // Make the request to create a new client
      const response = await request(app)
        .post('/clients/register')
        .send(requestBody)
        .set('Content-Type', 'application/json');

      // Ensure the response status is 406 Not Acceptable
      expect(response.status).toBe(406);

      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: 'O campo email é obrigatório!' });

      // Ensure the Client.findOne() method was not called
      expect(Client.findOne).toHaveBeenCalledTimes(4);

      // Ensure the bcrypt.hash() method was not called
      expect(bcrypt.hash).toHaveBeenCalledTimes(1);

      // Ensure the client.save() method was not called
      expect(Client.prototype.save).toHaveBeenCalledTimes(1);
    });

    it('should return 500 if an error occurs', async () => {
      // Mock request body
      const requestBody = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        phone: '1234567890',
        nif: '123456789',
        address: '123 Main St',
        addressContinued: 'Apt 4B',
        city: 'New York',
        postalCode: '12345',
        country: 'USA',
      };

      // Spy on console.error before the test
      const consoleErrorSpy = jest.spyOn(console, 'error');

      // Mock the Client.findOne() method to throw an error
      jest.spyOn(Client, 'findOne').mockRejectedValue(new Error('Database error'));

      // Make the request to create a new client
      const response = await request(app)
        .post('/clients/register')
        .send(requestBody)
        .set('Content-Type', 'application/json');

      // Ensure the response status is 500 Internal Server Error
      expect(response.status).toBe(500);

      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: 'Internal server error' });

      // Ensure the Client.findOne() method was called twice (for email and nif check)
      expect(Client.findOne).toHaveBeenCalledTimes(5);

      // Ensure the bcrypt.hash() method was not called
      expect(bcrypt.hash).toHaveBeenCalledTimes(1);

      // Ensure the client.save() method was not called
      expect(Client.prototype.save).toHaveBeenCalledTimes(1);

      // Ensure the console.error() was called with the correct error message
      expect(consoleErrorSpy).toHaveBeenCalledWith('Client Registration Error:', 'Database error');

      // Restore the original console.error function after the test
      consoleErrorSpy.mockRestore();
    });
  });
});
