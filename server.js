const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Middleware để log thông tin yêu cầu
const logRequestInfo = (req, res, next) => {
    console.log('Thông tin yêu cầu:');
    console.log('Phương thức:', req.method);
    console.log('Đường dẫn:', req.path);
    console.log('Thân yêu cầu:', req.body);
    next(); // Chuyển đến middleware tiếp theo hoặc route handler
};

// Sử dụng middleware
app.use(logRequestInfo);

const authRoutes = require('./routes/authRoutes'); // Adjust path as necessary
const categoryRoutes = require('./routes/categoryRoutes');
const movieRoutes = require('./routes/movieRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const foodDrinkRoutes = require('./routes/foodDrinkRoutes');
const reportRoutes = require('./routes/reportRoutes');

app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/movies', movieRoutes);
app.use('/bookings', bookingRoutes);
app.use('/fooddrinks', foodDrinkRoutes);
app.use('/reports', reportRoutes);

const PORT = process.env.PORT || 5000;

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Kết nối đến MongoDB thành công');
        app.listen(PORT, () => console.log(`Server đang chạy ở cổng ${PORT}`));
    } catch (err) {
        console.error('Không thể kết nối đến MongoDB:', err.message);
        process.exit(1);
    }
};

connectToDatabase();
