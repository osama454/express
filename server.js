const express = require('express');
const path = require('path');
const dotenvSafe = require('dotenv-safe').config();
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');
const { protect, authorize } = require('./middleware/authMiddleware');
const { loginRateLimiter } = require('./middleware/rateLimitMiddleware');
const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const PORT = process.env.PORT || 5000;

// Initialize Express app
const app = express();

// Connect to the database
connectDB();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Route-specific middleware for rate limiting on login
app.use('/api/users/login', loginRateLimiter);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tickets', protect, authorize(['admin', 'user']), ticketRoutes); // Protect with RBAC

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html')));
} else {
  app.get('/', (req, res) => res.status(200).json({ message: 'Welcome to the Support Desk API (Development)' }));
}

// Centralized error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
