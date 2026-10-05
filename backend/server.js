const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const storeRoutes = require('./routes/stores');
const ownerRoutes = require('./routes/owner');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/owner', ownerRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error.' });
});

const seedDatabase = require('./seeders/seed');

// Database sync and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✓ Database connection established (${process.env.DB_DIALECT || 'sqlite'}).`);

    await sequelize.sync();
    console.log('✓ Database synced.');

    // Auto-seed if database is empty
    const { User } = require('./models');
    const userCount = await User.count();
    if (userCount === 0) {
      console.log('🌱 Database is empty. Seeding initial demo data...');
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('✗ Unable to start server:', error.message);
    process.exit(1);
  }
};

startServer();
