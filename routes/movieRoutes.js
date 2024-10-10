const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const multer = require('multer');

// Cấu hình Multer với bộ nhớ tạm
const upload = multer({ storage: multer.memoryStorage() });

// Lấy danh sách phim
router.get('/', movieController.getMovies);

// Thêm phim
router.post('/', upload.single('image'), movieController.addMovie);

// Cập nhật phim
router.put('/:id', upload.single('image'), movieController.updateMovie);

// Xóa phim
router.delete('/:id', movieController.deleteMovie);

module.exports = router;
