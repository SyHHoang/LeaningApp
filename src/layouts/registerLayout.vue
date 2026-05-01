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
            :class="{ invalid: errors.username }"
            :disabled="loading"
          />
          <p v-if="errors.username" class="error-message">
            {{ errors.username }}
          </p>
        </div>

        <div class="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Nhập email"
            v-model="form.email"
            :class="{ invalid: errors.email }"
            :disabled="loading"
          />
          <p v-if="errors.email" class="error-message">
            {{ errors.email }}
          </p>
        </div>

        <div class="form-group">
          <label>Mật khẩu</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu"
            v-model="form.password"
            :class="{ invalid: errors.password }"
            :disabled="loading"
          />
          <p v-if="errors.password" class="error-message">
            {{ errors.password }}
          </p>
        </div>

        <button type="submit" class="btn-register" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span>{{ loading ? 'Đang đăng ký...' : 'Đăng ký' }}</span>
        </button>

      </form>

      <p class="register-footer">
        Đã có tài khoản?
        <router-link to="/auth/login">Đăng nhập</router-link>
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance from '@/services/axiosService'
import { alertService } from '@/services/alertService'
const router = useRouter()

const form = ref({
  username: '',
  email: '',
  password: ''
})

const errors = ref({
  username: '',
  email: '',
  password: ''
})

const loading = ref(false)

const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordregex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

const validate = () => {
  let isValid = true

  errors.value = {
    username: '',
    email: '',
    password: ''
  }

  if (!form.value.username) {
    errors.value.username = 'Vui lòng nhập tên người dùng'
    isValid = false
  }

  if (!form.value.email) {
    errors.value.email = 'Vui lòng nhập email'
    isValid = false
  } else if (!emailregex.test(form.value.email.trim())) {
    errors.value.email = 'Email không hợp lệ'
    isValid = false
  }

  if (!form.value.password) {
    errors.value.password = 'Vui lòng nhập mật khẩu'
    isValid = false
  } else if (!passwordregex.test(form.value.password)) {
    errors.value.password = 'Mật khẩu phải ≥ 8 ký tự, gồm chữ và số'
    isValid = false
  }

  return isValid
}

const createUser = async () => {
  if (!validate()) return

  loading.value = true

  try {
    const res = await axiosInstance.post('/users/createUser', {
      username: form.value.username,
      email: form.value.email,
      password: form.value.password
    })
    console.log(res.data)
    if (!res.data.success) {
      alertService('error',res.data.message)

    }
    else{
        router.push({ name: 'UserDashboard' })
    }


  } catch (err) {
    alertService('error',err.response.data.message)
  } finally {
    loading.value = false
  }
}
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

.form-group {
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
}

.form-group input {
  padding: 11px 14px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  transition: 0.25s;
  outline: none;
}

.form-group input.invalid {
  border-color: #ef4444;
  background: #fef2f2;
}

.form-group input:focus {
  border-color: #4F46E5;
}

.error-message {
  margin-top: 6px;
  color: #ef4444;
  font-size: 13px;
}

.btn-register {
  width: 100%;
  margin-top: 10px;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: #4F46E5;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-register:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-top: 2px solid transparent;
  border-radius: 50%;
  margin-right: 6px;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.register-footer {
  margin-top: 20px;
  text-align: center;
}
</style>
