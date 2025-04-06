<template>
  <div class="relative min-h-screen flex justify-center items-center p-4">
    <div class="max-w-4xl w-full p-6 relative z-10">
      
      <!-- IP 地址查詢標題 -->
      <div
        class="text-white text-center p-4 rounded-xl mb-6 transition-opacity duration-500"
        v-if="!ipDetails || isDesktop"
      >
        <h1 class="text-4xl font-light">IP2Location</h1>
      </div>

      <!-- 輸入框與按鈕 -->
      <div class="bg-transparent bg-opacity-95 shadow-lg backdrop-blur-2xl text-white flex justify-center items-center p-4 rounded-xl mb-6 space-x-4">
        <input
          v-model="ipAddress"
          type="text"
          placeholder="請輸入 IP 地址"
          class="border p-2 rounded-l-xl w-3/4 focus:outline-none"
        />
        <button
          @click="fetchIpDetails"
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
        v-if="ipDetails"
        ref="resultSection"
        class="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0 mt-6"
      >
        <!-- IP Detail -->
        <div class="bg-transparent bg-opacity-95 shadow-lg backdrop-blur-2xl p-6 rounded-xl w-full lg:w-2/3">
          <h2 class="text-xl text-white font-light mb-2">IP Details</h2>
          <ul class="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-2 text-white text-sm">
            <li><strong>Hostname:</strong> {{ ipDetails.hostname }}</li>
            <li><strong>ASN:</strong> {{ ipDetails.asn }}</li>
            <li><strong>Organization:</strong> {{ ipDetails.organization }}</li>
            <li><strong>Service Type:</strong> {{ ipDetails.services }}</li>
            <li><strong>Country:</strong> {{ ipDetails.country }}</li>
            <li><strong>Region:</strong> {{ ipDetails.region }}</li>
            <li><strong>City:</strong> {{ ipDetails.city }}</li>
            <li><strong>Timezone:</strong> {{ ipDetails.timezone }}</li>
          </ul>
        </div>

        <!-- 地圖 -->
        <div
          class="bg-transparent bg-opacity-95 shadow-lg backdrop-blur-2xl p-4 rounded-xl w-full lg:w-1/3"
          :class="isMobile ? 'h-48' : 'h-full'"
        >
        <div
          id="map"
          :style="{ height: isMobile ? '100px' : '300px' }"
          class="w-full rounded-xl"
        ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const ipAddress = ref('');
const ipDetails = ref(null);
const isLoading = ref(false);
const error = ref('');
const captchaToken = ref('');
const map = ref(null);
const marker = ref(null);
const resultSection = ref(null);

const API_KEY = 'ira_CCESZRqwPhBK7woh7RhkER2FpW0kMJ48fTiX';

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

const convertIpToDecimal = (ip) =>
  ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);

const fetchIpDetails = async () => {
  if (!ipAddress.value) {
    error.value = '請輸入 IP 地址';
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
    const apiUrl = `https://api.ipregistry.co/${ipAddress.value}?key=${API_KEY}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.code && data.code !== 200) {
      throw new Error(data.message || '獲取 IP 詳細資訊失敗');
    }

    ipDetails.value = {
      decimal: convertIpToDecimal(ipAddress.value),
      hostname: data.connection?.domain || 'N/A',
      asn: data.connection?.asn || 'N/A',
      organization: data.connection?.organization || 'N/A',
      services: data.connection?.type || '數據中心',
      country: data.location?.country?.name || 'N/A',
      countryCode: data.location?.country?.code?.toLowerCase() || 'unknown',
      region: data.location?.region?.name || 'N/A',
      city: data.location?.city || 'N/A',
      latitude: data.location?.latitude || 0,
      longitude: data.location?.longitude || 0,
      timezone: data.time_zone?.id || 'N/A'
    };

    await nextTick();
    initMap();
    scrollToResult();
  } catch (err) {
    error.value = err.message || '獲取 IP 詳細資訊時發生錯誤';
    console.error('錯誤:', err);
  } finally {
    isLoading.value = false;
  }
};

const initMap = () => {
  if (!ipDetails.value) return;

  const { latitude, longitude } = ipDetails.value;
  const mapContainer = document.getElementById('map');

  if (map.value) {
    map.value.remove();
    mapContainer.innerHTML = '';
  }

  map.value = L.map(mapContainer).setView([latitude, longitude], 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap 貢獻者'
  }).addTo(map.value);

  marker.value = L.marker([latitude, longitude]).addTo(map.value);
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
#map {
  min-height: 200px;
}
</style>
