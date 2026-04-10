<template>
  <button class="btn">
    <slot />
  </button>
</template>

<script setup>
</script>

<style scoped>
.btn {
  padding: 10px 18px;
  background: #4F46E5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.3s;
}

.btn:hover {
  background: #4338CA;
}
</style>
