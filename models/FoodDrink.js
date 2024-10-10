const mongoose = require('mongoose');

const FoodDrinkSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    image: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date }
});

module.exports = mongoose.model('FoodDrink', FoodDrinkSchema);
