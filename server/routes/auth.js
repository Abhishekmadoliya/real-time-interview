

const express = require('express');
const router = express.Router();
const User = require('../models/usermodel');
const authController = require('../controllers/authController');

// Login route
console.log(authController.login);

router.post('/login', authController.login);

// Signup route
router.post('/signup', authController.signup);

exports = router;
module.exports = router;