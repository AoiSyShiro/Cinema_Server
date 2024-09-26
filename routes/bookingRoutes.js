const express = require('express');
const { createBooking, getBookingHistory } = require('../controllers/bookingController');
const router = express.Router();

router.post('/', createBooking);
router.get('/history', getBookingHistory);

module.exports = router;
