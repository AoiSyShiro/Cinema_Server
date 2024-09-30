const mongoose = require('mongoose');

const ProfileInfoSchema = new mongoose.Schema({
    address: String,
    phone_number: String,
    favorite_movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' } // Thêm trường giới tính
});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true, default: 'user' },
    profile_info: ProfileInfoSchema,
    last_login: Date,
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
