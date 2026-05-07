<script setup>
//import { userStore } from './stores/userSetting.js'
import {onMounted} from 'vue'
import { useRouter } from 'vue-router';
import axios from 'axios';
//const user = userStore()
const router=useRouter()
const autoLogin = async () => {
 try{
  const res = await axios.post(
  `${import.meta.env.VITE_API_URL}/users/a/login`,
  {},
  {
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true,
  }
)
  if(res.data.success)
    {
        router.push(`/${res.data.role}`)
    }}
  catch(err){
    console.log(err)
  }
}
onMounted(autoLogin)
</script>

<template>
<router-view></router-view>
</template>

<style scoped></style>
