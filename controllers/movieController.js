const Movie = require('../models/Movie');

// Thêm phim
exports.addMovie = async (req, res) => {
    const { title, description, trailer_url, category_id, show_time, duration, rating, release_date, cast } = req.body;

    try {
        const newMovie = new Movie({
            title,
            description,
            trailer_url,
            category_id,
            show_time,
            duration,
            rating,
            release_date,
            cast,
            created_at: new Date(),
            updated_at: new Date(),
        });

        await newMovie.save();
        res.status(201).json({ message: 'Thêm phim thành công', movie: newMovie });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi thêm phim', error: err.message });
    }
};

// Cập nhật phim
exports.updateMovie = async (req, res) => {
    const { id } = req.params;
    const { title, description, trailer_url, category_id, show_time, duration, rating, release_date, cast } = req.body;

    try {
        const updatedMovie = await Movie.findByIdAndUpdate(
            id,
            {
                title,
                description,
                trailer_url,
                category_id,
                show_time,
                duration,
                rating,
                release_date,
                cast,
                updated_at: new Date(),
            },
            { new: true }
        );

        if (!updatedMovie) {
            return res.status(404).json({ message: 'Phim không tồn tại' });
        }

        res.status(200).json({ message: 'Cập nhật phim thành công', movie: updatedMovie });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi cập nhật phim', error: err.message });
    }
};

// Xóa phim
exports.deleteMovie = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedMovie = await Movie.findByIdAndDelete(id);

        if (!deletedMovie) {
            return res.status(404).json({ message: 'Phim không tồn tại' });
        }

        res.status(200).json({ message: 'Xóa phim thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi xóa phim', error: err.message });
    }
};

// Lấy danh sách phim
exports.getMovies = async (req, res) => {
    try {
        const movies = await Movie.find().populate('category_id', 'name'); // Thêm thông tin thể loại vào danh sách phim
        res.status(200).json(movies);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách phim', error: err.message });
    }
};
