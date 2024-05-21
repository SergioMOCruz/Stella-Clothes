const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const account = require('../routes/account');
const Account = require('../models/account');

// Create a mock Express app
const app = express();
app.use(express.json());
app.use('/accounts', account);

// Mock the authenticateToken middleware
jest.mock('../middleware/authenticate', () => ({
  authenticateToken: jest.fn((req, res, next) => {
    // Mock authentication by setting a mock user in req.user
    req.user = { id: 'mockUserId', email: 'mock@example.com' };
    next();
  }),
}));

describe('Account Routes', () => {
  describe('GET /accounts', () => {
    it('should respond with all accounts', async () => {
      // Mock account data
      const mockAccounts = [
        { id: 1, name: 'User 1', email: 'user1@example.com' },
        { id: 2, name: 'User 2', email: 'user2@example.com' },
      ];

      // Mock the Account.find() method to return the mockAccounts array
      jest.spyOn(Account, 'find').mockResolvedValue(mockAccounts);

      // Make the request to retrieve all accounts
      const response = await request(app).get('/accounts').set('Content-Type', 'application/json');

      // Ensure the response status is 200 OK
      expect(response.status).toBe(200);

      // Ensure the response body contains the expected account data
      expect(response.body).toEqual(mockAccounts);

      // Ensure the Account.find() method was called once
      expect(Account.find).toHaveBeenCalledTimes(1);
    });

    it('should respond with 500 if an error occurs', async () => {
      // Mock the Account.find() method to throw an error
      jest.spyOn(Account, 'find').mockRejectedValue(new Error('Database error'));

      // Make the request to retrieve all accounts
      const response = await request(app).get('/accounts').set('Content-Type', 'application/json');

      // Ensure the response status is 500 Internal Server Error
      expect(response.status).toBe(500);

      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: 'Internal server error' });

      // Ensure the Account.find() method was called twice
      expect(Account.find).toHaveBeenCalledTimes(2);
    });
  });
  describe('POST /accounts', () => {
    it('should create a new account', async () => {
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

      // Mock the Account.findOne() method to return null (account does not exist)
      jest.spyOn(Account, 'findOne').mockResolvedValue(null);

      // Mock the bcrypt.hash() method to return the hashed password
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      // Mock the account.save() method to return the created account
      const saveMock = jest.fn().mockResolvedValue({
        _id: 'mockAccountId',
      });
      jest.spyOn(Account.prototype, 'save').mockImplementation(saveMock);

      // Make the request to create a new account
      const response = await request(app)
        .post('/accounts/register')
        .send(requestBody)
        .set('Content-Type', 'application/json');

      // Ensure the response status is 201 Created
      expect(response.status).toBe(201);

      // Ensure the response body contains the success message
      expect(response.body).toEqual({ message: 'Conta registada com sucesso!' });

      // Ensure the Account.findOne() method was called twice (for email and nif check)
      expect(Account.findOne).toHaveBeenCalledTimes(2);

      // Ensure the bcrypt.hash() method was called once
      expect(bcrypt.hash).toHaveBeenCalledTimes(1);

      // Ensure the account.save() method was called once
      expect(saveMock).toHaveBeenCalledTimes(1);

      // Ensure the account was saved with the correct data
      expect(saveMock).toHaveBeenCalledWith();
    });

    it('should return 409 if account email already exists', async () => {
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

      // Mock the Account.findOne() method to return a account (email already exists)
      jest.spyOn(Account, 'findOne').mockResolvedValue({});

      // Make the request to create a new account
      const response = await request(app)
        .post('/accounts/register')
        .send(requestBody)
        .set('Content-Type', 'application/json');

      // Ensure the response status is 409 Conflict
      expect(response.status).toBe(409);

      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: 'O email já se encontra registado!' });

      // Ensure the Account.findOne() method was called once (for email and nif check)
      expect(Account.findOne).toHaveBeenCalledTimes(3);

      // Ensure the bcrypt.hash() method was not called
      expect(bcrypt.hash).toHaveBeenCalledTimes(1);

      // Ensure the account.save() method was not called
      expect(Account.prototype.save).toHaveBeenCalledTimes(1);
    });

    it('should return 409 if account nif already exists', async () => {
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

      // Mock the Account.findOne() method to return a account (nif already exists)
      jest.spyOn(Account, 'findOne').mockResolvedValue({});

      // Make the request to create a new account
      const response = await request(app)
        .post('/accounts/register')
        .send(requestBody)
        .set('Content-Type', 'application/json');

      // Ensure the response status is 409 Conflict
      expect(response.status).toBe(409);

      // Ensure the response body contains the error message
      expect(response.body).toEqual({
        message: 'O NIF que introduziu já pertence a uma conta!',
        message: 'O email já se encontra registado!',
      });

      // Ensure the Account.findOne() method was called twice (for email and nif check)
      expect(Account.findOne).toHaveBeenCalledTimes(4);

      // Ensure the bcrypt.hash() method was not called
      expect(bcrypt.hash).toHaveBeenCalledTimes(1);

      // Ensure the account.save() method was not called
      expect(Account.prototype.save).toHaveBeenCalledTimes(1);
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

      // Make the request to create a new account
      const response = await request(app)
        .post('/accounts/register')
        .send(requestBody)
        .set('Content-Type', 'application/json');

      // Ensure the response status is 406 Not Acceptable
      expect(response.status).toBe(406);

      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: 'The email field is mandatory' });

      // Ensure the Account.findOne() method was not called
      expect(Account.findOne).toHaveBeenCalledTimes(4);

      // Ensure the bcrypt.hash() method was not called
      expect(bcrypt.hash).toHaveBeenCalledTimes(1);

      // Ensure the account.save() method was not called
      expect(Account.prototype.save).toHaveBeenCalledTimes(1);
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

      // Mock the Account.findOne() method to throw an error
      jest.spyOn(Account, 'findOne').mockRejectedValue(new Error('Database error'));

      // Make the request to create a new account
      const response = await request(app)
        .post('/accounts/register')
        .send(requestBody)
        .set('Content-Type', 'application/json');

      // Ensure the response status is 500 Internal Server Error
      expect(response.status).toBe(500);

      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: 'Internal server error' });

      // Ensure the Account.findOne() method was called twice (for email and nif check)
      expect(Account.findOne).toHaveBeenCalledTimes(5);

      // Ensure the bcrypt.hash() method was not called
      expect(bcrypt.hash).toHaveBeenCalledTimes(1);

      // Ensure the account.save() method was not called
      expect(Account.prototype.save).toHaveBeenCalledTimes(1);

      // Ensure the console.error() was called with the correct error message
      expect(consoleErrorSpy).toHaveBeenCalledWith('Account Registration Error:', 'Database error');

      // Restore the original console.error function after the test
      consoleErrorSpy.mockRestore();
    });
  });
  
  describe('PUT /accounts', () => {
    it('should update a account', async () => {
      // Mock request parameters and body
      const req = {
        params: { id: 'mockAccountId' },
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com',
          phone: '1234567890',
          nif: '123456789',
          address: '123 Main St',
          addressContinued: 'Apt 4B',
          city: 'New York',
          postalCode: '12345',
          country: 'USA',
        },
      };

      // Mock the Account.findById() method to return a account
      const mockAccount = {
        _id: 'mockAccountId',
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        phone: '1234567890',
        nif: '123456789',
        address: '123 Main St',
        addressContinued: 'Apt 4B',
        city: 'New York',
        postalCode: '12345',
        country: 'USA',
        save: jest.fn(),
      };
      jest.spyOn(Account, 'findById').mockResolvedValue(mockAccount);

      
      const response = await request(app)
      .put('/accounts/'+ req.params.id)
      .send(req.body)
      .set('Content-Type', 'application/json');


      // Ensure the Account.findById() method was called once with the correct id
      expect(Account.findById).toHaveBeenCalledTimes(1);
      expect(Account.findById).toHaveBeenCalledWith('mockAccountId');

      // Ensure the account properties were updated correctly
      expect(mockAccount.firstName).toBe('John');
      expect(mockAccount.lastName).toBe('Doe');
      expect(mockAccount.email).toBe('johndoe@example.com');
      expect(mockAccount.phone).toBe('1234567890');
      expect(mockAccount.nif).toBe('123456789');
      expect(mockAccount.address).toBe('123 Main St');
      expect(mockAccount.addressContinued).toBe('Apt 4B');
      expect(mockAccount.city).toBe('New York');
      expect(mockAccount.postalCode).toBe('12345');
      expect(mockAccount.country).toBe('USA');

      // Ensure the account.save() method was called once
      expect(mockAccount.save).toHaveBeenCalledTimes(1);

      // Ensure the response status is 200 OK
      expect(response.status).toBe(200);
      // Ensure the response body contains the success message
      expect(response.body).toEqual({ message: 'Account updated' });
    });

    it('should handle errors and return 500 if an error occurs', async () => {
      // Mock request parameters and body
      const req = {
        params: { id: 'mockAccountId' },
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com',
          phone: '1234567890',
          nif: '123456789',
          address: '123 Main St',
          addressContinued: 'Apt 4B',
          city: 'New York',
          postalCode: '12345',
          country: 'USA',
        },
      };

      // Spy on console.error before the test
      const consoleErrorSpy = jest.spyOn(console, 'error');

      // Mock the Account.findById() method to throw an error
      jest.spyOn(Account, 'findById').mockRejectedValue(new Error('Database error'));

      // Make the request to update the account
      const response = await request(app)
      .put('/accounts/'+ req.params.id)
      .send(req.body)
      .set('Content-Type', 'application/json');


      // Ensure the Account.findById() method was called once with the correct id
      expect(Account.findById).toHaveBeenCalledTimes(2);
      expect(Account.findById).toHaveBeenCalledWith('mockAccountId');

      // Ensure console.error was called with the correct error message
      expect(consoleErrorSpy).toHaveBeenCalledWith('Update Account Error:', 'Database error');

      // Ensure the response status is 500 Internal Server Error
      expect(response.status).toBe(500);
      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: 'Internal server error' });   
     });
  });
});
