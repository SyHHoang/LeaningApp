<template>
  <div class="login-layout">
    <form @submit.prevent="login">
      <label>Nhập email</label>
      <input
        type="email"
        placeholder="Email"
        v-model="form.email"
      />

      <label>Nhập mật khẩu</label>
      <input
        type="password"
        placeholder="Mật khẩu"
        v-model="form.password"
      />

      <button type="submit">Đăng nhập</button>

      <div class="divider">hoặc</div>

      <!-- Login Google -->
      <GoogleLoginButton
        @success="handleGoogleSuccess"
        @error="handleGoogleError"
      />
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance from '@/services/axiosService'
import GoogleLoginButton from '@/components/auth/googleLoginButton.vue'

const router = useRouter()

const form = ref({
  email: '',
  password: ''
})

// login thường
const login = async () => {
  try {
    const res = await axiosInstance.post('users/login', form.value)
    console.log(res)
    localStorage.setItem('access_token', res.data.token)
    if(res.data.success)
      router.push(`/${res.data.role}`)
  } catch (err) {
    console.error('Login thất bại', err)
  }
}

// login google
const handleGoogleSuccess = (jwtToken) => {
  localStorage.setItem('access_token', jwtToken)
  router.push('/dashboard')
}

const handleGoogleError = (err) => {
  console.error('Google login error:', err)
}
</script>
