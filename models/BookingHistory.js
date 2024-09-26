const mongoose = require('mongoose');

const BookingHistorySchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    date: { type: Date, required: true }
});

module.exports = mongoose.model('BookingHistory', BookingHistorySchema);
