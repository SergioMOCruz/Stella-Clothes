const request = require('supertest');
const express = require('express');
const client = require('../routes/client');
const Client = require('../models/client'); // Assuming you have a Client model

// Create a mock Express app
const app = express();
app.use(express.json());
app.use('/clients', client);

describe('Client Routes', () => {
  describe('GET /clients', () => {
    it('should respond with all clients', async () => {
      // Mock client data
      const mockClients = [
        { id: 1, name: 'User 1', email: 'user1@example.com' },
        { id: 2, name: 'User 2', email: 'user2@example.com' },
      ];

      // Mock the Client.find() method to return the mockClients array
      Client.find = jest.fn().mockResolvedValue(mockClients);

      // Make the request to retrieve all clients
      const response = await request(app)
        .get('/clients')
        .set('Content-Type', 'application/json')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MTQ1MTMzZTAxMjE5OWMxMmVkZDJlNiIsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJpYXQiOjE3MTI4NzA3ODAsImV4cCI6MTcxNTQ2Mjc4MH0.yw9_KqMkmT0a9eR6kHG80sGUeMupFAGKWtMGFTnRjBE'
        );

      // Ensure the response status is 200 OK
      expect(response.status).toBe(200);

      // Ensure the response body contains the expected client data
      expect(response.body).toEqual(mockClients);

      // Ensure the Client.find() method was called once
      expect(Client.find).toHaveBeenCalledTimes(1);
    });

    it('should respond with 500 if an error occurs', async () => {
      // Mock the Client.find() method to throw an error
      Client.find = jest.fn().mockRejectedValue(new Error('Database error'));

      // Make the request to retrieve all clients
      const response = await request(app)
        .get('/clients')
        .set('Content-Type', 'application/json')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MTQ1MTMzZTAxMjE5OWMxMmVkZDJlNiIsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJpYXQiOjE3MTI4NzA3ODAsImV4cCI6MTcxNTQ2Mjc4MH0.yw9_KqMkmT0a9eR6kHG80sGUeMupFAGKWtMGFTnRjBE'
        );

      // Ensure the response status is 500 Internal Server Error
      expect(response.status).toBe(500);

      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: 'Internal server error' });

      // Ensure the Client.find() method was called once
      expect(Client.find).toHaveBeenCalledTimes(1);
    });
  });
});