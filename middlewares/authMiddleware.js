const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.replace('Bearer ', '');

    // Kiểm tra xem token có tồn tại không
    if (!token) {
        return res.status(403).json({ message: 'Token là bắt buộc để truy cập tài nguyên này.' });
    }

    // Xác thực token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Xử lý lỗi token không hợp lệ
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Token không hợp lệ.', error: err.message });
            }
            // Xử lý lỗi token đã hết hạn
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token đã hết hạn.', error: err.message });
            }
            // Các lỗi khác
            return res.status(500).json({ message: 'Lỗi server khi xác thực token.', error: err.message });
        }

        // Lưu thông tin giải mã vào req.user
        req.user = decoded;
        next(); // Chuyển sang middlewares tiếp theo
    });
};
