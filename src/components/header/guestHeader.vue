<template>
  <header class="guest-header">
    <div class="container">
      <nav class="navbar">

        <div class="logo">
  <a href="/" class="logo-box">
    <img src="/logo.jpg" alt="EngliGo" />
    <span class="site-name">EngliGo</span>
  </a>
        </div>

        <ul class="menu">
          <li><router-link to="/">Trang chủ</router-link></li>
          <li><router-link to="/">Khóa học</router-link></li>
          <li><router-link to="/">Từ vựng</router-link></li>
          <li><router-link to="/">Đề thi</router-link></li>
          <li><router-link to="/">Tài liệu</router-link></li>
        </ul>
        <div class="auth-buttons">
          <router-link to="/auth/login" class="btn-login">Đăng nhập</router-link>
          <router-link to="/auth/register" class="btn-register">Đăng ký</router-link>
        </div>

      </nav>
    </div>
  </header>
</template>
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

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-login {
  padding: 8px 16px;
  border: 1px solid #4F46E5;
  border-radius: 8px;
  text-decoration: none;
  color: #4F46E5;
  font-size: 14px;
  font-weight: 500;
  transition: 0.3s;
}

.btn-login:hover {
  background: #4F46E5;
  color: white;
}

.btn-register {
  padding: 8px 16px;
  background: #4F46E5;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: 0.3s;
}

.btn-register:hover {
  background: #4338CA;
}

.navbar {
  transition: 0.3s;
}

.guest-header:hover {
  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.08);
}
.logo-box {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.logo-box:hover {
  text-decoration: none;
}

.site-name {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  text-decoration: none;
}

.site-name {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}
</style>
