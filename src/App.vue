<template>
  <div class="relative">
    <navbar />
    <div class="absolute top-0 w-full">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import navbar from './views/navbar.vue'

// 載入 Turnstile 腳本
onMounted(() => {
  const existingScript = document.querySelector('script[src*="turnstile"]')
  if (!existingScript) {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }
})
</script>
