const FoodDrink = require('../models/FoodDrink');

// Thêm đồ ăn/drink
exports.addFoodDrink = async (req, res) => {
    const { name, type, price, description } = req.body;

    try {
        const newFoodDrink = new FoodDrink({
            name,
            type,
            price,
            description,
            created_at: new Date(),
            updated_at: new Date(),
        });

        await newFoodDrink.save();
        res.status(201).json({ message: 'Thêm đồ ăn/drink thành công', foodDrink: newFoodDrink });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi thêm đồ ăn/drink', error: err.message });
    }
};

// Cập nhật đồ ăn/drink
exports.updateFoodDrink = async (req, res) => {
    const { id } = req.params;
    const { name, type, price, description } = req.body;

    try {
        const updatedFoodDrink = await FoodDrink.findByIdAndUpdate(
            id,
            { name, type, price, description, updated_at: new Date() },
            { new: true }
        );

        if (!updatedFoodDrink) {
            return res.status(404).json({ message: 'Đồ ăn/drink không tồn tại' });
        }

        res.status(200).json({ message: 'Cập nhật đồ ăn/drink thành công', foodDrink: updatedFoodDrink });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi cập nhật đồ ăn/drink', error: err.message });
    }
};

// Xóa đồ ăn/drink
exports.deleteFoodDrink = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedFoodDrink = await FoodDrink.findByIdAndDelete(id);

        if (!deletedFoodDrink) {
            return res.status(404).json({ message: 'Đồ ăn/drink không tồn tại' });
        }

        res.status(200).json({ message: 'Xóa đồ ăn/drink thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi xóa đồ ăn/drink', error: err.message });
    }
};

// Lấy danh sách đồ ăn/drink
exports.getFoodDrinks = async (req, res) => {
    try {
        const foodDrinks = await FoodDrink.find();
        res.status(200).json(foodDrinks);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách đồ ăn/drink', error: err.message });
    }
};
