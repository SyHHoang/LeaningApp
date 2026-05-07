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
            :disabled="loading"
          />
          <p class="error-text">{{ error.email }}</p>
        </div>

        <div class="form-group">
          <label>Mật khẩu</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu"
            v-model="form.password"
            :disabled="loading"
          />
          <p class="error-text">{{ error.password }}</p>
        </div>

        <button type="submit" class="btn-login" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span>{{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}</span>
        </button>
        <input class="remmemberme-checkbox" type="checkbox" name="dong_y" v-model="rememberMe"> Duy trì đăng nhập 30 ngày
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
//mport { userStore } from '@/stores/userSetting'
//import GoogleLoginButton from '@/components/auth/googleLoginButton.vue'

const router = useRouter()
const rememberMe=ref(false)
const form = ref({
  email:'',
  password:''
})

const error = ref({
  email:'',
  password:''
})

const loading = ref(false)

const login = async () => {
  try {
    if (handleError(form.value.email, form.value.password)) return

    loading.value = true
    const data={
      email:form.value.email,
      password:form.value.password,
      rememberMe:rememberMe.value
    }
    const res = await axiosInstance.post('users/login', data)
    console.log("res là", res)

    if (res.data.success)
      //userStore.changeData(res.data.userId)
      router.push(`/${res.data.role}`)

  } catch (err) {
    console.error('Login thất bại', err)
  } finally {
    loading.value = false
  }
}

const handleError = (email, password) => {
  error.value.email = ''
  error.value.password = ''

  let isError = false

  email = email.trim()

  if (!email) {
    error.value.email = 'Email không được để trống'
    isError = true
  } else if (email.length > 256) {
    error.value.email = 'Độ dài Email vượt quá 256 ký tự'
    isError = true
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      error.value.email = "Sai định dạng Email"
      isError = true
    }
  }

  if (!password) {
    error.value.password = "Mật khẩu không được để trống"
    isError = true
  } else if (password.length > 100) {
    error.value.password = "Độ dài mật khẩu vượt quá 100 ký tự"
    isError = true
  }

  return isError
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
.error-text{
  color: red;
}

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
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-login:hover {
  background: #4338CA;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-top: 2px solid transparent;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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
.remmemberme-checkbox{
  margin:10px;
  padding:5px
}
</style>
