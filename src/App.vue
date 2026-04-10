<script setup>
import { userStore } from './stores/userSetting.js'
import {onMounted} from 'vue'
import axiosInstance from './services/axiosService.js';
const user = userStore()
const fetchPublicFlashCard = async () => {
  const res = await axiosInstance.get('/cardLists/public')
  user.publicFlashCard = res.data
}

onMounted(fetchPublicFlashCard)
</script>

<template>
<router-view></router-view>
</template>

<style scoped></style>
