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

