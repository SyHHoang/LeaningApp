<template>
  <button @click="handleGoogleLogin">
    Đăng nhập với Google
  </button>
</template>

<script setup>
import { googleSdkLoaded } from 'vue3-google-login'
import axiosInstance from '@/services/axiosService'

const emit = defineEmits(['success', 'error'])

const handleGoogleLogin = () => {
  googleSdkLoaded((google) => {
    google.accounts.oauth2
      .initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: 'email profile',
        callback: async (response) => {
          try {
            const googleToken = response.access_token

            const res = await axiosInstance.post('user/authGoogle', {
              token: googleToken
            })

            // emit JWT cho layout xử lý
            emit('success', res.data.token)
          } catch (err) {
            emit('error', err)
          }
        }
      })
      .requestAccessToken()
  })
}
</script>
