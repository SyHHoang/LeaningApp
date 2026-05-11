<template>
  <div class="admin-layout d-flex">
    <!-- Sidebar -->
    <aside class="sidebar p-3">
      <div>
        <h4 class="logo mb-4">
          <i class="bi bi-speedometer2 me-2"></i>
          Admin Panel
        </h4>

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
            <router-link to="/admin/categories" class="nav-link">
              <i class="bi bi-grid-fill me-2"></i>
              Danh mục khóa học
            </router-link>
          </li>

          <li>
            <router-link to="/admin/flashcards" class="nav-link">
              <i class="bi bi-card-text me-2"></i>
              Flash Cards
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Logout -->
      <div class="logout-btn" @click="logout">
        <i class="bi bi-box-arrow-right me-2" ></i>
        Đăng xuất
      </div>
    </aside>
  </div>
</template>

<script setup>
import axiosInstance from '@/services/axiosService';
import { alertService } from '@/services/alertService';
import { useRouter } from 'vue-router';
const router=useRouter()
const logout=async()=>{
    const res=await axiosInstance.post("/users/logout")
    if(res.data.success){
      router.push({name:'home'})
    }
    else{
      alertService('error','Lỗi Server, đăng xuất thất bại')
    }
}
</script>

<style scoped>
/* Sidebar */
.sidebar {
  width: 270px;
  background: #111827;
  color: white;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
}

/* Logo */
.logo {
  font-weight: 700;
  color: #fff;
}

/* Menu */
.nav-link {
  color: #d1d5db;
  padding: 12px 16px;
  border-radius: 12px;

  display: flex;
  align-items: center;

  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link:hover {
  background: #1f2937;
  color: #fff;
  transform: translateX(4px);
}

/* Active router */
.router-link-active {
  background: #2563eb;
  color: white !important;
}

/* Logout button */
.logout-btn {
  margin-top: 20px;

  background: #dc2626;
  color: white;

  padding: 12px;
  border-radius: 12px;

  text-align: center;
  font-weight: 600;

  cursor: pointer;

  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #b91c1c;
  transform: translateY(-2px);
}

/* Content */
.content {
  flex: 1;
  overflow-y: auto;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 90px;
  }

  .sidebar h4,
  .nav-link span,
  .logout-btn span {
    display: none;
  }

  .nav-link {
    justify-content: center;
  }

  .logout-btn {
    font-size: 20px;
  }
}
</style>
