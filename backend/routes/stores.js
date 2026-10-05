const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getStores, submitRating } = require('../controllers/storeController');

// All store routes require authentication and user role
router.use(authenticate, authorize('user'));

router.get('/', getStores);
router.post('/:id/rate', submitRating);

module.exports = router;
