const request = require('supertest');
const express = require('express');
const categoryRoutes = require('../routes/category');
const Category = require('../models/category');

// Create a mock Express app
const app = express();
app.use(express.json());
app.use('/category', categoryRoutes);

// Mock the authenticateToken middleware
jest.mock('../middleware/authenticate', () => ({
  authenticateToken: jest.fn((req, res, next) => {
    // Mock authentication by setting a mock user in req.user
    req.user = { id: 'mockUserId', email: 'mock@example.com' };
    next();
  }),
}));

describe('Category Routes', () => {
  describe('GET /category', () => {
    it('should respond with all categories', async () => {
      // Mock category data
      const mockCategories = [
        { id: 1, description: 'Category 1' },
        { id: 2, description: 'Category 2' },
      ];

      // Mock the Category.find() method to return the mockCategories array
      jest.spyOn(Category, 'find').mockResolvedValue(mockCategories);

      // Make the request to retrieve all categories
      const response = await request(app).get('/category').set('Content-Type', 'application/json');

      // Ensure the response status is 200 OK
      expect(response.status).toBe(200);

      // Ensure the response body contains the expected category data
      expect(response.body).toEqual(mockCategories);

      // Ensure the Category.find() method was called once
      expect(Category.find).toHaveBeenCalledTimes(1);
    });

    it('should respond with 500 if an error occurs', async () => {
      // Mock the Category.find() method to throw an error
      jest.spyOn(Category, 'find').mockRejectedValue(new Error('Database error'));

      // Make the request to retrieve all categories
      const response = await request(app).get('/category').set('Content-Type', 'application/json');

      // Ensure the response status is 500 Internal Server Error
      expect(response.status).toBe(500);

      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: 'Internal server error' });

      // Ensure the Category.find() method was called once
      expect(Category.find).toHaveBeenCalledTimes(2);
    });
  });

  describe('GET /category/:id', () => {
    it('should respond with a category by id', async () => {
      // Mock category data
      const mockCategory = { id: 1, description: 'Category 1' };

      // Mock the Category.findById() method to return the mockCategory object
      jest.spyOn(Category, 'findById').mockResolvedValue(mockCategory);

      // Make the request to retrieve the category by id
      const response = await request(app).get('/category/1').set('Content-Type', 'application/json');

      // Ensure the response status is 200 OK
      expect(response.status).toBe(200);

      // Ensure the response body contains the expected category data
      expect(response.body).toEqual(mockCategory);

      // Ensure the Category.findById() method was called once
      expect(Category.findById).toHaveBeenCalledTimes(1);
    });

    it('should respond with 404 if the category is not found', async () => {
      // Mock the Category.findById() method to return null
      jest.spyOn(Category, 'findById').mockResolvedValue(null);

      // Make the request to retrieve the category by id
      const response = await request(app).get('/category/1').set('Content-Type', 'application/json');

      // Ensure the response status is 404 Not Found
      expect(response.status).toBe(404);

      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: 'Categoria não encontrada!' });

      // Ensure the Category.findById() method was called once
      expect(Category.findById).toHaveBeenCalledTimes(2);
    });

    it('should respond with 500 if an error occurs', async () => {
      // Mock the Category.findById() method to throw an error
      jest.spyOn(Category, 'findById').mockRejectedValue(new Error('Database error'));

      // Make the request to retrieve the category by id
      const response = await request(app).get('/category/1').set('Content-Type', 'application/json');

      // Ensure the response status is 500 Internal Server Error
      expect(response.status).toBe(500);

      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: 'Internal server error' });

      // Ensure the Category.findById() method was called once
      expect(Category.findById).toHaveBeenCalledTimes(3);
    });
  });

  describe('GET /category/description/:description', () => {
    it('should respond with a category by description', async () => {
      // Mock category data
      const mockCategory = { id: 1, description: 'Category 1' };

      // Mock the Category.findOne() method to return the mockCategory object
      jest.spyOn(Category, 'findOne').mockResolvedValue(mockCategory);

      // Make the request to retrieve the category by description
      const response = await request(app).get('/category/description/Category 1').set('Content-Type', 'application/json');

      // Ensure the response status is 200 OK
      expect(response.status).toBe(200);

      // Ensure the response body contains the expected category data
      expect(response.body).toEqual(mockCategory);

      // Ensure the Category.findOne() method was called once
      expect(Category.findOne).toHaveBeenCalledTimes(1);
    });

    it('should respond with 404 if the category is not found', async () => {
      // Mock the Category.findOne() method to return null
      jest.spyOn(Category, 'findOne').mockResolvedValue(null);

      // Make the request to retrieve the category by description
      const response = await request(app).get('/category/description/Category 1').set('Content-Type', 'application/json');

      // Ensure the response status is 404 Not Found
      expect(response.status).toBe(404);

      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: 'Categoria não encontrada!' });

      // Ensure the Category.findOne() method was called once
      expect(Category.findOne).toHaveBeenCalledTimes(2);
    });

    it('should respond with 500 if an error occurs', async () => {
      // Mock the Category.findOne() method to throw an error
      jest.spyOn(Category, 'findOne').mockRejectedValue(new Error('Database error'));

      // Make the request to retrieve the category by description
      const response = await request(app).get('/category/description/Category 1').set('Content-Type', 'application/json');

      // Ensure the response status is 500 Internal Server Error
      expect(response.status).toBe(500);

      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: 'Internal server error' });

      // Ensure the Category.findOne() method was called once
      expect(Category.findOne).toHaveBeenCalledTimes(3);
    });
  });

  describe('POST /category', () => {
    it('should create a new category', async () => {
      // Mock request body
      const requestBody = {
        description: 'New Category',
      };

      // Mock the Category.findOne() method to return null (category does not exist)
      jest.spyOn(Category, 'findOne').mockResolvedValue(null);

      // Mock the category.save() method to return the created category
      const saveMock = jest.fn().mockResolvedValue({
        _id: 'mockCategoryId',
      });
      jest.spyOn(Category.prototype, 'save').mockImplementation(saveMock);

      // Make the request to create a new category
      const response = await request(app)
        .post('/category')
        .send(requestBody)
        .set('Content-Type', 'application/json');

      // Ensure the response status is 201 Created
      expect(response.status).toBe(201);

      // Ensure the response body contains the success message
      expect(response.body).toEqual({ message: 'Categoria adicionada com sucesso!' });

      // Ensure the Category.findOne() method was called once
      expect(Category.findOne).toHaveBeenCalledTimes(4);

      // Ensure the category.save() method was called once
      expect(saveMock).toHaveBeenCalledTimes(1);
    });

    it('should return 409 if category already exists', async () => {
      // Mock request body
      const requestBody = {
        description: 'Existing Category',
      };

      // Mock the Category.findOne() method to return a category (already exists)
      jest.spyOn(Category, 'findOne').mockResolvedValue({});

      // Make the request to create a new category
      const response = await request(app)
        .post('/category')
        .send(requestBody)
        .set('Content-Type', 'application/json');

      // Ensure the response status is 409 Conflict
      expect(response.status).toBe(409);

      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: 'A categoria já existe!' });

      // Ensure the Category.findOne() method was called once
      expect(Category.findOne).toHaveBeenCalledTimes(5);
    });

    it('should return 500 if an error occurs', async () => {
      // Mock request body
      const requestBody = {
        description: 'New Category',
      };

      // Mock the Category.findOne() method to throw an error
      jest.spyOn(Category, 'findOne').mockRejectedValue(new Error('Database error'));

      // Make the request to create a new category
      const response = await request(app)
        .post('/category')
        .send(requestBody)
        .set('Content-Type', 'application/json');

      // Ensure the response status is 500 Internal Server Error
      expect(response.status).toBe(500);

      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: 'Internal server error' });

      // Ensure the Category.findOne() method was called once
      expect(Category.findOne).toHaveBeenCalledTimes(6);
    });
  });

  describe('PUT /category/:id', () => {
    it('should update a category', async () => {
      // Mock request body
      const requestBody = {
        description: 'Updated Category',
      };

      // Mock the Category.findOne() method to return null (category description does not exist)
      jest.spyOn(Category, 'findOne').mockResolvedValue(null);

      // Mock the Category.findById() method to return the category to be updated
      const mockCategory = {
        _id: 'mockCategoryId',
        description: 'Old Category',
        save: jest.fn().mockResolvedValue({}),
      };
      jest.spyOn(Category, 'findById').mockResolvedValue(mockCategory);

      // Make the request to update the category
      const response = await request(app)
        .put('/category/mockCategoryId')
        .send(requestBody)
        .set('Content-Type', 'application/json');

      // Ensure the response status is 200 OK
      expect(response.status).toBe(200);

      // Ensure the response body contains the success message
      expect(response.body).toEqual({ message: 'Categoria atualizada com sucesso!' });

      // Ensure the Category.findOne() method was called once
      expect(Category.findOne).toHaveBeenCalledTimes(7);

      // Ensure the Category.findById() method was called once
      expect(Category.findById).toHaveBeenCalledTimes(4);

      // Ensure the category.save() method was called once
      expect(mockCategory.save).toHaveBeenCalledTimes(1);

      // Ensure the category's description was updated
      expect(mockCategory.description).toBe('Updated Category');
    });

    it('should return 400 if category description already exists', async () => {
      // Mock request body
      const requestBody = {
        description: 'Existing Category',
      };

      // Mock the Category.findOne() method to return a category (description already exists)
      jest.spyOn(Category, 'findOne').mockResolvedValue({});

      // Make the request to update the category
      const response = await request(app)
        .put('/category/mockCategoryId')
        .send(requestBody)
        .set('Content-Type', 'application/json');

      // Ensure the response status is 400 Bad Request
      expect(response.status).toBe(400);

      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: 'A categoria já existe!' });

      // Ensure the Category.findOne() method was called once
      expect(Category.findOne).toHaveBeenCalledTimes(8);
    });

    it('should return 500 if an error occurs', async () => {
      // Mock request body
      const requestBody = {
        description: 'Updated Category',
      };

      // Mock the Category.findOne() method to return null (category description does not exist)
      jest.spyOn(Category, 'findOne').mockResolvedValue(null);

      // Mock the Category.findById() method to throw an error
      jest.spyOn(Category, 'findById').mockRejectedValue(new Error('Database error'));

      // Make the request to update the category
      const response = await request(app)
        .put('/category/mockCategoryId')
        .send(requestBody)
        .set('Content-Type', 'application/json');

      // Ensure the response status is 500 Internal Server Error
      expect(response.status).toBe(500);

      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: 'Internal server error' });

      // Ensure the Category.findOne() method was called once
      expect(Category.findOne).toHaveBeenCalledTimes(9);

      // Ensure the Category.findById() method was called once
      expect(Category.findById).toHaveBeenCalledTimes(5);
    });
  });

  describe('DELETE /category/:id', () => {
    it('should delete a category', async () => {
      // Mock the Category.findByIdAndDelete() method to return a deleted category
      const mockCategory = {
        _id: 'mockCategoryId',
        description: 'Category to be deleted',
      };
      jest.spyOn(Category, 'findByIdAndDelete').mockResolvedValue(mockCategory);

      // Make the request to delete the category
      const response = await request(app)
        .delete('/category/mockCategoryId')
        .set('Content-Type', 'application/json');

      // Ensure the response status is 200 OK
      expect(response.status).toBe(200);

      // Ensure the response body contains the success message
      expect(response.body).toEqual({ message: 'Categoria removida com sucesso!' });

      // Ensure the Category.findByIdAndDelete() method was called once
      expect(Category.findByIdAndDelete).toHaveBeenCalledTimes(1);
    });

    it('should return 404 if category does not exist', async () => {
      // Mock the Category.findByIdAndDelete() method to return null
      jest.spyOn(Category, 'findByIdAndDelete').mockResolvedValue(null);

      // Make the request to delete the category
      const response = await request(app)
        .delete('/category/mockCategoryId')
        .set('Content-Type', 'application/json');

      // Ensure the response status is 404 Not Found
      expect(response.status).toBe(404);

      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: 'Categoria não encontrada!' });

      // Ensure the Category.findByIdAndDelete() method was called once
      expect(Category.findByIdAndDelete).toHaveBeenCalledTimes(2);
    });

    it('should return 500 if an error occurs', async () => {
      // Mock the Category.findByIdAndDelete() method to throw an error
      jest.spyOn(Category, 'findByIdAndDelete').mockRejectedValue(new Error('Database error'));

      // Make the request to delete the category
      const response = await request(app)
        .delete('/category/mockCategoryId')
        .set('Content-Type', 'application/json');

      // Ensure the response status is 500 Internal Server Error
      expect(response.status).toBe(500);

      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: 'Internal server error' });

      // Ensure the Category.findByIdAndDelete() method was called once
      expect(Category.findByIdAndDelete).toHaveBeenCalledTimes(3);
    });
  });
});
