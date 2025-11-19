// src/routes/admin.routes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const auth = require('../middleware/auth.middleware');

// Public routes
router.post('/login', adminController.login);
router.post('/forgot-password', adminController.forgotPassword);
router.post('/reset-password/:token', adminController.resetPassword);

// Protected routes (require admin authentication)
router.get('/admins', auth, adminController.getAdmins);
router.post('/admins', auth, adminController.createAdmin);
router.put('/admins/:id', auth, adminController.updateAdmin);
router.delete('/admins/:id', auth, adminController.deleteAdmin);

module.exports = router;