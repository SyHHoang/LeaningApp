<template>
  <header>
    <logo />
    <div>
      <nav>
        <router-link to="/">Trang chủ</router-link> |
        <router-link to="/courses">Chương trình học</router-link> |
        <router-link to="/forum">Diễn đàn</router-link> |
        <router-link to="/document">Tài liệu</router-link>
        <router-link to="/practice">Luyện tập</router-link>
      </nav>
    </div>
  </header>
</template>
<script setup>
import Logo from '@/components/logo.vue'
</script>
