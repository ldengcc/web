<template>
  <div :class="isDarkMode ? 'dark' : ''">
    <!-- 導航欄 - 響應式設計 -->
    <nav
      class="fixed top-0 left-0 w-full py-4 md:py-5 transition-all duration-300 flex items-center px-3 z-50 animate-fade-in"
      :class="[
        isDarkMode ? 'text-black' : 'text-white',
        isScrolled ? (isDarkMode ? 'bg-gray-300 animate-fade-in' : 'bg-black animate-fade-in') : 'bg-transparent'
      ]"
      style="animation-delay: 200ms;"
    >
      <!-- 容器 -->
      <div class="container mx-auto flex justify-between items-center px-4 md:px-0.5">
        <!-- Logo 部分 - 在所有屏幕尺寸都顯示，移到左邊 -->
        <a href="https://me.ldeng.cc">
          <img :src="imageSrc" alt="Banner Image" class="flex w-12 lg:w-38 h-auto animate-fade-in" />
        </a>
        <!-- 桌面導航 - 只在大屏幕顯示 -->
        <ul class="hidden lg:flex space-x-9 order-2">
          <li class="opacity-0 animate-fade-in" style="animation-delay: 600ms;">
            <a href="https://me.ldeng.cc" class="font-bold transition-colors duration-500 ease-in-out hover:text-gray-400">Home</a>
          </li>
          <!-- Tools 下拉菜單 -->
          <li class="opacity-0 animate-fade-in relative group" style="animation-delay: 700ms;">
            <a class="font-bold transition-colors duration-500 ease-in-out hover:text-gray-400 flex items-center">
              Tools
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <div class="absolute left-0 mt-2 w-48 rounded-md shadow-lgbg-opacity-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left group-hover:translate-y-0 translate-y-2"
              :class="[
                isDarkMode ? 'bg-black text-white' : 'bg-white text-black'
              ]"
            >
              <div class="py-1">
                <a href="https://me.ldeng.cc/ip2location" class="block px-4 py-2 text-sm transition-colors duration-200" :class="[isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-400']">IP2Location</a>
                <a href="https://me.ldeng.cc/whois" class="block px-4 py-2 text-sm transition-colors duration-200" :class="[isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-400']">Whois</a>
              </div>
            </div>
          </li>
          <li class="opacity-0 animate-fade-in" style="animation-delay: 800ms;">
            <a href="https://me.ldeng.cc/bot" class="font-bold transition-colors duration-500 ease-in-out hover:text-gray-400">Discord Bot</a>
          </li>
          <li class="opacity-0 animate-fade-in" style="animation-delay: 900ms;">
            <a href="https://me.ldeng.cc/about" class="font-bold transition-colors duration-500 ease-in-out hover:text-gray-400">About</a>
          </li>
        </ul>
        
        <!-- 暗黑模式切換按鈕 -->
        <button 
          @click="toggleDarkMode"
          class="hidden lg:block ml-4 p-2 rounded-full transition-colors duration-300 opacity-0 animate-fade-in order-2 lg:order-3"
          :class="isDarkMode ? 'bg-gray-300 hover:bg-gray-500' : 'bg-gray-700 hover:bg-gray-500'"
          style="animation-delay: 950ms;"
          aria-label="Toggle dark mode"
        >
          <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
        
        <!-- 漢堡選單按鈕 - 只在小屏幕顯示 -->
        <button 
          @click="toggleMenu" 
          class="lg:hidden order-3 opacity-0 animate-fade-in focus:outline-none transition-transform duration-300"
          :class="{ 'rotate-90': isMenuOpen }"
          style="animation-delay: 500ms;"
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </nav>
    
    <!-- 移動端選單 - 使用淡入淡出效果 -->
    <div 
      class="fixed top-16 left-0 right-0 bg-opacity-95 shadow-lg backdrop-blur-2xl z-40 py-4 px-6 transition-all duration-300 ease-in-out"
      :class="[
        isMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none',
        isDarkMode ? 'text-black' : 'text-white',
        isDarkMode ? 'bg-transparent' : 'bg-transparent'
      ]"
    >
      <ul class="space-y-4">
        <li><a href="https://me.ldeng.cc" class="block font-bold py-2 transition-all duration-300 transform hover:translate-x-2 hover:text-gray-400" @click="closeMenu">Home</a></li>
        <!-- 工具子選單 -->
        <li>
          <div class="block font-bold py-2 transition-all duration-300 cursor-pointer" @click="toggleToolsSubmenu">
            <div class="flex justify-between items-center">
              <span>Tools</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-300" :class="{ 'rotate-180': toolsSubmenuOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <div class="pl-4 mt-2 space-y-2 overflow-hidden transition-all duration-300" :class="toolsSubmenuOpen ? 'max-h-40' : 'max-h-0'">
            <a href="https://me.ldeng.cc/ip2location" class="block py-2 transition-all duration-300 transform hover:translate-x-2 hover:text-gray-500" @click="closeMenu">IP2Location</a>
            <a href="https://me.ldeng.cc/whois" class="block py-2 transition-all duration-300 transform hover:translate-x-2 hover:text-gray-500" @click="closeMenu">Whois</a>
          </div>
        </li>
        <li><a href="https://me.ldeng.cc/bot" class="block font-bold py-2 transition-all duration-300 transform hover:translate-x-2 hover:text-gray-400" @click="closeMenu">Discord Bot</a></li>
        <li><a href="https://me.ldeng.cc/about" class="block font-bold py-2 transition-all duration-300 transform hover:translate-x-2 hover:text-gray-400" @click="closeMenu">About</a></li>
        <!-- 移動端暗黑模式切換 -->
        <li>
          <div class="flex items-center justify-between py-1">
            <button 
              @click="toggleDarkMode" 
              class="p-2 rounded-full transition-colors duration-300"
              :class="isDarkMode ? 'bg-gray-300 hover:bg-gray-500' : 'bg-gray-700 hover:bg-gray-500'"
              aria-label="Toggle dark mode"
            >
              <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          </div>
        </li>
      </ul>
    </div>
      <!-- 背景內容區域 -->
      <div class="relative h-screen w-screen overflow-hidden">
      <!-- 背景影片 -->
    <video autoplay muted loop class="absolute top-0 left-0 w-full h-full object-cover z-0">
      <source src="/background.mp4" type="video/mp4" />
    </video>


      <!-- 你的內容區塊 -->
    </div>
    <footer class="w-full text-center py-4 animate-fade-in bg-transparent absolute bottom-0 text-xs transition-all duration-500" :class="[isDarkMode ? 'text-black' : 'text-white']" style="animation-delay: 1000ms;">
      <p>© 2025 ldeng</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useDarkModeStore } from '../store/darkMode';

// 暗黑模式
const darkModeStore = useDarkModeStore();
const isDarkMode = computed(() => darkModeStore.isDarkMode);
const toggleDarkMode = () => darkModeStore.toggleDarkMode();

// 滾動檢測邏輯
const isScrolled = ref(false);
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

// 選單狀態管理
const isMenuOpen = ref(false);
const toolsSubmenuOpen = ref(false);
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  // 關閉子選單當主選單關閉時
  if (!isMenuOpen.value) {
    toolsSubmenuOpen.value = false;
  }
};
const toggleToolsSubmenu = () => {
  toolsSubmenuOpen.value = !toolsSubmenuOpen.value;
};
const closeMenu = () => {
  isMenuOpen.value = false;
  toolsSubmenuOpen.value = false;
};

// 檢測螢幕大小切換Logo
const isSmallScreen = ref(window.innerWidth < 640); // 設定小螢幕偵測
const imageSrc = computed(() => {
  if (isSmallScreen.value) return 'https://i.imgur.com/uF5EPSn.png';
  return isDarkMode.value ? 'https://i.imgur.com/EOLMVMD.png' : 'https://i.imgur.com/qLA7lMp.png';
});
const handleResize = () => {
  isSmallScreen.value = window.innerWidth < 640;
};

// 定義 timeInterval 變量
let timeInterval = null;

// 定義 updateTime 函數
const updateTime = () => {
  // 如果這是在原始代碼中使用的函數，但沒有實現，請根據實際需求補充
  // 這裡只是一個空函數避免報錯
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  // 確保頁面加載時導航欄正確定位
  handleScroll();

  window.addEventListener('resize', handleResize);
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  clearInterval(timeInterval);
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