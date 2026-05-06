<template>
  <div class="admin-layout">
    <AdminSidebar class="admin-sidebar"/>
    <router-view class="admin-main-content"/>
  </div>
</template>
<script setup>
import AdminSidebar from '@/components/sidebar/adminSidebar.vue';
</script>
<style scoped>
.admin-layout {
  display: grid;
  min-height: 100vh;
  grid-template-columns: 300px auto;
}
.admin-sidebar{
  position: sticky;
  top: 0;
  height: 100vh;
}
.admin-main-content{
  padding-left: 40px;
  padding-right: 40px;
  padding-top:20px
}
</style>
