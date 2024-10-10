const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const open = require('open');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

dotenv.config();

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const logRequestInfo = (req, res, next) => {
    const start = Date.now();
    const { method, path } = req;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    console.log('Thông tin yêu cầu:', method, path, ip, new Date().toISOString());

    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log('Trạng thái phản hồi:', res.statusCode, 'Thời gian xử lý (ms):', duration);
    });

    next();
};

app.use(logRequestInfo);

// Phục vụ file tĩnh từ thư mục ui
app.use(express.static(path.join(__dirname, 'ui')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

// Routes
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const foodDrinkRoutes = require('./routes/foodDrinkRoutes');
const movieRoutes = require('./routes/movieRoutes');

// Đăng ký các routes
app.use('/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/food-drinks', foodDrinkRoutes);
app.use('/api/movies', movieRoutes);


const PORT = process.env.PORT || 5000;

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Kết nối đến MongoDB thành công');

        app.listen(PORT, async () => {
            console.log(`Server đang chạy ở cổng ${PORT}`);
            await open(`http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Không thể kết nối đến MongoDB:', err.message);
        process.exit(1);
    }
};

connectToDatabase();
