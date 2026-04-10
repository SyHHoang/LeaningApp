<template>
  <div class="register-layout">
    <div class="register-box">

      <h2>Đăng ký tài khoản</h2>

      <form @submit.prevent="createUser">

        <div class="form-group">
          <label>Tên người dùng</label>
          <input
            type="text"
            placeholder="Nhập tên của bạn"
            v-model="form.username"
          />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Nhập email"
            v-model="form.email"
          />
        </div>

        <div class="form-group">
          <label>Mật khẩu</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu"
            v-model="form.password"
          />
        </div>

        <button type="submit" class="btn-register">
          Đăng ký
        </button>

        <p v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>

      </form>

      <p class="register-footer">
        Đã có tài khoản?
        <router-link to="/auth/login">Đăng nhập</router-link>
      </p>

    </div>
  </div>
</template>
<script setup>
  import { ref } from 'vue';
  import axiosInstance from '@/services/axiosService';
  const form = ref({
    username: '',
    email: '',
    password: ''
  });
  const errorMessage = ref('');
  const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordregex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const createUser = async() => {
    // Logic to create user
    if (!form.value.email || !form.value.password) {
      errorMessage.value = 'Vui lòng điền tất cả các trường.';
      return;
    }
    if (!emailregex.test(form.value.email)) {
      errorMessage.value = 'Định dạng email không hợp lệ.';
      return;
    }
    if (!passwordregex.test(form.value.password)) {
      errorMessage.value = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm cả chữ cái và số.';
      return;
    };
    await axiosInstance.post('/users/createUser',{
      username: form.value.username,
      email: form.value.email,
      password: form.value.password
    })
    .then((response) => {
      console.log('Người dùng được tạo thành công:', response.data);
      // Reset form and error message
      form.value.username = '';
      form.value.email = '';
      form.value.password = '';
      errorMessage.value = '';
    })
    .catch((error) => {
      console.error('Lỗi khi tạo người dùng:', error);
      errorMessage.value = 'Đã xảy ra lỗi khi tạo người dùng.';
    });
  };
</script>
<style scoped>
.register-layout {
  min-height: 100vh;
  background: #f5f7fb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-box {
  width: 400px;
  background: white;
  padding: 35px 30px;
  border-radius: 14px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
}

.register-box h2 {
  text-align: center;
  margin-bottom: 25px;
  font-size: 24px;
  color: #1f2937;
  font-weight: 600;
}

.form-group {
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 14px;
  margin-bottom: 6px;
  color: #4b5563;
}

.form-group input {
  padding: 11px 14px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
  transition: 0.25s;
  outline: none;
}

.form-group input:focus {
  border-color: #4F46E5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

.btn-register {
  width: 100%;
  margin-top: 10px;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: #4F46E5;
  color: white;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.3s;
}

.btn-register:hover {
  background: #4338CA;
}

.error-message {
  margin-top: 12px;
  color: #ef4444;
  font-size: 14px;
  text-align: center;
}

.register-footer {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
}

.register-footer a {
  color: #4F46E5;
  text-decoration: none;
  font-weight: 500;
}

.register-footer a:hover {
  text-decoration: underline;
}
</style>
