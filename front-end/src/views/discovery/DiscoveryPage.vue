<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useSearchStore } from '@/stores/index.js'

const router = useRouter()
const page = ref(1)
const pageSize = ref(8)
const data = ref()
const total = ref()
const loading = ref(false)

const searchStore = useSearchStore()
watch(searchStore, () => {
  getPage()
})

const mockData = [
  {
    id: 1,
    // name: 'video1',
    userName: 'Test User',
    views: 100,
    likes: 50,
    image: '/src/assets/video1.png'
  },
  {
    id: 2,
    // name: 'video2',
    userName: 'Test User',
    views: 200,
    likes: 100,
    image: '/src/assets/video2.png'
  },
  {
    id: 3,
    // name: 'video3',
    userName: 'Test User',
    views: 100,
    likes: 50,
    image: '/src/assets/video3.png'
  },
  {
    id: 4,
    // name: 'video4',
    userName: 'Test User',
    views: 200,
    likes: 100,
    image: '/src/assets/video4.png'
  },
  {
    id: 5,
    // name: 'video5',
    userName: 'Test User',
    views: 100,
    likes: 50,
    image: '/src/assets/video5.png'
  },
  {
    id: 6,
    // name: 'video6',
    userName: 'Test User',
    views: 200,
    likes: 100,
    image: '/src/assets/video1.png'
  },
  {
    id: 7,
    // name: 'video1',
    userName: 'Test User',
    views: 100,
    likes: 50,
    image: '/src/assets/video7.png'
  },
  {
    id: 8,
    // name: 'video2',
    userName: 'Test User',
    views: 200,
    likes: 100,
    image: '/src/assets/video8.png'
  },
  {
    id: 9,
    // name: 'video3',
    userName: 'Test User',
    views: 100,
    likes: 50,
    image: '/src/assets/video1.png'
  },
  {
    id: 10,
    // name: 'video4',
    userName: 'Test User',
    views: 200,
    likes: 100,
    image: '/src/assets/video2.png'
  },
  {
    id:11,
    // name: 'video5',
    userName: 'Test User',
    views: 100,
    likes: 50,
    image: '/src/assets/video5.png'
  },
  {
    id:12,
    // name: 'video6',
    userName: 'Test User',
    views: 200,
    likes: 100,
    image: '/src/assets/video6.png'
  }
]

const getPage = async () => {
  loading.value = true
  const startIndex = (page.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  data.value = mockData.slice(startIndex, endIndex)
  total.value = mockData.length
  loading.value = false
}
getPage()
</script>

<template>
  <el-container>
    <el-main>
      <div class="user">
        <el-row v-loading="loading" element-loading-text="加载中" :gutter="10">
          <el-col
            style="margin: 10px 0"
            :span="6"
            v-for="item in data"
            :key="item.id"
            @click="router.push(`/video/${item.id}`)" 
          >
            <el-card
              class="el-card"
              style="height: 450px; max-width: 480px; cursor: pointer"
              shadow="hover"
            >
              <div class="title-container">
                <el-image
                  :src="item.image"
                  style="height: 100%; width: 100%; object-fit: cover; transition: transform 0.3s ease;"
                  :hover="{ transform: 'scale(1.05)' }"
                />
                <h2 style="font-size: 24px; font-weight: bold; text-align: center; margin-top: 10px">{{ item.name }}</h2>
              </div>
              <template #footer>
                <div>{{ item.name }}</div>
                <div class="content2">
                  <div>作者：{{ item.userName }}</div>
                  <div>浏览：{{ item.views }}</div>
                  <div>点赞: {{ item.likes }}</div>
                </div>
              </template>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div class="pagination-container">
        <el-pagination
          v-model:page-size="pageSize"
          v-model:current-page="page"
          layout="prev, total, pager, jumper, next"
          :total="total"
          @current-change="getPage"
        />
      </div>
    </el-main>
  </el-container>
</template>

<style scoped lang="scss">
.pagination-container {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  max-width: 1000px;
}

// 保持其他样式不变
.title-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-container {
  height: 100%;
}

.el-row {
  height: 100%;
}

.el-header {
  background-color: #ffffff;
  color: #7f7f7f;
  height: 90vh;
  align-items: center;
  display: flex;
  justify-content: space-between;
}


.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}


.mb-4 {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 30px;
}


.el-aside {
  background-color: #f7f7f7;
}


.el-main {
  background-color: #f7f7f7;
}


.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}


.el-row {
  margin-bottom: 20px;
}


.el-row:last-child {
  margin-bottom: 0;
}


.el-col {
  border-radius: 4px;
}


.grid-content {
  border-radius: 4px;
  min-height: 36px;
}


.content2 {
  display: flex;
  justify-content: space-between;
  color: #7f7f7f;
  font-size: 13px;
}


.el-pagination {
  margin-top: 5px;
}
</style>
