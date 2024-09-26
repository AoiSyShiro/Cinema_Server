const mongoose = require('mongoose');

const PromotionSchema = new mongoose.Schema({
    code: { type: String, required: true },
    discount_percentage: { type: Number, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true }
});

module.exports = mongoose.model('Promotion', PromotionSchema);
