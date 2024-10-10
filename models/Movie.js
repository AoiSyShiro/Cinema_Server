const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    show_time: { type: Date },
    duration: { type: Number },
    rating: { type: Number },
    release_date: { type: Date },
    cast: { type: String },
    image: { type: String } // Đường dẫn hình ảnh
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
