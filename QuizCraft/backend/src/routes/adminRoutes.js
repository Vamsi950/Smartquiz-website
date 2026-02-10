const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

// Protected admin routes - only admins can access
router.get('/users', protect, isAdmin, adminController.getAllUsers);
router.delete('/users/:id', protect, isAdmin, adminController.deleteUser);
router.get('/user-results', protect, isAdmin, adminController.getUserResults);

module.exports = router;
