const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movie_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    booking_time: { type: Date, default: Date.now },
    total_price: { type: Number, required: true },
    payment_method: { type: String, required: true },
    qr_code: String,
    status: String
});

module.exports = mongoose.model('Booking', BookingSchema);
