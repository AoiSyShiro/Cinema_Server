function showContent(section) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach((el) => {
        if (el.id === section) {
            el.classList.remove('inactive');
            el.classList.add('active');
        } else {
            el.classList.remove('active');
            el.classList.add('inactive');
            setTimeout(() => {
                el.style.display = 'none';
            }, 500); // Thời gian ẩn sau khi animation hoàn thành
        }
    });
    document.getElementById(section).style.display = 'block';
}


function addGenre() {
    // Logic để thêm thể loại mới
    alert('Thêm thể loại mới!');
}

function editGenre(id) {
    // Logic để chỉnh sửa thể loại
    alert('Chỉnh sửa thể loại ' + id);
}

function deleteGenre(id) {
    // Logic để xóa thể loại
    alert('Xóa thể loại ' + id);
}

function addFood() {
    // Logic để thêm đồ ăn/đồ uống mới
    alert('Thêm đồ ăn/đồ uống mới!');
}

function editFood(id) {
    // Logic để chỉnh sửa đồ ăn/đồ uống
    alert('Chỉnh sửa đồ ăn/đồ uống ' + id);
}

function deleteFood(id) {
    // Logic để xóa đồ ăn/đồ uống
    alert('Xóa đồ ăn/đồ uống ' + id);
}

function addMovie() {
    // Logic để thêm phim mới
    alert('Thêm phim mới!');
}

function editMovie(id) {
    // Logic để chỉnh sửa phim
    alert('Chỉnh sửa phim ' + id);
}

function deleteMovie(id) {
    // Logic để xóa phim
    alert('Xóa phim ' + id);
}
