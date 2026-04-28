<template>
  <div class="admin-layout">
    <AdminSidebar />
    <router-view />
  </div>
</template>
<script setup>
import AdminSidebar from '@/components/sidebar/adminSidebar.vue';
</script>
<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}
</style>
