const Movie = require('../models/Movie');
const cloudinary = require('cloudinary').v2;

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
        let imageUrl;

        if (req.file) {
            imageUrl = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
                    if (error) {
                        console.error('Lỗi khi upload hình ảnh:', error);
                        return reject('Lỗi khi upload hình ảnh.');
                    }
                    resolve(result.secure_url);
                });

                stream.end(req.file.buffer);
            });
        }

        console.log('Dữ liệu phim:', req.body); // In ra dữ liệu nhận được

        const newMovie = new Movie({ ...req.body, image_url: imageUrl });
        await newMovie.save();
        res.status(201).json(newMovie);
    } catch (error) {
        console.error('Lỗi khi thêm phim:', error); // In ra lỗi
        res.status(400).json({ message: 'Có lỗi xảy ra khi thêm phim.', error: error.message });
    }
};

// Sửa phim
const updateMovie = async (req, res) => {
    const { id } = req.params;
    let imageUrl;

    try {
        const movie = await Movie.findById(id);

        // Nếu có file hình ảnh mới, upload lên Cloudinary
        if (req.file) {
            imageUrl = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
                    if (error) {
                        console.error('Lỗi khi upload hình ảnh:', error);
                        return reject('Lỗi khi upload hình ảnh.');
                    }
                    resolve(result.secure_url); // URL hình ảnh mới
                });

                stream.end(req.file.buffer);
            });
        } else {
            imageUrl = movie.image_url; // Giữ nguyên URL cũ nếu không có hình mới
        }

        const updatedMovie = await Movie.findByIdAndUpdate(id, { ...req.body, image_url: imageUrl }, { new: true });
        if (!updatedMovie) {
            return res.status(404).json({ message: 'Không tìm thấy phim.' });
        }
        res.json(updatedMovie);
    } catch (error) {
        res.status(400).json({ message: 'Có lỗi xảy ra khi cập nhật phim.' });
    }
};

// Xóa phim
const deleteMovie = async (req, res) => {
    const { id } = req.params;

    try {
        const movie = await Movie.findByIdAndDelete(id);
        if (!movie) {
            return res.status(404).json({ message: 'Không tìm thấy phim.' });
        }
        res.status(200).json({ message: 'Xóa phim thành công' });
    } catch (error) {
        console.error('Có lỗi xảy ra khi xóa phim:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra' });
    }
};

module.exports = {
    getMovies,
    addMovie,
    updateMovie,
    deleteMovie,
};
