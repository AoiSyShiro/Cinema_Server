const Booking = require('../models/Booking');
const User = require('../models/User');
const Movie = require('../models/Movie');

// Tạo đơn đặt vé
exports.createBooking = async (req, res) => {
    const { movie_id, total_price, payment_method } = req.body;
    const userId = req.user.userId; // Giả định bạn đã xác thực người dùng

    try {
        // Kiểm tra xem phim có tồn tại không
        const movie = await Movie.findById(movie_id);
        if (!movie) {
            return res.status(404).json({ message: 'Phim không tồn tại' });
        }

        // Tạo đơn đặt vé
        const newBooking = new Booking({
            user_id: userId,
            movie_id,
            booking_time: new Date(),
            total_price,
            payment_method,
            status: 'Đã đặt',
        });

        await newBooking.save();

        res.status(201).json({ message: 'Đặt vé thành công', booking: newBooking });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi đặt vé', error: err.message });
    }
};

// Lấy lịch sử đặt vé
exports.getBookingHistory = async (req, res) => {
    const userId = req.user.userId; // Giả định bạn đã xác thực người dùng

    try {
        const bookings = await Booking.find({ user_id: userId }).populate('movie_id', 'title description'); // Thêm thông tin phim vào lịch sử
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi lấy lịch sử đặt vé', error: err.message });
    }
};
