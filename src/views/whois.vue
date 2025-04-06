<template>
  <div class="relative min-h-screen flex justify-center items-center p-4">
    <div class="max-w-4xl w-full p-6 relative z-10">
      
      <!-- WHOIS 查詢標題 -->
      <div
        class="text-white text-center p-4 rounded-xl mb-6 transition-opacity duration-500"
        v-if="!domainDetails || isDesktop"
      >
        <h1 class="text-4xl font-light">WHOIS</h1>
      </div>

      <!-- 輸入框與按鈕 -->
      <div class="bg-transparent bg-opacity-95 shadow-lg backdrop-blur-2xl text-white flex justify-center items-center p-4 rounded-xl mb-6 space-x-4">
        <input
          v-model="domainName"
          type="text"
          placeholder="請輸入網域名稱"
          class="border p-2 rounded-l-xl w-3/4 focus:outline-none"
        />
        <button
          @click="fetchDomainDetails"
          class="bg-transparent bg-opacity-95 shadow-2xl backdrop-blur-2xl text-white p-4 rounded-xl hover:bg-gray-500 transition duration-200 ease-in-out w-1/4 cursor-pointer"
          :disabled="isLoading || isVerifying"
        >
          {{ isVerifying ? 'Verifying...' : isLoading ? 'Loading...' : 'Search' }}
        </button>
      </div>

      <!-- CAPTCHA -->
      <transition name="fade">
        <div id="cf-turnstile" class="flex justify-center mb-6" v-show="!captchaToken"></div>
      </transition>

      <!-- 錯誤提示 -->
      <p v-if="error" class="text-red-500 text-center mt-2 font-bold">{{ error }}</p>

      <!-- 結果區 -->
      <div
        v-if="domainDetails"
        ref="resultSection"
        class="mt-6"
      >
        <!-- Domain Detail -->
        <div class="bg-transparent bg-opacity-95 shadow-lg backdrop-blur-2xl p-6 rounded-xl w-full">
          <h2 class="text-xl text-white font-light mb-4">Domain Details</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-white">
            <div class="bg-gray-800 bg-opacity-50 p-4 rounded-xl">
              <h3 class="text-md font-bold mb-2">DOMAIN</h3>
              <p>{{ domainDetails.domain }}</p>
            </div>
            <div class="bg-gray-800 bg-opacity-50 p-4 rounded-xl">
              <h3 class="text-md font-bold mb-2">DOMAIN AGE</h3>
              <p>{{ domainDetails.domain_age || 'N/A' }}</p>
            </div>
            <div class="bg-gray-800 bg-opacity-50 p-4 rounded-xl">
              <h3 class="text-md font-bold mb-2">REGISTER</h3>
              <p>{{ domainDetails.register || 'N/A' }}</p>
            </div>
            <div class="bg-gray-800 bg-opacity-50 p-4 rounded-xl">
              <h3 class="text-md font-bold mb-2">CREATE DATE</h3>
              <p>{{ domainDetails.create_date || 'N/A' }}</p>
            </div>
            <div class="bg-gray-800 bg-opacity-50 p-4 rounded-xl">
              <h3 class="text-md font-bold mb-2">UPDATE DATE</h3>
              <p>{{ domainDetails.update_date || 'N/A' }}</p>
            </div>
            <div class="bg-gray-800 bg-opacity-50 p-4 rounded-xl">
              <h3 class="text-md font-bold mb-2">EXPIRE DATE</h3>
              <p>{{ domainDetails.expire_date || 'N/A' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue';

const domainName = ref('');
const domainDetails = ref(null);
const isLoading = ref(false);
const isVerifying = ref(false);
const error = ref('');
const captchaToken = ref('');
const resultSection = ref(null);

const API_KEY = '88543F016CC43723E562294BA374BBD0'; // 替換為你的 IP2WHOIS API KEY

const isMobile = computed(() => window.innerWidth < 1024);
const isDesktop = computed(() => window.innerWidth >= 1024);

const initCaptcha = () => {
  const el = document.getElementById('cf-turnstile');
  if (el) el.innerHTML = '';

  if (window.turnstile) {
    window.turnstile.render('#cf-turnstile', {
      sitekey: '0x4AAAAAABD7RMBS6NkTgwgE',
      callback: token => {
        captchaToken.value = token;
        console.log('✅ 驗證成功，Token:', token);
      }
    });
  }
};

onMounted(() => {
  initCaptcha();
  window.addEventListener('resize', updateScreen);
});

onBeforeUnmount(() => {
  captchaToken.value = '';
  window.removeEventListener('resize', updateScreen);
});

const updateScreen = () => {
  // 觸發 re-computed
  window.innerWidth;
};

const fetchDomainDetails = async () => {
  if (!domainName.value) {
    error.value = '請輸入網域名稱';
    return;
  }

  if (!captchaToken.value) {
    error.value = '請先完成機器人驗證';
    initCaptcha();
    return;
  }

  error.value = '';
  isLoading.value = true;

  try {
    // 使用你的Worker URL代替直接API調用
    const workerUrl = 'https://whois.james941024.workers.dev/?domain=' + encodeURIComponent(domainName.value);
    const response = await fetch(workerUrl);
    
    if (!response.ok) {
      throw new Error(`請求失敗：${response.status}`);
    }
    
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.error_message || '獲取網域詳細資訊失敗');
    }

    domainDetails.value = {
      domain: data.domain,
      create_date: data.create_date,
      update_date: data.update_date,
      expire_date: data.expire_date,
      domain_age: data.domain_age,
      register: data.registrar?.name || 'N/A'
    };

    await nextTick();
    scrollToResult();
  } catch (err) {
    error.value = `獲取網域詳細資訊時發生錯誤: ${err.message}`;
    console.error('錯誤:', err);
  } finally {
    isLoading.value = false;
  }
};

const scrollToResult = () => {
  if (resultSection.value) {
    resultSection.value.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>