<template>
    <GuestHeader />
    <main>
      <router-view />
      <practicePages />
    </main>
</template>
<script setup>
import GuestHeader from '@/components/header/guestHeader.vue';
import practicePages from '@/pages/userPages/practicePages.vue';
</script>
