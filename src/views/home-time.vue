<template>
  <div class="container mx-auto flex flex-col items-center justify-center pt-80"
        :class="[isDarkMode ? 'text-black' : 'text-white']">
    <div class="text-center p-1 lg:p-15 rounded-lg max-w-8xl w-full bg-opacity-80">
      <h2 class="font-light text-5xl lg:text-6xl mb-4 opacity-0 animate-fade-in transition-colors duration-500" style="animation-delay: 1000ms;">Current Time</h2>
      <div class="font-light pt-5 text-7xl lg:text-9xl  opacity-0 animate-fade-in transition-colors duration-500" style="animation-delay: 1000ms;">{{ currentTime }}</div>
      <div class="font-light pt-3 mt-2 text-4xl lg:text opacity-0 animate-fade-in transition-colors duration-500" style="animation-delay: 1000ms;">{{ currentTimeZone }}</div>
    </div>
  </div>
</template>
  
<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useDarkModeStore } from '../store/darkMode';

const darkModeStore = useDarkModeStore();
const isDarkMode = computed(() => darkModeStore.isDarkMode);

// 時間顯示相關變數
const currentTime = ref('');
const currentTimeZone = ref('');
const timeInterval = ref(null);

// 獲取並更新時間
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  currentTimeZone.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
};

// 處理滾動與視窗縮放
const handleScroll = () => {
  console.log("Scrolling...");
};

const handleResize = () => {
  console.log("Resizing...");
};

onMounted(() => {
  document.title = "Time - ldeng.cc";
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleResize);
  updateTime();
  timeInterval.value = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleResize);
  if (timeInterval.value) clearInterval(timeInterval.value);
});
</script>
  
<style>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}
</style>
