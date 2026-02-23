<template>
  <button @click="openCreateUserModal" class="logout-button">Thêm người dùng</button>
  <div v-if="createUserModal">
    <div>
      <label>Thêm người dùng</label>
      <button  @click='closeCreateUsserModal' class="closeModal"></button>
    </div>
    <form @submit.prevent="createUser">
      <div>
        <label>Tên người dùng</label>
        <input type="text" v-model="form.username"/>
      </div>
      <div>
        <label>Email</label>
        <input type="email" v-model="form.email"/>
      </div>
      <div>
        <label>Mật khẩu</label>
        <input type="password" v-model="form.password"/>
      </div>
      <button type="submit">Tạo người dùng</button>
      <label v-if="errorMessage">{{ errorMessage }}</label>
    </form>
  </div>
</template>
<script setup>
  import { ref } from 'vue';
  import axiosInstance from '@/services/axiosService';
  const createUserModal = ref(false);
  const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordregex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const form = ref({
    username: '',
    email: '',
    password: ''
  });
  const errorMessage = ref('');
  const openCreateUserModal = () => {
    createUserModal.value = true;
  };
  const closeCreateUsserModal = () => {
    createUserModal.value = false;
  };
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
  }).then((response) => {
    console.log('User created successfully:', response.data);
    closeCreateUsserModal();
  }).catch((error) => {
    console.error('Error creating user:', error);
    errorMessage.value = 'Đã xảy ra lỗi khi tạo người dùng.';
  });
}

</script>
