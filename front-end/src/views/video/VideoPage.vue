<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const mockData = [
  { 
    id: 1, 
    videoSrc: new URL('@/assets/video1.mp4', import.meta.url).href,
    coverSrc: new URL('@/assets/学校logo.jpeg', import.meta.url).href,
    videoTitle: '奥东武道柔道俱乐部【膝车】技术动作讲解', 
    videoDescription: '视频简介：无'
  },{ 
    id: 2, 
    videoSrc: new URL('@/assets/video2.mp4', import.meta.url).href,
    coverSrc:  new URL('@/assets/学校logo.jpeg', import.meta.url).href,
    videoTitle: '柔道，柔术教学【腕挫十字固】', 
    videoDescription: '视频简介：无'
  },{ 
    id: 3, 
    videoSrc: new URL('@/assets/video3.mp4', import.meta.url).href,
    coverSrc:  new URL('@/assets/学校logo.jpeg', import.meta.url).href, 
    videoTitle: '柔道寝技教学【袈裟固】的衔接技术', 
    videoDescription: '视频简介：无'
  },{ 
    id: 4, 
    videoSrc: new URL('@/assets/video4.mp4', import.meta.url).href,
    coverSrc:  new URL('@/assets/学校logo.jpeg', import.meta.url).href, 
    videoTitle: '柔道寝技教学【肩甲固】', 
    videoDescription: '视频简介：无'
  },{ 
    id: 5, 
    videoSrc:new URL('@/assets/video5.mp4', import.meta.url).href,
    coverSrc:  new URL('@/assets/学校logo.jpeg', import.meta.url).href,
    videoTitle: '柔道寝技教学【三角绞】', 
    videoDescription: '视频简介：无'
  },{ 
    id: 6, 
    videoSrc: new URL('@/assets/video6.mp4', import.meta.url).href,
    coverSrc:  new URL('@/assets/学校logo.jpeg', import.meta.url).href, 
    videoTitle: '柔道寝技教学【三角绞】的变化系列', 
    videoDescription: '视频简介：无'
  },{ 
    id: 7, 
    videoSrc: '@/assets/video.mp4', 
    coverSrc: '@/assets/学校logo.jpeg', 
    videoTitle: '7', 
    videoDescription: '视频简介：7'
  },{ 
    id: 8, 
    videoSrc: '/src/assets/video.mp4', 
    coverSrc: '/src/assets/学校logo.jpeg', 
    videoTitle: '我是第8个视频', 
    videoDescription: '第8个视频'
  },{ 
    id: 9, 
    videoSrc: '/src/assets/video.mp4', 
    coverSrc: '/src/assets/学校logo.jpeg', 
    videoTitle: '我是第9个视频', 
    videoDescription: '第9个视频'
  },{ 
    id: 10, 
    videoSrc: '/src/assets/video.mp4', 
    coverSrc: '/src/assets/学校logo.jpeg', 
    videoTitle: '我是第10个视频', 
    videoDescription: '第10个视频'
  },{ 
    id: 11, 
    videoSrc: '/src/assets/video.mp4', 
    coverSrc: '/src/assets/学校logo.jpeg', 
    videoTitle: '我是第11个视频', 
    videoDescription: '第11个视频'
  },{ 
    id: 12, 
    videoSrc: '/src/assets/video.mp4', 
    coverSrc: '/src/assets/学校logo.jpeg', 
    videoTitle: '我是第12个视频', 
    videoDescription: '第12个视频'
  },



]
const id = parseInt(route.params.id as string) || 0
const currentVideo = mockData.find(video => video.id === id)
const videoSrc = currentVideo?.videoSrc
const coverSrc = currentVideo?.coverSrc
const videoTitle = currentVideo?.videoTitle
const videoDescription = currentVideo?.videoDescription
const goBack = () => router.back()
</script>


<template>
  <div class="video-container">
    <el-button type="primary" @click="goBack" class="back-button">
      返回上一页
    </el-button>
    <el-card class="video-card">
      <h1 class="video-title">{{ videoTitle }}</h1>

      <div class="player-wrapper">
        <div class="player">
          <video
            controls
            :src="videoSrc"
            :poster="coverSrc"
          >
            您的浏览器不支持播放该视频。
          </video>
        </div>
      </div>
      <p class="video-description">{{ videoDescription }}</p>
    </el-card>
  </div>
</template>

<style scoped>
.back-button {
  align-self: flex-start;
  margin: 16px;
}

.video-card {
  padding: 0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  /* 限制卡片最大宽度并居中 */
  max-width: 800px;
  margin: 0 auto;
}

.video-title {
  font-size: 1.5rem;
  margin: 16px;
}

.player-wrapper {
  /* 限制播放器总体最大宽度并水平居中 */
  max-width: 800px;
  margin: 0 auto;
}

.player {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 宽高比 */
}

.player video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;       /* 响应式宽度 */
  height: auto;      /* 等比缩放 */
  max-height: 450px; /* 限制最大高度 */
  max-width: 100%;   /* 不超出父容器 */
}

.video-description {
  font-size: 1rem;
  color: #666;
  margin: 32px 16px 16px;
}
</style>
