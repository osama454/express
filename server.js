// server.js
const express = require('express');
const dotenv = require('dotenv').config();
const path = require('path');
const { errorHandler } = require('./middleware/errorHandler');
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');


// Connect to DB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  store: process.env.NODE_ENV === 'production' ?  new RedisStore({
    sendCommand: (...args) => new Promise((resolve, reject) => {
        const client = redis.createClient({ url: process.env.REDIS_URL});
        client.send_command(...args, (err, result) => err ? reject(err) : resolve(result));
      })
  }) : undefined, // Use Redis in production, in-memory store otherwise,
  message: {message:'Too many requests, please try again later'},
});


// Apply rate limiter to specific routes
app.use('/api/users/login', limiter);


// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));

// Serve Frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the Support Desk API' });
  });
}


// Error Handler
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on Port ${PORT}`);
});
