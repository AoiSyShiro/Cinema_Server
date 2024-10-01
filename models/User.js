const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true, default: 'user' },
    address: { type: String, default: null },  // Giá trị mặc định là null
    phone_number: { type: String, default: null },  // Giá trị mặc định là null
    favorite_movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }], // Danh sách phim yêu thích
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' }, // Giá trị mặc định là 'Other'
    last_login: { type: Date, default: null }, // Để last_login có giá trị mặc định
    created_at: { type: Date, default: Date.now } // Thời gian tạo tài khoản
});

// Xuất schema
module.exports = mongoose.model('User', UserSchema);
