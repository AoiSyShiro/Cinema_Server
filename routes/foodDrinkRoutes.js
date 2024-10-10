const express = require('express');
const router = express.Router();
const {
    addFoodDrink,
    updateFoodDrink,
    deleteFoodDrink,
    getFoodDrinks,
} = require('../controllers/FoodDrinkController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Lấy danh sách đồ ăn/đồ uống
router.get('/', getFoodDrinks);

// Thêm đồ ăn/đồ uống
router.post('/', upload.single('image'), addFoodDrink);

// Cập nhật đồ ăn/đồ uống
router.put('/:id', upload.single('image'), updateFoodDrink);

// Xóa đồ ăn/đồ uống
router.delete('/:id', deleteFoodDrink);

module.exports = router;
