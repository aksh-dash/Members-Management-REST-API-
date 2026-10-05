const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User, Store, Rating, sequelize } = require('../models');

/**
 * Admin dashboard — returns aggregate counts.
 */
const getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.count(),
      Store.count(),
      Rating.count()
    ]);

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Add a new user (admin can assign any role).
 */
const addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const validRoles = ['admin', 'user', 'store_owner'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role: role || 'user'
    });

    res.status(201).json({
      message: 'User created successfully.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.errors.map(e => e.message)
      });
    }
    console.error('Add user error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * List users with optional filters and sorting.
 * Filters: name, email, address, role
 * Sorting: sortBy, sortOrder (asc/desc)
 */
const getUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy, sortOrder } = req.query;
    const where = {};

    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };
    if (role) where.role = role;

    const order = [];
    const allowedSortFields = ['name', 'email', 'address', 'role', 'created_at'];
    if (sortBy && allowedSortFields.includes(sortBy)) {
      order.push([sortBy, sortOrder === 'desc' ? 'DESC' : 'ASC']);
    } else {
      order.push(['created_at', 'DESC']);
    }

    const users = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      order
    });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Get a single user's details by ID.
 * If the user is a store_owner, their store's rating is included.
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const result = user.toJSON();

    // If store owner, include their store's average rating
    if (user.role === 'store_owner') {
      const stores = await Store.findAll({
        where: { owner_id: user.id }
      });

      if (stores.length > 0) {
        const storeData = [];
        for (const store of stores) {
          const ratingResult = await Rating.findAll({
            where: { store_id: store.id },
            attributes: [
              [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
              [sequelize.fn('COUNT', sequelize.col('id')), 'totalRatings']
            ]
          });

          storeData.push({
            id: store.id,
            name: store.name,
            averageRating: ratingResult[0].getDataValue('averageRating')
              ? parseFloat(parseFloat(ratingResult[0].getDataValue('averageRating')).toFixed(1))
              : 0,
            totalRatings: parseInt(ratingResult[0].getDataValue('totalRatings')) || 0
          });
        }
        result.stores = storeData;
      }
    }

    res.json(result);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Add a new store.
 */
const addStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    const existingStore = await Store.findOne({ where: { email } });
    if (existingStore) {
      return res.status(400).json({ message: 'Store email already registered.' });
    }

    // If owner_id is provided, verify user exists
    if (owner_id) {
      const owner = await User.findByPk(owner_id);
      if (!owner) {
        return res.status(400).json({ message: 'Owner user not found.' });
      }
      // Update user role to store_owner if not already
      if (owner.role !== 'store_owner' && owner.role !== 'admin') {
        await owner.update({ role: 'store_owner' });
      }
    }

    const store = await Store.create({ name, email, address, owner_id: owner_id || null });

    res.status(201).json({
      message: 'Store created successfully.',
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        owner_id: store.owner_id
      }
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.errors.map(e => e.message)
      });
    }
    console.error('Add store error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * List stores with filters, sorting, and aggregate ratings.
 */
const getStores = async (req, res) => {
  try {
    const { name, email, address, sortBy, sortOrder } = req.query;
    const where = {};

    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    // Fetch stores first without aggregation to avoid GROUP BY issues with sorting
    const stores = await Store.findAll({ where });

    const result = [];
    for (const store of stores) {
      const ratingResult = await Rating.findAll({
        where: { store_id: store.id },
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'totalRatings']
        ]
      });

      result.push({
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        owner_id: store.owner_id,
        created_at: store.created_at,
        averageRating: ratingResult[0].getDataValue('averageRating')
          ? parseFloat(parseFloat(ratingResult[0].getDataValue('averageRating')).toFixed(1))
          : 0,
        totalRatings: parseInt(ratingResult[0].getDataValue('totalRatings')) || 0
      });
    }

    // Sort in JS to handle both regular and computed fields
    const allowedSortFields = ['name', 'email', 'address', 'averageRating', 'created_at'];
    if (sortBy && allowedSortFields.includes(sortBy)) {
      const dir = sortOrder === 'desc' ? -1 : 1;
      result.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (typeof aVal === 'string') return dir * aVal.localeCompare(bVal);
        return dir * (aVal - bVal);
      });
    } else {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    res.json(result);
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Delete a user by ID.
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    await user.destroy();
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * Delete a store by ID.
 */
const deleteStore = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found.' });
    }
    await store.destroy();
    res.json({ message: 'Store deleted successfully.' });
  } catch (error) {
    console.error('Delete store error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { getDashboard, addUser, getUsers, getUserById, addStore, getStores, deleteUser, deleteStore };
