const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Middleware
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? 'https://your-production-app-url.com' // Your deployed frontend URL
  : 'http://localhost:5173'; // Your local development URL

const corsOptions = {
  origin: allowedOrigins
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Vacation Management API is running!' });
});

// API routes will be added here
app.use('/api', require('./routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 1. Capture the server object returned by app.listen()
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// 2. Add the graceful shutdown handler
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  server.close(() => {
    console.log('Server has been closed.');
    process.exit(0);
  });
}); 