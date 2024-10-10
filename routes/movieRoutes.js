const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Lấy danh sách phim
router.get('/', movieController.getMovies);

// Thêm phim
router.post('/', upload.single('movieImage'), movieController.addMovie); // Chỉnh sửa đường dẫn thành '/' để khớp với router

// Cập nhật phim
router.put('/:id', upload.single('movieImage'), movieController.updateMovie);


// Xóa phim
router.delete('/:id', movieController.deleteMovie);

module.exports = router;
