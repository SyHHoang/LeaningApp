<template>
<userHeader></userHeader>
<div class="content">
  <router-view></router-view>
</div>
</template>
<script setup>
import userHeader from '@/components/header/userHeader.vue';
</script>
