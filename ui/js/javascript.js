function showContent(section) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(sec => sec.classList.remove('active'));
    document.getElementById(section).classList.add('active');
}

function showAddGenreModal() {
    const modal = new bootstrap.Modal(document.getElementById('genreModal'));
    modal.show();
}

function closeModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('genreModal'));
    if (modal) {
        modal.hide();
    }
}

let categories = []; // Khai báo biến để lưu danh sách thể loại toàn cục

async function loadCategories() {
    const response = await fetch('/api/categories');
    categories = await response.json();
    const categoryList = document.getElementById('category-list');
    categoryList.innerHTML = '';
    categories.forEach(category => {
        // Định dạng ngày tháng và giờ (ví dụ: 19/03/2023 10:56:32)
        const formattedDateTime = new Date(category.created_at).toLocaleString('vi-VN');

        categoryList.innerHTML += `
      <tr>
        <td>${category._id}</td>
        <td>${category.name}</td>
        <td>${category.description}</td>
        <td><img src="${category.image}" alt="${category.name}" width="100"></td>
        <td>${formattedDateTime}</td> <td
          <button class="btn btn-sm btn-primary" onclick="openEditModal('${category._id}')">Sửa</button>
          <button class="btn btn-sm btn-danger" onclick="deleteGenre('${category._id}')">Xóa</button>
        </td>
      </tr>
    `;
    });
}

async function addGenre() {
    const name = document.getElementById('genreName').value;
    const description = document.getElementById('genreDescription').value;
    const imageFile = document.getElementById('genreImage').files[0];

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (imageFile) {
        formData.append('image', imageFile);
    }

    const response = await fetch('/api/categories', {
        method: 'POST',
        body: formData,
    });

    if (response.ok) {
        const newCategory = await response.json();
        loadCategories();
        closeModal();
    } else {
        alert('Có lỗi xảy ra khi thêm thể loại.');
    }
    if (req.file) {
        const result = await cloudinary.uploader.upload_stream(req.file.buffer); // Sử dụng upload_stream
        imageUrl = result.secure_url;
    }

}


let currentCategoryId = null; // Biến toàn cục để lưu ID của thể loại đang chỉnh sửa

// Hàm mở modal chỉnh sửa thể loại
function openEditModal(categoryId) {
    const category = categories.find(c => c._id === categoryId);
    if (category) {
        document.getElementById('editGenreName').value = category.name;
        document.getElementById('editGenreDescription').value = category.description;
        document.getElementById('editGenreImage').value = ''; // Reset input file
        currentCategoryId = categoryId; // Lưu ID để sử dụng khi lưu
        const editModal = new bootstrap.Modal(document.getElementById('editGenreModal'));
        editModal.show();
    } else {
        alert('Không tìm thấy thể loại.');
    }
}

// Hàm lưu thể loại đã chỉnh sửa
async function saveEditedGenre() {
    const categoryName = document.getElementById('editGenreName').value;
    const categoryDescription = document.getElementById('editGenreDescription').value;
    const imageFile = document.getElementById('editGenreImage').files[0];

    const formData = new FormData();
    formData.append('name', categoryName);
    formData.append('description', categoryDescription);
    if (imageFile) {
        formData.append('image', imageFile);
    }

    const response = await fetch(`/api/categories/${currentCategoryId}`, {
        method: 'PUT',
        body: formData,
    });

    if (response.ok) {
        loadCategories(); // Tải lại danh sách thể loại
        closeEditModal(); // Đóng modal
    } else {
        alert('Có lỗi xảy ra khi chỉnh sửa thể loại.');
    }
}

// Hàm đóng modal chỉnh sửa
function closeEditModal() {
    const editModal = bootstrap.Modal.getInstance(document.getElementById('editGenreModal'));
    if (editModal) {
        editModal.hide();
    }
}


async function deleteGenre(id) {
    const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        loadCategories();
    } else {
        alert('Có lỗi xảy ra khi xóa thể loại.');
    }
}

// Gọi loadCategories khi trang được tải
document.addEventListener('DOMContentLoaded', loadCategories);


//FOOD
let currentFoodId = null; // Biến để lưu ID món ăn/đồ uống đang chỉnh sửa

// Hàm tải danh sách món ăn/đồ uống
async function loadFoodDrinks() {
    try {
        const response = await fetch('/api/food-drinks');
        if (!response.ok) {
            throw new Error('Có lỗi xảy ra khi tải danh sách món ăn/đồ uống');
        }
        foodDrinks = await response.json();
        renderFoodList(foodDrinks);
    } catch (error) {
        console.error('Có lỗi xảy ra:', error);
    }
}

// Hàm hiển thị danh sách món ăn/đồ uống
function renderFoodList(foodDrinks) {
    const foodList = document.getElementById('food-list');
    foodList.innerHTML = '';

    foodDrinks.forEach(food => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${food._id}</td>
            <td>${food.name}</td>
            <td>${food.type}</td>
            <td>${food.price}</td>
            <td><img src="${food.image || '/path/to/default/image.jpg'}" alt="${food.name}" width="100"></td>
            <td>
                <button class="btn btn-info" onclick="openEditFoodModal('${food._id}')">Sửa</button>
                <button class="btn btn-danger" onclick="deleteFoodDrink('${food._id}')">Xóa</button>
            </td>
        `;
        foodList.appendChild(row);
    });
}

// Hàm mở modal thêm món ăn/đồ uống
function showAddFoodModal() {
    document.getElementById('foodModalTitle').innerText = 'Thêm Đồ ăn/Đồ uống';
    document.getElementById('tenDoAn').value = '';
    document.getElementById('loaiDoAn').value = 'Đồ ăn';
    document.getElementById('giaDoAn').value = '';
    document.getElementById('imageDoAn').value = ''; // Reset file input
    const modal = new bootstrap.Modal(document.getElementById('foodModal'));
    modal.show();
}

// Hàm thêm món ăn/đồ uống
async function themDoAn() {
    const name = document.getElementById('tenDoAn').value;
    const type = document.getElementById('loaiDoAn').value;
    const price = document.getElementById('giaDoAn').value;
    const imageFile = document.getElementById('imageDoAn').files[0];

    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    formData.append('price', price);
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        const response = await fetch('/api/food-drinks', {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();
        console.log(result);
        loadFoodDrinks(); // Tải lại danh sách sau khi thêm
        closeFoodModal();
    } catch (error) {
        console.error('Có lỗi xảy ra khi thêm đồ ăn/đồ uống:', error);
    }
}

// Hàm mở modal chỉnh sửa món ăn/đồ uống
async function openEditFoodModal(foodId) {
    currentFoodId = foodId; // Lưu ID món đang chỉnh sửa

    // Tìm món ăn tương ứng từ danh sách
    const food = foodDrinks.find(f => f._id === foodId);

    if (food) {
        // Hiển thị thông tin món ăn trong modal
        document.getElementById('editFoodName').value = food.name;
        document.getElementById('editFoodType').value = food.type;
        document.getElementById('editFoodPrice').value = food.price;

        const modal = new bootstrap.Modal(document.getElementById('editFoodModal'));
        modal.show(); // Hiển thị modal
    } else {
        console.error('Không tìm thấy món ăn với ID:', foodId);
        alert('Không tìm thấy món ăn. Vui lòng thử lại.'); // Thông báo cho người dùng
    }
}
// Hàm cập nhật món ăn/đồ uống
async function updateFoodDrink(foodId) {
    const name = document.getElementById('editFoodName').value;
    const type = document.getElementById('editFoodType').value;
    const price = document.getElementById('editFoodPrice').value;
    const imageFile = document.getElementById('editFoodImage').files[0];

    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    formData.append('price', price);
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        const response = await fetch(`/api/food-drinks/${foodId}`, {
            method: 'PUT',
            body: formData,
        });
        const result = await response.json();
        console.log(result);
        loadFoodDrinks(); // Tải lại danh sách sau khi cập nhật
        closeFoodModal();
    } catch (error) {
        console.error('Có lỗi xảy ra khi cập nhật đồ ăn/đồ uống:', error);
    }
}

// Hàm xóa món ăn/đồ uống
async function deleteFoodDrink(foodId) {
    if (confirm('Bạn có chắc chắn muốn xóa món ăn/đồ uống này không?')) {
        try {
            const response = await fetch(`/api/food-drinks/${foodId}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            console.log(result);
            loadFoodDrinks(); // Tải lại danh sách sau khi xóa
        } catch (error) {
            console.error('Có lỗi xảy ra khi xóa đồ ăn/đồ uống:', error);
        }
    }
}

// Hàm đóng modal
function closeFoodModal() {
    const modalAdd = bootstrap.Modal.getInstance(document.getElementById('foodModal'));
    const modalEdit = bootstrap.Modal.getInstance(document.getElementById('editFoodModal'));
    if (modalAdd) modalAdd.hide();
    if (modalEdit) modalEdit.hide();
}

// Tải danh sách đồ ăn/đồ uống khi trang được tải
document.addEventListener('DOMContentLoaded', loadFoodDrinks);


//movie

let movies = [];

// Hàm tải danh sách phim
async function loadMovies() {
    try {
        const response = await fetch('/api/movies');
        if (!response.ok) {
            throw new Error('Có lỗi xảy ra khi tải danh sách phim');
        }
        movies = await response.json(); // Lưu danh sách phim vào biến movies
        renderMovieList(movies);
    } catch (error) {
        console.error('Có lỗi xảy ra:', error);
    }
}

// Hàm hiển thị danh sách phim
function renderMovieList(moviesList) {
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = '';

    moviesList.forEach(movie => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${movie._id}</td>
            <td>${movie.title}</td>
            <td>${movie.category_id}</td>
            <td>${movie.show_time ? new Date(movie.show_time).toLocaleString() : ''}</td>
            <td>${movie.duration} phút</td>
            <td>${movie.rating}</td>
            <td>${movie.release_date ? new Date(movie.release_date).toLocaleDateString() : ''}</td>
            <td>${movie.cast}</td>
            <td>${movie.description}</td>
            <td><img src="${movie.image_url || '/path/to/default/image.jpg'}" alt="${movie.title}" width="100"></td>
            <td>
                <button class="btn btn-info" onclick="openEditMovieModal('${movie._id}')">Sửa</button>
                <button class="btn btn-danger" onclick="confirmDeleteMovie('${movie._id}')">Xóa</button>
            </td>
        `;
        movieList.appendChild(row);
    });
}

// Mở modal thêm phim
function openAddMovieModal() {
    document.getElementById('movieModalLabel').innerText = 'Thêm Phim';
    document.getElementById('movieForm').reset();
    document.getElementById('movieId').value = ''; // Đặt giá trị ID về rỗng
}

// Mở modal sửa phim
function openEditMovieModal(id) {
    const movie = movies.find(m => m._id === id); // Tìm phim trong danh sách đã tải

    if (movie) {
        document.getElementById('movieModalLabel').innerText = 'Sửa Phim';
        document.getElementById('movieId').value = movie._id;
        document.getElementById('movieTitle').value = movie.title;
        document.getElementById('movieDescription').value = movie.description;
        document.getElementById('movieCategory').value = movie.category_id; // Cần tải danh sách thể loại
        document.getElementById('movieShowTime').value = new Date(movie.show_time).toISOString().slice(0, 16);
        document.getElementById('movieDuration').value = movie.duration;
        document.getElementById('movieRating').value = movie.rating;
        document.getElementById('movieReleaseDate').value = movie.release_date.slice(0, 10);
        document.getElementById('movieCast').value = movie.cast;

        const modal = new bootstrap.Modal(document.getElementById('movieModal'));
        modal.show();
    }
}

async function addOrUpdateMovie() {
    const id = document.getElementById('movieId').value; // Lấy ID từ input
    const formData = new FormData(document.getElementById('movieForm'));

    // Lấy giá trị từ các trường đầu vào
    const title = document.getElementById('movieTitle').value.trim();
    const description = document.getElementById('movieDescription').value.trim();
    const imageUrl = document.getElementById('movieImage').files[0]; // Lấy file hình ảnh

    // Kiểm tra các trường bắt buộc
    if (!title || !description || (!imageUrl && !id)) {
        alert('Vui lòng điền đầy đủ tiêu đề, mô tả và hình ảnh.');
        return;
    }

    // Thêm các giá trị vào FormData
    formData.append('title', title);
    formData.append('description', description);
    if (imageUrl) {
        formData.append('movieImage', imageUrl); // Sử dụng tên trường khớp với Multer
    }

    // Debug: Kiểm tra giá trị trước khi gửi
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }

    try {
        const response = id ?
            await fetch(`/api/movies/${id}`, { method: 'PUT', body: formData }) :
            await fetch('/api/movies', { method: 'POST', body: formData });

        if (!response.ok) throw new Error('Có lỗi xảy ra khi lưu phim.');

        await loadMovies(); // Tải lại danh sách phim
        const modal = bootstrap.Modal.getInstance(document.getElementById('movieModal'));
        modal.hide();
    } catch (error) {
        console.error('Có lỗi xảy ra:', error);
    }
}



// Xác nhận xóa phim
function confirmDeleteMovie(id) {
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    confirmDeleteButton.setAttribute('onclick', `deleteMovie('${id}')`);

    const modal = new bootstrap.Modal(document.getElementById('deleteMovieModal'));
    modal.show();
}

// Xóa phim
async function deleteMovie(id) {
    try {
        const response = await fetch(`/api/movies/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Có lỗi xảy ra khi xóa phim.');

        await loadMovies(); // Tải lại danh sách phim
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteMovieModal'));
        modal.hide();
    } catch (error) {
        console.error('Có lỗi xảy ra:', error);
    }
}

// Khởi động khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    loadMovies();
});


// //hiện thị ds thể loạiddvl bug nhều quá
// async function loadCategories() {
//     try {
//         const response = await fetch('/api/categories'); // Thay đổi đường dẫn API nếu cần
//         if (!response.ok) {
//             throw new Error('Có lỗi xảy ra khi tải danh sách thể loại');
//         }
//         const categories = await response.json(); // Giả sử trả về danh sách thể loại
//
//         const categorySelect = document.getElementById('movieCategory');
//         categorySelect.innerHTML = ''; // Xóa nội dung cũ
//
//         // Thêm tùy chọn vào select
//         categories.forEach(category => {
//             const option = document.createElement('option');
//             option.value = category._id; // Hoặc `category.id` nếu thuộc tính khác
//             option.textContent = category.name; // Hoặc `category.title` nếu thuộc tính khác
//             categorySelect.appendChild(option);
//         });
//     } catch (error) {
//         console.error('Có lỗi xảy ra:', error);
//     }
// }
//
// // Gọi hàm loadCategories khi mở modal thêm phim
// function openAddMovieModal() {
//     document.getElementById('movieModalLabel').innerText = 'Thêm Phim';
//     document.getElementById('movieForm').reset();
//     document.getElementById('movieId').value = '';
//     loadCategories(); // Tải danh sách thể loại
// }
//
// // Hoặc gọi hàm này trong DOMContentLoaded để tải ngay khi trang được tải
// document.addEventListener('DOMContentLoaded', () => {
//     loadMovies();
//     loadCategories(); // Tải danh sách thể loại khi trang được tải
// });
