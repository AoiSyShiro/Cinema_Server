const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    trailer_url: String,
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    show_time: { type: Date, required: true },
    duration: { type: Number, required: true },
    rating: { type: Number, required: true },
    release_date: { type: Date, required: true },
    cast: [String],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date }
});

module.exports = mongoose.model('Movie', MovieSchema);
