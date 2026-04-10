<template>
  <div class="layout">
    <GuestHeader />

    <main class="main-content">
      <router-view />
    </main>

    <GuestFooter />
  </div>
</template>
<script setup>
import GuestHeader from '@/components/header/guestHeader.vue';
import GuestFooter from '@/components/header/guestFooter.vue';
</script>
<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 20px;
}
</style>
