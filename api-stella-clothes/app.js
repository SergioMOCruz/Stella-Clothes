const express = require('express');
const connectDB = require('./db');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
require('dotenv').config();

// Initialize express
const app = express();

// Rate limiter
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10000, // limit each IP to 100 requests per 10 minutes
});

// Apply rate limiter to all requests
app.use(limiter);

// Port
const port = process.env.PORT || 5001;

// Middleware
const allowedOrigins = ['http://localhost:4200', 'http://127.0.0.1:4200', 'https://stella-clothes.netlify.app', 'https://stella-backoffice.netlify.app'];
app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Logger
app.use((req, res, next) => {
  console.log('Request received:', req.method, req.url);
  next();
});

// Body parser
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/accounts', require('./routes/account'));
app.use('/products', require('./routes/product'));
app.use('/orders', require('./routes/order'));
app.use('/cart', require('./routes/cart'));
app.use('/categories', require('./routes/category'));
app.use('/stripe', require('./routes/stripe'));

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`http://localhost:${port}`);
});
