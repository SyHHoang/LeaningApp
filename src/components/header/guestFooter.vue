<template>
  <footer class="footer">
    <div class="container">

      <div class="footer-content">
        <div class="footer-brand">
          <div class="logo-box">
            <img src="/logo.jpg" alt="EngliGo">
            <span class="site-name">EngliGo</span>
          </div>
          <p class="footer-desc">
            Nền tảng học tiếng Anh dành cho sinh viên và người mới bắt đầu.
            Học nhanh – dễ nhớ – dễ áp dụng.
          </p>
        </div>

        <!-- MENU -->
        <div class="footer-links">
          <h3>Liên kết</h3>
          <ul>
            <li><router-link to="/">Trang chủ</router-link></li>
            <li><router-link to="/">Khóa học</router-link></li>
            <li><router-link to="/">Từ vựng</router-link></li>
            <li><router-link to="/">Đề thi</router-link></li>
          </ul>
        </div>

        <!-- HỖ TRỢ -->
        <div class="footer-links">
          <h3>Hỗ trợ</h3>
          <ul>
            <li><router-link to="/">Giới thiệu</router-link></li>
            <li><router-link to="/">Liên hệ</router-link></li>
            <li><router-link to="/">Chính sách</router-link></li>
            <li><router-link to="/">Điều khoản</router-link></li>
          </ul>
        </div>

      </div>

      <!-- COPYRIGHT -->
      <div class="footer-bottom">
        <p>© 2025 EngliGo. All rights reserved.</p>
      </div>

    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background: #111827;
  color: white;
  margin-top: 60px;
}

.container {
  max-width: 1200px;
  margin: auto;
  padding: 40px 20px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  gap: 40px;
  flex-wrap: wrap;
}

.footer-brand {
  max-width: 300px;
}

.logo-box {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.logo-box img {
  height: 40px;
}

.site-name {
  font-size: 20px;
  font-weight: 700;
}

.footer-desc {
  font-size: 14px;
  color: #9CA3AF;
  line-height: 1.6;
}

.footer-links h3 {
  margin-bottom: 15px;
  font-size: 16px;
}

.footer-links ul {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-links a {
  text-decoration: none;
  color: #9CA3AF;
  font-size: 14px;
  transition: 0.3s;
}

.footer-links a:hover {
  color: white;
}

.footer-bottom {
  margin-top: 40px;
  border-top: 1px solid #374151;
  padding-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #9CA3AF;
}
</style>
