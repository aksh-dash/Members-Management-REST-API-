const express = require('express');
const router = express.Router();
const { register, login, changePassword } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validateRegistration, validatePassword } = require('../middleware/validate');

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', login);

// Protected routes
router.put('/password', authenticate, validatePassword, changePassword);

module.exports = router;
