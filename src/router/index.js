import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/home-time.vue";
import ip2location from "@/views/ip2location.vue"
import whois from "@/views/whois.vue"
import about from "@/views/about.vue"
import bot from "@/views/bot.vue"

const routes = [
  { path: "/", component: Home, meta: { title: 'Home - ldeng.cc' }}, // 首頁
  { path: "/ip2location", component: ip2location,meta: {title: 'IP2Location - ldeng.cc'}},
  { path: "/whois", component: whois,meta: {title: 'WHOIS - ldeng.cc'}},
  { path: "/about", component: about,meta: {title: 'About - ldeng.cc'}},
  { path: "/bot", component: bot,meta: {title: 'Discord Bot - ldeng.cc'}},
];

const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 history 模式
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'ldeng.cc'
  next()
})

export default router;
