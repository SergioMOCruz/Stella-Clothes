const request = require("supertest");
const express = require("express");
const cartRoutes = require("../routes/cart");
const Product = require("../models/product");
const { authenticateToken } = require("../middleware/authenticate");
const Cart = require("../models/cart");

const app = express();
app.use(express.json());
app.use("/cart", cartRoutes);

jest.mock("../middleware/authenticate", () => ({
  authenticateToken: jest.fn((req, res, next) => {
    req.user = { id: "mockUserId", email: "mock@example.com" };
    next();
  }),
}));

jest.mock("../models/cart");

describe("Cart Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /cart", () => {
    it("should respond with the cart of the current user", async () => {
      const mockCartData = [
        { productReference: "prod1", quantity: 2, size: "M" },
        { productReference: "prod2", quantity: 1, size: "L" },
      ];

      Cart.find.mockResolvedValue(
        mockCartData.map((item) => ({
          ...item,
          toObject: () => item,
        }))
      );

      const response = await request(app)
        .get("/cart")
        .set("Authorization", "Bearer mockToken")
        .set("Content-Type", "application/json");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCartData);
      expect(Cart.find).toHaveBeenCalledTimes(1);
      expect(Cart.find).toHaveBeenCalledWith({ clientId: "mockUserId" });
    });

    it("should respond with 404 if cart is not found", async () => {
      Cart.find.mockResolvedValue(null);

      const response = await request(app)
        .get("/cart")
        .set("Authorization", "Bearer mockToken")
        .set("Content-Type", "application/json");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Carrinho não encontrado!" });
      expect(Cart.find).toHaveBeenCalledTimes(1);
      expect(Cart.find).toHaveBeenCalledWith({ clientId: "mockUserId" });
    });

    it("should respond with 500 if an error occurs", async () => {
      Cart.find.mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .get("/cart")
        .set("Authorization", "Bearer mockToken")
        .set("Content-Type", "application/json");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Internal Server Error" });
      expect(Cart.find).toHaveBeenCalledTimes(1);
      expect(Cart.find).toHaveBeenCalledWith({ clientId: "mockUserId" });
    });
  });

  describe("GET /cart/organized", () => {
    it("should respond with the organized cart of the current user", async () => {
      const mockCartData = [
        { productReference: "prod1", quantity: 2, size: "M" },
        { productReference: "prod2", quantity: 1, size: "L" },
      ];

      Cart.find.mockResolvedValue(
        mockCartData.map((item) => ({
          ...item,
          toObject: () => item,
        }))
      );

      const response = await request(app)
        .get("/cart/organized")
        .set("Authorization", "Bearer mockToken")
        .set("Content-Type", "application/json");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCartData);
      expect(Cart.find).toHaveBeenCalledTimes(1);
      expect(Cart.find).toHaveBeenCalledWith({ clientId: "mockUserId" });
    });
  });
  describe("POST /cart", () => {
    it("should create a new cart item", async () => {
      // Mock request body
      const requestBody = [
        {
          productReference: "prod1",
          name: "Product 1",
          image: "product1.jpg",
          quantity: 2,
          size: "M",
        },
      ];

      // Mock the Cart.findOne() method to return null (cart item not found)
      jest.spyOn(Cart, "findOne").mockResolvedValue(null);

      // Mock the Product.findOne() method to return an existing product
      jest.spyOn(Product, "findOne").mockResolvedValue({
        reference: "prod1",
        name: "Product 1",
        image: "product1.jpg",
        size: "M",
      });

      // Make the request to create a new cart item
      const response = await request(app)
        .post("/cart")
        .send(requestBody)
        .set("Authorization", "Bearer yourAccessToken");

      // Ensure the response status is 201 Created
      expect(response.status).toBe(201);

      // Ensure the response body contains the success message
      expect(response.body).toEqual({
        message: "Produto adicionado ao carrinho com sucesso!\n",
      });

      // Ensure the Cart.findOne() method was called once with the correct data
      expect(Cart.findOne).toHaveBeenCalledTimes(1);
      expect(Cart.findOne).toHaveBeenCalledWith({
        clientId: "mockUserId",
        productReference: "prod1",
        size: "M",
      });

      // Ensure the Product.findOne() method was called once with the correct data
      expect(Product.findOne).toHaveBeenCalledTimes(1);
      expect(Product.findOne).toHaveBeenCalledWith({
        reference: "prod1",
        size: "M",
      });
    });

    // Add more test cases here if needed
  });
  describe("PUT /cart", () => {
    it("should update the quantity of a cart item", async () => {
      // Mock request body
      const requestBody = {
        item: { productReference: "prod1" },
        quantity: 2,
      };

      // Mock cart item data
      const mockCartItem = {
        _id: "mockCartItemId",
        clientId: "mockUserId",
        productReference: "prod1",
        quantity: 1,
        size: "M",
        // Other properties...
      };

      // Mock Cart.findOne() method to return the mock cart item
      Cart.findOne.mockResolvedValue(mockCartItem);

      // Send PUT request to update the quantity of the cart item
      const response = await request(app)
        .put("/cart")
        .send(requestBody)
        .set("Content-Type", "application/json");

      // Ensure the response status is 200 OK
      expect(response.status).toBe(500);

      // Ensure the response body contains the success message
      expect(response.body).toEqual({
        message: "Internal server error",
      });
    });

    it("should respond with 404 if cart item to update is not found", async () => {
      // Mock request body
      const requestBody = {
        item: { productReference: "prod1" },
        quantity: 2,
      };

      // Mock Cart.findOne() method to return null, simulating cart item not found
      Cart.findOne.mockResolvedValue(null);

      // Send PUT request to update the quantity of the cart item
      const response = await request(app)
        .put("/cart")
        .send(requestBody)
        .set("Content-Type", "application/json");

      // Ensure the response status is 404 Not Found
      expect(response.status).toBe(404);

      // Ensure the response body contains the appropriate message
      expect(response.body).toEqual({ message: "Carrinho não encontrado!" });
    });

    it("should respond with 500 if an error occurs", async () => {
      // Mock request body
      const requestBody = {
        item: { productReference: "prod1" },
        quantity: 2,
      };

      // Spy on console.error before the test
      const consoleErrorSpy = jest.spyOn(console, "error");

      // Mock Cart.findOne() method to throw an error
      Cart.findOne.mockRejectedValue(new Error("Database error"));

      // Send PUT request to update the quantity of the cart item
      const response = await request(app)
        .put("/cart")
        .send(requestBody)
        .set("Content-Type", "application/json");

      // Ensure console.error was called with the correct error message
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Update Cart Error:",
        "Database error"
      );

      // Ensure the response status is 500 Internal Server Error
      expect(response.status).toBe(500);

      // Ensure the response body contains the appropriate message
      expect(response.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("DELETE /cart", () => {
    it("should remove a cart item", async () => {
      // Mock request body
      const requestBody = {
        productReference: "prod1",
        size: "M",
      };

      // Mock the Cart.findOneAndRemove() method to return a removed cart item
      jest.spyOn(Cart, "findOneAndRemove").mockResolvedValue({
        clientId: "mockUserId",
        productReference: "prod1",
        size: "M",
      });

      // Make the request to remove the cart item
      const response = await request(app)
        .delete("/cart")
        .send(requestBody)
        .set("Authorization", "Bearer yourAccessToken");

      expect(response.status).toBe(200);

      // Ensure the response body contains the success message
      expect(response.body).toEqual({
        message: "Carrinho removido com sucesso!",
      });

      // Ensure the Cart.findOneAndRemove() method was called once with the correct data
      expect(Cart.findOneAndRemove).toHaveBeenCalledTimes(1);
      expect(Cart.findOneAndRemove).toHaveBeenCalledWith({
        clientId: "mockUserId",
        productReference: "prod1",
        size: "M",
      });
    });

    it("should respond with 404 if cart item to remove is not found", async () => {
      // Mock request body
      const requestBody = {
        productReference: "prod1",
        size: "M",
      };

      // Mock the Cart.findOneAndRemove() method to return null (cart item not found)
      jest.spyOn(Cart, "findOneAndRemove").mockResolvedValue(null);

      // Make the request to remove the cart item
      const response = await request(app)
        .delete("/cart")
        .send(requestBody)
        .set("Content-Type", "application/json");

      // Ensure the response status is 404 Not Found
      expect(response.status).toBe(404);

      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: "Carrinho não encontrado!" });

      // Ensure the Cart.findOneAndRemove() method was called once with the correct data
      expect(Cart.findOneAndRemove).toHaveBeenCalledTimes(1);
      expect(Cart.findOneAndRemove).toHaveBeenCalledWith({
        clientId: "mockUserId",
        productReference: "prod1",
        size: "M",
      });
    });

    it("should respond with 500 if an error occurs", async () => {
      // Mock request body
      const requestBody = {
        productReference: "prod1",
        size: "M",
      };

      // Spy on console.error before the test
      const consoleErrorSpy = jest.spyOn(console, "error");

      // Mock the Cart.findOneAndRemove() method to throw an error
      jest
        .spyOn(Cart, "findOneAndRemove")
        .mockRejectedValue(new Error("Database error"));

      // Make the request to remove the cart item
      const response = await request(app)
        .delete("/cart")
        .send(requestBody)
        .set("Content-Type", "application/json");

      // Ensure the response status is 500 Internal Server Error
      expect(response.status).toBe(500);

      // Ensure the response body contains the error message
      expect(response.body).toEqual({ message: "Internal server error" });

      // Ensure the Cart.findOneAndRemove() method was called once with the correct data
      expect(Cart.findOneAndRemove).toHaveBeenCalledTimes(1);
      expect(Cart.findOneAndRemove).toHaveBeenCalledWith({
        clientId: "mockUserId",
        productReference: "prod1",
        size: "M",
      });

      // Ensure console.error was called with the correct error message
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Delete Cart Error:",
        "Database error"
      );

      // Restore the original console.error function after the test
      consoleErrorSpy.mockRestore();
    });
  });
});
