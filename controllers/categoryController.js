const Category = require('../models/Category');

// Thêm thể loại
exports.addCategory = async (req, res) => {
    const { name, description } = req.body;

    try {
        const newCategory = new Category({
            name,
            description,
            created_at: new Date(),
            updated_at: new Date(),
        });

        await newCategory.save();
        res.status(201).json({ message: 'Thêm thể loại thành công', category: newCategory });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi thêm thể loại', error: err.message });
    }
};

// Cập nhật thể loại
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name, description, updated_at: new Date() },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Thể loại không tồn tại' });
        }

        res.status(200).json({ message: 'Cập nhật thể loại thành công', category: updatedCategory });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi cập nhật thể loại', error: err.message });
    }
};

// Xóa thể loại
exports.deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Thể loại không tồn tại' });
        }

        res.status(200).json({ message: 'Xóa thể loại thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi xóa thể loại', error: err.message });
    }
};

// Lấy danh sách thể loại
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách thể loại', error: err.message });
    }
};
