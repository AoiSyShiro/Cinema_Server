const express = require('express');
const { addMovie, updateMovie, deleteMovie, getMovies } = require('../controllers/movieController');
const router = express.Router();

router.post('/', addMovie);
router.put('/:id', updateMovie);
router.delete('/:id', deleteMovie);
router.get('/', getMovies);

module.exports = router;
