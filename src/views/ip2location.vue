<template>
  <div class="relative min-h-screen flex justify-center items-center p-4">
    <div class="max-w-4xl w-full p-6 relative z-10">
      <!-- IP 地址查詢標題 -->
      <div class="text-white text-center p-4 rounded-xl mb-6 ">
        <h1 class="text-4xl font-light">IP2Location</h1>
      </div>

      <!-- 輸入框和查詢按鈕 -->
      <div class="bg-transparent bg-opacity-95 shadow-lg backdrop-blur-2xl text-white flex justify-center items-center p-4 rounded-xl mb-6 space-x-4">
        <!-- 輸入框 -->
        <input
          v-model="ipAddress"
          type="text"
          placeholder="請輸入 IP 地址"
          class="border p-2 rounded-l-xl w-3/4 focus:outline-none"
        />
        <!-- 查詢按鈕 -->
        <button
          @click="fetchIpDetails"
          class="bg-transparent bg-opacity-95 shadow-2xl backdrop-blur-2xl text-white p-4 rounded-xl hover:bg-gray-500 transition duration-200 ease-in-out w-1/4 cursor-pointer"
          :disabled="isLoading || isVerifying"
        >
          {{ isVerifying ? 'Verifying...' : isLoading ? 'Loading...' : 'Search' }}
        </button>
      </div>

      <!-- 驗證框 -->
      <div id="cf-turnstile" class="flex justify-center mb-6"></div>

      <!-- 查詢錯誤提示 -->
      <p v-if="error" class="text-red-500 text-center mt-2 font-bold">{{ error }}</p>

      <!-- 查詢結果與地圖區域 -->
      <div v-if="ipDetails" class="flex space-x-6">
        <!-- 查詢結果 -->
        <div class="bg-transparent bg-opacity-95 shadow-lg backdrop-blur-2xl p-6 rounded-xl w-2/3">
          <h2 class="text-xl text-white font-light mb-2">IP Details</h2>
          <ul class="space-y-1 text-white">
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

        <!-- 地圖位置 -->
        <div class="bg-transparent bg-opacity-95 shadow-lg backdrop-blur-2xl p-4 rounded-xl w-1/3">
          <div id="map" class="h-full w-full rounded-xl"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const ipAddress = ref('');
const ipDetails = ref(null);
const isLoading = ref(false);
const isVerifying = ref(false);
const error = ref('');
const map = ref(null);
const marker = ref(null);
const captchaToken = ref('');

const API_KEY = 'ira_CCESZRqwPhBK7woh7RhkER2FpW0kMJ48fTiX';

const initCaptcha = () => {
  const el = document.getElementById('cf-turnstile');
  if (el) el.innerHTML = ''; // 清除舊的驗證框

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
});

onBeforeUnmount(() => {
  captchaToken.value = '';
});

const convertIpToDecimal = (ip) => {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);
};

const fetchIpDetails = async () => {
  if (!ipAddress.value) {
    error.value = '請輸入 IP 地址';
    return;
  }

  if (!captchaToken.value) {
    error.value = '請先完成機器人驗證';
    initCaptcha(); // 重新初始化 captcha
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

    setTimeout(() => {
      initMap();
    }, 100);
  } catch (err) {
    error.value = err.message || '獲取 IP 詳細資訊時發生錯誤';
    console.error('獲取 IP 詳細資訊時發生錯誤:', err);
  } finally {
    isLoading.value = false;
  }
};

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

const initMap = () => {
  if (!ipDetails.value) return;

  const lat = ipDetails.value.latitude;
  const lng = ipDetails.value.longitude;

  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  // 銷毀舊地圖並清空 DOM
  if (map.value) {
    map.value.remove();
    map.value = null;
    mapContainer.innerHTML = '';
  }

  map.value = L.map(mapContainer).setView([lat, lng], 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap 貢獻者'
  }).addTo(map.value);

  marker.value = L.marker([lat, lng]).addTo(map.value);
};
</script>

<style scoped>
#map {
  height: 100%;
  width: 100%;
}
</style>
