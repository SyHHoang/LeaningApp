<template>
  <header class="guest-header">
    <div class="container">
      <nav class="navbar">

        <div class="logo">
          <a href="/user" class="logo-box">
            <img src="/logo.jpg" alt="EngliGo" />
            <span class="site-name">EngliGo</span>
          </a>
        </div>

        <ul class="menu">
          <li><router-link to="/user">Trang chủ</router-link></li>
          <li><router-link to="/user/courseList">Khóa học</router-link></li>
          <li><router-link to="/user/examList">Đề thi</router-link></li>
          <li><router-link to="/user/examHistory">Lịch sử thi</router-link></li>
          <li><router-link to="/user/flashcardsList">Flashcards</router-link></li>
        </ul>

        <div class="user-menu" ref="menuRef">
          <div class="user-icon" @click="toggleMenu">
            <i class="bi bi-person"></i>
          </div>

          <div v-if="showMenu" class="dropdown">
            <router-link to="/auth/login">Thông tin cá nhân</router-link>
            <button @click="logout">Đăng xuất</button>
          </div>
        </div>

      </nav>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from "vue-router";
import axios from "axios";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { alertService } from "@/services/alertService";
const router=useRouter()
const showMenu = ref(false);
const menuRef = ref(null);


const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const handleClickOutside = (event) => {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    showMenu.value = false;
  }
};
const logout=async()=>{
    const res=await axios.post(`${import.meta.env.VITE_API_URL}/users/logout`,
{},
  {
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true,
  }
    )
    if(res.data.success){
      router.push({name:'home'})
    }
    else{
      alertService('error','Lỗi Server, đăng xuất thất bại')
    }
}
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.guest-header {
  width: 100%;
  background: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.container {
  max-width: 1200px;
  margin: auto;
  padding: 0 20px;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.logo img {
  height: 45px;
  cursor: pointer;
  object-fit: contain;
}

.logo-box {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.site-name {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.menu {
  display: flex;
  align-items: center;
  gap: 30px;
  list-style: none;
}

.menu li a {
  text-decoration: none;
  color: #333;
  font-size: 15px;
  font-weight: 500;
  transition: 0.3s;
  position: relative;
}

.menu li a:hover {
  color: #4F46E5;
}

.menu li a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 0;
  height: 2px;
  background: #4F46E5;
  transition: 0.3s;
}

.menu li a:hover::after {
  width: 100%;
}


.user-menu {
  position: relative;
}

.user-icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #4F46E5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s;
}

.user-icon i {
  color: white;
  font-size: 18px;
}

.user-icon:hover {
  background: #4338CA;
}

/* DROPDOWN */
.dropdown {
  position: absolute;
  right: 0;
  top: 55px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  width: 160px;
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  animation: fadeIn 0.2s ease;
}

.dropdown a {
  padding: 10px 16px;
  text-decoration: none;
  color: #333;
  font-size: 14px;
  transition: 0.2s;
}

.dropdown a:hover {
  background: #f5f5ff;
  color: #4F46E5;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
