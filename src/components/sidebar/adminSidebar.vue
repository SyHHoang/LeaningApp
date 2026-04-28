<template>
  <div class="admin-layout d-flex border">
    <!-- Sidebar -->
    <aside class="sidebar p-3">
      <h4 class="mb-4">Admin</h4>

      <ul class="nav flex-column gap-2">
        <li>
          <router-link to="/admin/courses" class="nav-link">
            <i class="bi bi-journal-bookmark-fill me-2"></i>
            Quản lý khóa học
          </router-link>
        </li>

        <li>
          <router-link to="/admin/exams" class="nav-link">
            <i class="bi bi-journal-text me-2"></i>
            Quản lý đề thi
          </router-link>
        </li>

        <li>
          <router-link to="/admin/users" class="nav-link">
            <i class="bi bi-people-fill me-2"></i>
            Quản lý người dùng
          </router-link>
        </li>

        <li>
          <router-link to="/admin/reports" class="nav-link">
            <i class="bi bi-graph-up me-2"></i>
            Báo cáo
          </router-link>
        </li>

        <li>
          <router-link to="/admin/vocabulary" class="nav-link">
            <i class="bi bi-book me-2"></i>
            Quản lý từ vựng
          </router-link>
        </li>

        <li>
          <router-link to="/admin/flashcards" class="nav-link">
            <i class="bi bi-card-text me-2"></i>
            Flash Cards
          </router-link>
        </li>
      </ul>
    </aside>
  </div>
</template>
