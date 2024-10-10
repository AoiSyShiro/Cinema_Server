const Category = require('../models/Category');
const cloudinary = require('cloudinary').v2;

// Lấy danh sách thể loại
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy danh sách thể loại', error });
    }
};

// Thêm thể loại
const addCategory = async (req, res) => {
    const { name, description } = req.body;
    let imageUrl;

    try {
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                });
                stream.end(req.file.buffer);
            });
            imageUrl = result.secure_url;
        }

        const newCategory = new Category({
            name,
            description,
            image: imageUrl,
        });

        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Có lỗi xảy ra!', error });
    }
};

const updateCategory = async (req, res) => {
    try {
        console.log('Request body:', req.body); // Xem nội dung req.body
        console.log('Request file:', req.file);   // Xem nội dung req.file

        // Tìm thể loại theo ID
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Không tìm thấy thể loại' });
        }

        // Cập nhật thông tin thể loại
        category.name = req.body.name || category.name;
        category.description = req.body.description || category.description;

        // Cập nhật hình ảnh nếu có
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                });
                stream.end(req.file.buffer);
            });
            category.image = result.secure_url; // Cập nhật đường dẫn hình ảnh
        }

        // Cập nhật thời gian chỉnh sửa
        category.updated_at = Date.now();

        // Lưu thể loại vào cơ sở dữ liệu
        await category.save();

        // Trả về thông báo thành công và thể loại đã cập nhật
        res.json({ message: 'Chỉnh sửa thể loại thành công!', category });
    } catch (error) {
        console.error('Error during update:', error); // In lỗi ra console
        res.status(500).json({ message: 'Lỗi khi chỉnh sửa thể loại', error });
    }
};



// Xóa thể loại
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Không tìm thấy thể loại để xóa' });
        }
        res.json({ message: 'Xóa thể loại thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa thể loại', error });
    }
};

module.exports = {
    addCategory,
    updateCategory,
    deleteCategory,
    getCategories,
};
