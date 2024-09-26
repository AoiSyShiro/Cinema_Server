const express = require('express');
const { addFoodDrink, updateFoodDrink, deleteFoodDrink, getFoodDrinks } = require('../controllers/foodDrinkController');
const router = express.Router();

router.post('/', addFoodDrink);
router.put('/:id', updateFoodDrink);
router.delete('/:id', deleteFoodDrink);
router.get('/', getFoodDrinks);

module.exports = router;
