import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router"; // 導入 Vue Router
import { createPinia } from 'pinia';

const app = createApp(App);

app.use(createPinia());
app.use(router); // 啟用 Vue Router
app.mount("#app");