const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const movieRoutes = require('./routes/movieRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const foodDrinkRoutes = require('./routes/foodDrinkRoutes');
const reportRoutes = require('./routes/reportRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/food-drinks', foodDrinkRoutes);
app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 5000;

const connectToDatabase = async () => {
    try {

        //test
        // dòng không hiển thị MONGO_URI
        // console.log('MONGO_URI:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Kết nối đến MongoDB thành công');
        app.listen(PORT, () => console.log(`Server đang chạy ở cổng ${PORT}`));
    } catch (err) {
        console.error('Không thể kết nối đến MongoDB:', err.message);
        process.exit(1);
    }
};

connectToDatabase();
