<template>
    <GuestHeader />
      <router-view />
    <GuestFooter />
</template>
<script setup>
import GuestHeader from '@/components/header/guestHeader.vue';
import GuestFooter from '@/components/header/guestFooter.vue';
</script>

