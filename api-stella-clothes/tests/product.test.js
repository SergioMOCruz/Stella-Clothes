const request = require('supertest');
const express = require('express');
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
  // Existing tests...

  describe('DELETE /accounts/:id', () => {
    it('should delete an account', async () => {
      // Mock the Account.findByIdAndDelete() method to return a deleted account
      const mockAccount = {
        _id: 'mockAccountId',
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
      };
      jest.spyOn(Account, 'findByIdAndDelete').mockResolvedValue(mockAccount);

      // Make the request to delete the account
      const response = await request(app)
        .delete('/accounts/mockAccountId')
        .set('Content-Type', 'application/json');

      // Ensure the response status is 200 OK
      expect(response.status).toBe(200);
      // Ensure the response body contains the success message
      expect(response.body).toEqual({ message: 'Conta removida com sucesso!' });

      // Ensure the Account.findByIdAndDelete() method was called once
      expect(Account.findByIdAndDelete).toHaveBeenCalledTimes(1);
      expect(Account.findByIdAndDelete).toHaveBeenCalledWith('mockAccountId');
    });

    it('should return 404 if account does not exist', async () => {
      // Mock the Account.findByIdAndDelete() method to return null
      jest.spyOn(Account, 'findByIdAndDelete').mockResolvedValue(null);

      // Make the request to delete the account
      const response = await request(app)
        .delete('/accounts/mockAccountId')
        .set('Content-Type', 'application/json');

      // Ensure the response status is 404 Not Found
      expect(response.status).toBe(404);
      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: 'Conta não encontrada!' });

      // Ensure the Account.findByIdAndDelete() method was called once
      expect(Account.findByIdAndDelete).toHaveBeenCalledTimes(2);
      expect(Account.findByIdAndDelete).toHaveBeenCalledWith('mockAccountId');
    });

    it('should return 500 if an error occurs', async () => {
      // Spy on console.error before the test
      const consoleErrorSpy = jest.spyOn(console, 'error');

      // Mock the Account.findByIdAndDelete() method to throw an error
      jest.spyOn(Account, 'findByIdAndDelete').mockRejectedValue(new Error('Database error'));

      // Make the request to delete the account
      const response = await request(app)
        .delete('/accounts/mockAccountId')
        .set('Content-Type', 'application/json');

      // Ensure the response status is 500 Internal Server Error
      expect(response.status).toBe(500);
      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: 'Internal server error' });

      // Ensure the Account.findByIdAndDelete() method was called once
      expect(Account.findByIdAndDelete).toHaveBeenCalledTimes(3);

      // Ensure console.error was called with the correct error message
      expect(consoleErrorSpy).toHaveBeenCalledWith('Delete Account Error:', 'Database error');

      // Restore the original console.error function after the test
      consoleErrorSpy.mockRestore();
    });
  });

  describe('GET /accounts/:id', () => {
    it('should retrieve an account', async () => {
      // Mock the Account.findById() method to return a found account
      const mockAccount = {
        _id: 'mockAccountId',
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
      };
      jest.spyOn(Account, 'findById').mockResolvedValue(mockAccount);

      // Make the request to retrieve the account
      const response = await request(app)
        .get('/accounts/mockAccountId')
        .set('Content-Type', 'application/json');

      // Ensure the response status is 200 OK
      expect(response.status).toBe(200);
      // Ensure the response body contains the account data
      expect(response.body).toEqual(mockAccount);

      // Ensure the Account.findById() method was called once
      expect(Account.findById).toHaveBeenCalledTimes(1);
      expect(Account.findById).toHaveBeenCalledWith('mockAccountId');
    });

    it('should return 404 if account does not exist', async () => {
      // Mock the Account.findById() method to return null
      jest.spyOn(Account, 'findById').mockResolvedValue(null);

      // Make the request to retrieve the account
      const response = await request(app)
        .get('/accounts/mockAccountId')
        .set('Content-Type', 'application/json');

      // Ensure the response status is 404 Not Found
      expect(response.status).toBe(404);
      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: 'Conta não encontrada!' });

      // Ensure the Account.findById() method was called once
      expect(Account.findById).toHaveBeenCalledTimes(2);
      expect(Account.findById).toHaveBeenCalledWith('mockAccountId');
    });

    it('should return 500 if an error occurs', async () => {
      // Spy on console.error before the test
      const consoleErrorSpy = jest.spyOn(console, 'error');

      // Mock the Account.findById() method to throw an error
      jest.spyOn(Account, 'findById').mockRejectedValue(new Error('Database error'));

      // Make the request to retrieve the account
      const response = await request(app)
        .get('/accounts/mockAccountId')
        .set('Content-Type', 'application/json');

      // Ensure the response status is 500 Internal Server Error
      expect(response.status).toBe(500);
      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: 'Internal server error' });

      // Ensure the Account.findById() method was called once
      expect(Account.findById).toHaveBeenCalledTimes(3);

      // Ensure console.error was called with the correct error message
      expect(consoleErrorSpy).toHaveBeenCalledWith("Get Account By Id Error:", "Database error");

      // Restore the original console.error function after the test
      consoleErrorSpy.mockRestore();
    });
  });
});
