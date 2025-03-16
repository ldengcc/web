import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
function pathResolve(dir) {
  return resolve(process.cwd(),'.',dir)
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      '@': pathResolve('src')
    }
  },
  server:{
    host: '0.0.0.0',
    port: 3000,
    open: true,
    allowedHosts: ['ldeng.cc','tw.ldeng.cc'] // 允許該主機
  },
  build: {
    assetsInlineLimit: 4096,
  }
})
