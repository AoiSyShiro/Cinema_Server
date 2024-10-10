const Movie = require('../models/Movie');

// Lấy danh sách phim
const getMovies = async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách phim:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách phim', error });
    }
};

// Thêm phim
const addMovie = async (req, res) => {
    try {
        const movieData = {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            show_time: req.body.show_time,
            duration: req.body.duration,
            rating: req.body.rating,
            release_date: req.body.release_date,
            cast: req.body.cast,
            image: req.file ? req.file.path : null // Đường dẫn đến hình ảnh
        };
        const movie = new Movie(movieData);
        await movie.save();
        res.status(201).json(movie);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm phim', error: error.message });
    }
};

// Cập nhật phim
const updateMovie = async (req, res) => {
    try {
        const movieData = {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            show_time: req.body.show_time,
            duration: req.body.duration,
            rating: req.body.rating,
            release_date: req.body.release_date,
            cast: req.body.cast,
            image: req.file ? req.file.path : null // Cập nhật hình ảnh nếu có
        };
        const movie = await Movie.findByIdAndUpdate(req.params.id, movieData, { new: true });
        if (!movie) {
            return res.status(404).json({ message: 'Không tìm thấy phim' });
        }
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật phim', error: error.message });
    }
};

// Xóa phim
const deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Không tìm thấy phim để xóa' });
        }
        res.json({ message: 'Xóa phim thành công!' });
    } catch (error) {
        console.error('Lỗi khi xóa phim:', error);
        res.status(500).json({ message: 'Lỗi khi xóa phim', error });
    }
};

module.exports = {
    getMovies,
    addMovie,
    updateMovie,
    deleteMovie,
};
