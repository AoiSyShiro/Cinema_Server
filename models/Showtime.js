const mongoose = require('mongoose');

const ShowtimeSchema = new mongoose.Schema({
    movie_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    start_time: { type: Date, required: true },
    room: { type: String, required: true }
});

module.exports = mongoose.model('Showtime', ShowtimeSchema);
