<template>
  <div class="relative">
    <navbar />
    <div class="absolute top-0 w-full">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import navbar from './views/navbar.vue';
</script>