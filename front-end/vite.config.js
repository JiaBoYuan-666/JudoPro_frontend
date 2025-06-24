import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({

  server: {
    proxy: {

      '/api': {
        target: 'http://10.199.201.199:8889',  // 新的后端服务地址
        changeOrigin: true,               // 修改请求头中的 Host
        rewrite: (path) => path.replace(/^\/api/, ''), // 去掉 /api 前缀
        // secure: false, // 如果后端是 HTTPS 且使用自签名，可开启此项
      }
    }
  },

  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})