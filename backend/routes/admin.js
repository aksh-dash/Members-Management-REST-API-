const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { validateRegistration, validateStore } = require('../middleware/validate');
const {
  getDashboard,
  addUser,
  getUsers,
  getUserById,
  deleteUser,
  addStore,
  getStores,
  deleteStore
} = require('../controllers/adminController');

// All admin routes require authentication and admin role
router.use(authenticate, authorize('admin'));

router.get('/dashboard', getDashboard);
router.post('/users', validateRegistration, addUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);
router.post('/stores', validateStore, addStore);
router.get('/stores', getStores);
router.delete('/stores/:id', deleteStore);

module.exports = router;
