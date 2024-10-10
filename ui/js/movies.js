let movies = [];
let currentMovieId = null;

function displayMovies() {
    fetch('/api/movies')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(moviesData => {
            const movieList = document.getElementById('movie-list');
            movieList.innerHTML = '';

            moviesData.forEach(movie => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${movie._id}</td>
                    <td>${movie.title}</td>
                    <td>${movie.description}</td>
                    <td>${movie.category}</td>
                    <td>${new Date(movie.show_time).toLocaleString()}</td>
                    <td>${movie.duration} phút</td>
                    <td>${movie.rating}</td>
                    <td>${new Date(movie.release_date).toLocaleDateString()}</td>
                    <td>${movie.cast}</td>
                    <td><img src="${movie.image}" alt="${movie.title}" class="movie-image" style="width: 100px;" /></td>
                    <td>
                        <button class="btn btn-warning" onclick="openEditMovieModal('${movie._id}')">Sửa</button>
                        <button class="btn btn-danger" onclick="showDeleteMovieModal('${movie._id}')">Xóa</button>
                    </td>
                `;
                movieList.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Lỗi khi lấy danh sách phim:', error);
        });
}

function showAddMovieModal() {
    document.getElementById('movieModalLabel').innerText = 'Thêm Phim';
    document.getElementById('movieForm').reset();
    currentMovieId = null; // Reset ID
}

async function addOrUpdateMovie() {
    const movieForm = document.getElementById('movieForm');
    const formData = new FormData(movieForm);

    const method = currentMovieId ? 'PUT' : 'POST';
    const url = currentMovieId ? `/api/movies/${currentMovieId}` : '/api/movies';

    // Lưu ID phim vào formData
    if (currentMovieId) {
        formData.append('_id', currentMovieId);
    }

    try {
        const response = await fetch(url, { method, body: formData });
        if (!response.ok) throw new Error('Network response was not ok');
        await response.json();
        displayMovies();
        $('#movieModal').modal('hide');
    } catch (error) {
        console.error('Lỗi:', error);
    }
}

function showDeleteMovieModal(id) {
    currentMovieId = id;
    $('#deleteMovieModal').modal('show');
}

async function confirmDeleteMovie() {
    try {
        const response = await fetch(`/api/movies/${currentMovieId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Network response was not ok');
        await response.json();
        displayMovies();
        $('#deleteMovieModal').modal('hide');
    } catch (error) {
        console.error('Lỗi khi xóa phim:', error);
    }
}

async function openEditMovieModal(movieId) {
    currentMovieId = movieId; // Lưu ID phim đang chỉnh sửa

    // Gửi yêu cầu lấy danh sách phim
    const response = await fetch('/api/movies');
    if (!response.ok) {
        console.error('Không thể lấy danh sách phim:', response.statusText);
        return;
    }

    const movies = await response.json();

    // Tìm phim tương ứng từ danh sách
    const movie = movies.find(m => m._id === movieId);
    if (!movie) {
        console.error('Không tìm thấy phim với ID:', movieId);
        return;
    }

    // Cập nhật các trường trong form
    document.getElementById('editMovieId').value = movie._id;
    document.getElementById('editMovieTitle').value = movie.title;
    document.getElementById('editMovieDescription').value = movie.description;
    document.getElementById('editMovieCategory').value = movie.category;
    document.getElementById('editMovieShowTime').value = new Date(movie.show_time).toISOString().slice(0, 16);
    document.getElementById('editMovieDuration').value = movie.duration;
    document.getElementById('editMovieRating').value = movie.rating;
    document.getElementById('editMovieReleaseDate').value = movie.release_date;
    document.getElementById('editMovieCast').value = movie.cast;

    // Hiển thị modal bằng jQuery
    $('#editMovieModal').modal('show'); // Sử dụng jQuery để hiển thị modal
}


async function updateMovie() {
    const formData = new FormData(document.getElementById('editMovieForm'));

    try {
        const response = await fetch(`/api/movies/${currentMovieId}`, {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) {
            console.error('Cập nhật phim thất bại:', response.statusText);
            return;
        }

        displayMovies();
        const modal = bootstrap.Modal.getInstance(document.getElementById('editMovieModal'));
        modal.hide();
    } catch (error) {
        console.error('Lỗi cập nhật:', error);
    }
}

function initSampleData() {
    fetch('/api/movies')
        .then(response => response.json())
        .then(data => {
            movies = data;
            displayMovies();
        })
        .catch(error => {
            console.error('Lỗi khi khởi tạo dữ liệu:', error);
        });
}

window.onload = initSampleData;
