const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());

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
