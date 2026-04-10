<template>
  <div class="admin-dashboard">
    <h1 class="h3 mb-4">Tổng quan quản trị</h1>
    <p class="text-muted mb-4">Chào mừng đến trang quản trị. Chọn mục bên trái hoặc các thẻ bên dưới để quản lý.</p>

    <div class="row g-4">
      <div class="col-md-6 col-lg-4">
        <router-link to="/admin/courses" class="card dashboard-card text-decoration-none">
          <div class="card-body">
            <i class="bi bi-journal-bookmark-fill text-primary fs-1"></i>
            <h5 class="card-title mt-2">Quản lý khóa học</h5>
            <p class="card-text text-muted small mb-0">Thêm, sửa, xóa khóa học và bài học</p>
          </div>
        </router-link>
      </div>
      <div class="col-md-6 col-lg-4">
        <router-link to="/admin/exams" class="card dashboard-card text-decoration-none">
          <div class="card-body">
            <i class="bi bi-journal-text text-success fs-1"></i>
            <h5 class="card-title mt-2">Quản lý đề thi</h5>
            <p class="card-text text-muted small mb-0">Tạo và quản lý đề thi JLPT</p>
          </div>
        </router-link>
      </div>
      <div class="col-md-6 col-lg-4">
        <router-link to="/admin/users" class="card dashboard-card text-decoration-none">
          <div class="card-body">
            <i class="bi bi-people-fill text-info fs-1"></i>
            <h5 class="card-title mt-2">Quản lý người dùng</h5>
            <p class="card-text text-muted small mb-0">Xem và quản lý tài khoản người dùng</p>
          </div>
        </router-link>
      </div>
      <div class="col-md-6 col-lg-4">
        <router-link to="/admin/reports" class="card dashboard-card text-decoration-none">
          <div class="card-body">
            <i class="bi bi-graph-up text-warning fs-1"></i>
            <h5 class="card-title mt-2">Báo cáo</h5>
            <p class="card-text text-muted small mb-0">Thống kê và báo cáo hoạt động</p>
          </div>
        </router-link>
      </div>
      <div class="col-md-6 col-lg-4">
        <router-link to="/admin/vocabulary" class="card dashboard-card text-decoration-none">
          <div class="card-body">
            <i class="bi bi-graph-up text-warning fs-1"></i>
            <h5 class="card-title mt-2">Quản lý từ vựng</h5>
          </div>
        </router-link>
      </div>

            <div class="col-md-6 col-lg-4">
        <router-link to="/admin/flashcards" class="card dashboard-card text-decoration-none">
          <div class="card-body">
            <i class="bi bi-graph-up text-warning fs-1"></i>
            <p class="card-text text-muted small mb-0">Quản lý Flash Cards</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.admin-dashboard {
  max-width: 1000px;
}
.dashboard-card {
  transition: transform 0.2s, box-shadow 0.2s;
}
.dashboard-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}
</style>
