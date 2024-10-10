const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    show_time: { type: Date, required: true },
    duration: { type: Number, required: true },
    rating: { type: Number, required: true },
    release_date: { type: Date, required: true },
    cast: { type: String, required: true },
    image_url: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
