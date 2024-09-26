const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    seat_number: { type: String, required: true },
    is_booked: { type: Boolean, default: false },
    movie_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
});

module.exports = mongoose.model('Seat', seatSchema);
