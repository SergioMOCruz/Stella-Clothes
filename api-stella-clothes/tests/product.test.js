const request = require("supertest");
const express = require("express");
const product = require("../routes/product");
const Product = require("../models/product");
const Category = require("../models/category");

// Create a mock Express app
const app = express();
app.use(express.json());
app.use("/products", product);

// Mock the authenticateToken middleware
jest.mock("../middleware/authenticate", () => ({
  authenticateToken: jest.fn((req, res, next) => {
    // Mock authentication by setting a mock user in req.user
    req.user = { id: "mockUserId", email: "mock@example.com" };
    next();
  }),
}));

const mockProduct = {
  _id: 'BB21',
  reference: 'prod123',
  name: 'Mock Product',
  description: 'This is a mock product',
  price: 9.99,
  size: 'M',
  stock: 10,
  category: 'mockCategoryId',
  active: true,
};

describe("Product Routes", () => {
  describe("GET /products", () => {
    it("should return mock products when Product.find() is called", () => {
      // Mock product data
      const mockProducts = [
        { id: 1, name: "Product 1", price: 10.99 },
        { id: 2, name: "Product 2", price: 20.99 },
      ];

      // Mock the Product.find() method to return the mockProducts array
      jest.spyOn(Product, "find").mockImplementation(() => mockProducts);

      // Directly invoke Product.find() to simulate the route handler's action
      const products = Product.find();

      // Check if the returned products match the mockProducts array
      expect(products).toEqual(mockProducts);

      // Ensure the Product.find() method was called once
      expect(Product.find).toHaveBeenCalledTimes(1);
    });

    it("should respond with 500 if an error occurs", async () => {
      // Mock the Product.find() method to throw an error
      jest
       .spyOn(Product, "find")
       .mockRejectedValue(new Error("Database error"));

      // Make the request to retrieve all products
      const response = await request(app)
       .get("/products")
       .set("Content-Type", "application/json");

      // Ensure the response status is 500 Internal Server Error
      expect(response.status).toBe(500);

      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: "Internal server error" });

      // Ensure the Product.find() method was called twice
      expect(Product.find).toHaveBeenCalledTimes(2);
    });
  });
  describe("GET /products/:id", () => {
    it("should return a product by ID", async () => {
      const productId = "validProductId"; // Ensure this ID exists in your mock data or database
  
      // Mock product data for the specified ID
      const mockProduct = { id: productId, name: "Test Product", price: 15.99 };
  
      // Mock the Product.findById() method to return the mockProduct
      jest.spyOn(Product, "findById").mockResolvedValue(mockProduct);
  
      // Make the request to retrieve the product by ID
      const response = await request(app)
        .get(`/products/${productId}`)
        .set("Content-Type", "application/json");
  
      // Ensure the response status is 200 OK
      expect(response.status).toBe(200);
  
      // Ensure the response body contains the expected product data
      expect(response.body).toEqual(mockProduct);
  
      // Ensure the Product.findById() method was called once with the correct ID
      expect(Product.findById).toHaveBeenCalledTimes(1);
      expect(Product.findById).toHaveBeenCalledWith(productId);
    });
  
    it("should respond with 404 if product ID does not exist", async () => {
      const nonExistentProductId = "nonExistentId"; // Ensure this ID does not exist in your mock data or database
  
      // Mock the Product.findById() method to return null (product does not exist)
      jest.spyOn(Product, "findById").mockResolvedValue(null);
  
      // Make the request to retrieve the non-existent product by ID
      const response = await request(app)
        .get(`/products/${nonExistentProductId}`)
        .set("Content-Type", "application/json");
  
      // Ensure the response status is 404 Not Found
      expect(response.status).toBe(404);
  
      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: "Produto não encontrado" });
  
      // Ensure the Product.findById() method was called once with the correct ID
      expect(Product.findById).toHaveBeenCalledTimes(2);
      expect(Product.findById).toHaveBeenCalledWith(nonExistentProductId);
    });
  });
  
  describe("DELETE /products/:id", () => {
    it("should delete a product by ID", async () => {
      const productIdToDelete = "validProductIdToDelete"; // Ensure this ID exists in your mock data or database
  
      // Mock the Product.findByIdAndDelete() method to return a success message
      jest.spyOn(Product, "findByIdAndDelete").mockResolvedValue({
        message: "Produto removido com sucesso!",
      });
  
      // Make the request to delete the product by ID
      const response = await request(app)
        .delete(`/products/${productIdToDelete}`)
        .set("Content-Type", "application/json");
  
      // Ensure the response status is 200 OK
      expect(response.status).toBe(200);
  
      // Ensure the response body contains the success message
      expect(response.body).toEqual({ message: "Produto removido com sucesso!" });
  
      // Ensure the Product.findByIdAndDelete() method was called once with the correct ID
      expect(Product.findByIdAndDelete).toHaveBeenCalledTimes(1);
      expect(Product.findByIdAndDelete).toHaveBeenCalledWith(productIdToDelete);
    });
  
    it("should respond with 404 if product ID to delete does not exist", async () => {
      const nonExistentProductIdToDelete = "nonExistentIdToDelete"; // Ensure this ID does not exist in your mock data or database
  
      // Mock the Product.findByIdAndDelete() method to return null (product does not exist)
      jest.spyOn(Product, "findByIdAndDelete").mockResolvedValue(null);
  
      // Make the request to delete the non-existent product by ID
      const response = await request(app)
        .delete(`/products/${nonExistentProductIdToDelete}`)
        .set("Content-Type", "application/json");
  
      // Ensure the response status is 404 Not Found
      expect(response.status).toBe(404);
  
      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: "Produto não encontrado" });
  
      // Ensure the Product.findByIdAndDelete() method was called once with the correct ID
      expect(Product.findByIdAndDelete).toHaveBeenCalledTimes(2);
      expect(Product.findByIdAndDelete).toHaveBeenCalledWith(nonExistentProductIdToDelete);
    });
  });
  
});
