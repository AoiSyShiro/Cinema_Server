const express = require('express');
const { register, login, changePassword, getProfile } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/change-password', changePassword);
router.get('/profile', getProfile);

module.exports = router;
