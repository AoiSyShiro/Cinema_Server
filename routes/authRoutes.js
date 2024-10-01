const express = require('express');
const {
    register,
    login,
    updatePassword,
    getProfile,
    updateProfile
} = require('../controllers/authController');
const router = express.Router();

// Đăng ký người dùng
router.post('/register', register);

// Đăng nhập người dùng
router.post('/login', login);

// Route lấy thông tin người dùng
router.post('/get-profile', getProfile);

// Route cập nhật thông tin người dùng
router.put('/update-profile', updateProfile);

// Route cập nhật mật khẩu
router.put('/update-password', updatePassword);

module.exports = router;
