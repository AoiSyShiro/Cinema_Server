const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movie_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    rating: { type: Number, required: true },
    comment: String,
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', ReviewSchema);
