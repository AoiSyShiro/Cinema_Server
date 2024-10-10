const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const open = require('open');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

dotenv.config();

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// Cấu hình multer với Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'movies', // Tên thư mục trong Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg'], // Định dạng cho phép
    },
});

const upload = multer({ storage });

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
const movieController = require('./controllers/movieController'); // Import movie controller

// Đăng ký các routes
app.use('/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/food-drinks', foodDrinkRoutes);

// Routes cho phim
app.get('/api/movies', movieController.getMovies);
app.post('/api/movies', upload.single('movieImage'), movieController.addMovie);
app.put('/api/movies/:id', upload.single('movieImage'), movieController.updateMovie);
app.delete('/api/movies/:id', movieController.deleteMovie);

// Route upload tệp hình ảnh (nếu cần)
app.post('/upload', upload.single('movieImage'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path); // Upload lên Cloudinary
        res.status(200).json({ url: result.secure_url });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tải lên', error: error.message });
    }
});

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
