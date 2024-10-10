const express = require('express');
const router = express.Router();
const { addCategory, updateCategory, deleteCategory, getCategories } = require('../controllers/categoryController');
const multer = require('multer');
const storage = multer.memoryStorage(); // Lưu tệp vào bộ nhớ
const upload = multer({ storage: storage });

// Lấy danh sách thể loại
router.get('/', getCategories);

// Thêm thể loại
router.post('/', upload.single('image'), addCategory);

// Chỉnh sửa thể loại
router.put('/:id', upload.single('image'), updateCategory);

// Xóa thể loại
router.delete('/:id', deleteCategory);

module.exports = router;
