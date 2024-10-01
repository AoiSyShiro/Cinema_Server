const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Hàm xử lý đăng ký người dùng
exports.register = async (req, res) => {
    const { username, password, email, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            role,
            address: null,
            phone_number: null,
            favorite_movies: [],
            gender: 'Other'
        });

        await newUser.save();
        res.status(201).json({ message: 'Đăng ký thành công' });
    } catch (err) {
        console.error('Lỗi đăng ký:', err);
        res.status(500).json({ message: 'Lỗi đăng ký', error: err.message });
    }
};

// Hàm xử lý đăng nhập
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        res.status(200).json({
            user: {
                user_id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                address: user.address,
                phone_number: user.phone_number,
                gender: user.gender
            }
        });
    } catch (err) {
        console.error('Lỗi đăng nhập:', err);
        res.status(500).json({ message: 'Lỗi đăng nhập', error: err.message });
    }
};

// Lấy thông tin người dùng bằng email
exports.getProfile = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            address: user.address,
            phone_number: user.phone_number,
            gender: user.gender
        });
    } catch (err) {
        console.error('Lỗi lấy thông tin profile:', err);
        res.status(500).json({ message: 'Lỗi lấy thông tin profile', error: err.message });
    }
};

// Cập nhật thông tin người dùng
exports.updateProfile = async (req, res) => {
    const email = String(req.body.email).trim();
    const username = String(req.body.username).trim();
    const phone_number = req.body.phone_number ? String(req.body.phone_number).trim() : null;
    const gender = req.body.gender ? String(req.body.gender).trim() : 'Other';
    const address = req.body.address ? String(req.body.address).trim() : null;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        // Cập nhật tên người dùng
        user.username = username || user.username;

        // Cập nhật phone_number
        if (phone_number !== null) {
            user.phone_number = phone_number;
        }

        // Cập nhật gender nếu hợp lệ
        if (['Male', 'Female', 'Other'].includes(gender)) {
            user.gender = gender;
        }

        // Cập nhật address
        if (address !== null) {
            user.address = address;
        }

        // Lưu thay đổi vào cơ sở dữ liệu
        await user.save();

        res.status(200).json({
            message: 'Cập nhật thông tin thành công',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                address: user.address,
                phone_number: user.phone_number,
                gender: user.gender
            }
        });
    } catch (err) {
        console.error('Lỗi cập nhật thông tin profile:', err);
        res.status(500).json({ message: 'Lỗi cập nhật thông tin profile', error: err.message });
    }
};

// Cập nhật mật khẩu
exports.updatePassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Mật khẩu cũ không đúng' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: 'Cập nhật mật khẩu thành công' });
    } catch (err) {
        console.error('Lỗi cập nhật mật khẩu:', err);
        res.status(500).json({ message: 'Lỗi cập nhật mật khẩu', error: err.message });
    }
};
