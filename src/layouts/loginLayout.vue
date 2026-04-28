<template>
  <div class="login-layout">
    <div class="login-box">

      <h2>Đăng nhập</h2>

      <form @submit.prevent="login">

        <div class="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Nhập email của bạn"
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

        <button type="submit" class="btn-login">
          Đăng nhập
        </button>

      </form>

      <p class="login-footer">
        Chưa có tài khoản?
        <router-link to="/auth/register">Đăng ký ngay</router-link>
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance from '@/services/axiosService.js'
//import GoogleLoginButton from '@/components/auth/googleLoginButton.vue'

const router = useRouter()

const form = ref({
  email: '',
  password: ''
})

// login thường
const login = async () => {
  try {
    const res = await axiosInstance.post('users/login', form.value)
    console.log("res là", res)
    if(res.data.success)
      router.push(`/${res.data.role}`)
  } catch (err) {
    console.error('Login thất bại', err)
  }
}

// login google
// const handleGoogleSuccess = (jwtToken) => {
//   localStorage.setItem('access_token', jwtToken)
//   router.push('/dashboard')
// }

// const handleGoogleError = (err) => {
//   console.error('Google login error:', err)
// }
</script>
<style scoped>
.login-layout {
  min-height: 100vh;
  background: #f5f7fb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-box {
  width: 380px;
  background: #ffffff;
  padding: 35px 30px;
  border-radius: 14px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
}

.login-box h2 {
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

.btn-login {
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

.btn-login:hover {
  background: #4338CA;
}

.login-footer {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
}

.login-footer a {
  color: #4F46E5;
  text-decoration: none;
  font-weight: 500;
}

.login-footer a:hover {
  text-decoration: underline;
}
</style>
