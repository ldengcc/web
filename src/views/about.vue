<template>
    <div class="container mx-auto flex flex-col items-center justify-center pt-80"
          :class="[isDarkMode ? 'text-black' : 'text-white']">
      <div class="text-center p-30 rounded-lg max-w-8xl w-full bg-opacity-80">
        <div class="pt-5 text-7xl lg:text-9xl font-light opacity-0 animate-fade-in transition-colors duration-500" style="animation-delay: 1000ms;">COMMING SOON</div>
      </div>
    </div>
  </template>
    
  <script setup>
  import { ref, onMounted, onUnmounted, computed } from 'vue';
  import { useDarkModeStore } from '../store/darkMode';
  
  const darkModeStore = useDarkModeStore();
  const isDarkMode = computed(() => darkModeStore.isDarkMode);
  
  const handleScroll = () => {
    console.log("Scrolling...");
  };
  
  const handleResize = () => {
    console.log("Resizing...");
  };
  
  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
  });
  
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleResize);
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
  