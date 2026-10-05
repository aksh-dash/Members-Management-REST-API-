const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getDashboard, deleteStore } = require('../controllers/ownerController');

// All owner routes require authentication and store_owner role
router.use(authenticate, authorize('store_owner'));

router.get('/dashboard', getDashboard);
router.delete('/store', deleteStore);

module.exports = router;
