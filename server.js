const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path'); // Đảm bảo đã import thư viện path
const open = require('open'); // Import package open
const cloudinary = require('cloudinary').v2;

//Cloudinary Lưu Ảnh
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Middleware để log thông tin yêu cầu
const logRequestInfo = (req, res, next) => {
    const start = Date.now(); // Lưu thời gian bắt đầu
    const {method, path} = req; // Lấy phương thức và đường dẫn từ yêu cầu
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress; // Lấy địa chỉ IP

    // Ghi thông tin yêu cầu
    console.log('Thông tin yêu cầu:');
    console.log('Phương thức:', method);
    console.log('Đường dẫn:', path);
    console.log('IP:', ip);
    console.log('Thời gian yêu cầu:', new Date().toISOString());

    // Khi phản hồi đã hoàn tất, ghi thông tin phản hồi
    res.on('finish', () => {
        const duration = Date.now() - start; // Tính thời gian xử lý
        console.log('Trạng thái phản hồi:', res.statusCode);
        console.log('Thời gian xử lý (ms):', duration);
    });

    next(); // Chuyển đến middleware tiếp theo hoặc route handler
};


// Sử dụng middleware
app.use(logRequestInfo);


// Thêm middleware để phục vụ các file tĩnh
app.use(express.static(path.join(__dirname, 'ui'))); // Sử dụng thư mục ui để phục vụ file tĩnh

// Route để mở file index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'ui', 'index.html')); // Đường dẫn đến file index.html
});

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

        app.listen(PORT, async () => {
            console.log(`Server đang chạy ở cổng ${PORT}`);
            // Mở trình duyệt đến trang chính
            await open(`http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Không thể kết nối đến MongoDB:', err.message);
        process.exit(1);
    }
};

connectToDatabase();

