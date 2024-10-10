const FoodDrink = require('../models/FoodDrink');
const cloudinary = require('cloudinary').v2;

// Lấy danh sách đồ ăn/đồ uống
const getFoodDrinks = async (req, res) => {
    try {
        const foodDrinks = await FoodDrink.find();
        res.json(foodDrinks);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách đồ ăn/đồ uống:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách đồ ăn/đồ uống', error });
    }
};

// Thêm đồ ăn/đồ uống
const addFoodDrink = async (req, res) => {
    try {
        const { name, type, price } = req.body;

        const foodDrink = new FoodDrink({
            name,
            type,
            price,
        });

        // Nếu có hình ảnh được tải lên
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                });
                stream.end(req.file.buffer);
            });
            foodDrink.image = result.secure_url;  // Lưu URL hình ảnh
        }

        await foodDrink.save();
        res.status(201).json({ message: 'Thêm đồ ăn/đồ uống thành công!', foodDrink });
    } catch (error) {
        console.error('Lỗi khi thêm đồ ăn/đồ uống:', error);
        res.status(500).json({ message: 'Lỗi khi thêm đồ ăn/đồ uống', error });
    }
};

// Cập nhật đồ ăn/đồ uống
const updateFoodDrink = async (req, res) => {
    try {
        const foodDrink = await FoodDrink.findById(req.params.id);
        if (!foodDrink) {
            return res.status(404).json({ message: 'Không tìm thấy đồ ăn/đồ uống' });
        }

        // Cập nhật thông tin
        foodDrink.name = req.body.name || foodDrink.name;
        foodDrink.type = req.body.type || foodDrink.type;
        foodDrink.price = req.body.price || foodDrink.price;

        // Nếu có hình ảnh mới được tải lên
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                });
                stream.end(req.file.buffer);
            });
            foodDrink.image = result.secure_url;  // Cập nhật URL hình ảnh
        }

        foodDrink.updated_at = Date.now();
        await foodDrink.save();
        res.json({ message: 'Chỉnh sửa đồ ăn/đồ uống thành công!', foodDrink });
    } catch (error) {
        console.error('Lỗi khi chỉnh sửa đồ ăn/đồ uống:', error);
        res.status(500).json({ message: 'Lỗi khi chỉnh sửa đồ ăn/đồ uống', error });
    }
};

// Xóa đồ ăn/đồ uống
const deleteFoodDrink = async (req, res) => {
    try {
        const foodDrink = await FoodDrink.findByIdAndDelete(req.params.id);
        if (!foodDrink) {
            return res.status(404).json({ message: 'Không tìm thấy đồ ăn/đồ uống để xóa' });
        }
        res.json({ message: 'Xóa đồ ăn/đồ uống thành công!' });
    } catch (error) {
        console.error('Lỗi khi xóa đồ ăn/đồ uống:', error);
        res.status(500).json({ message: 'Lỗi khi xóa đồ ăn/đồ uống', error });
    }
};

module.exports = {
    getFoodDrinks,
    addFoodDrink,
    updateFoodDrink,
    deleteFoodDrink,
};