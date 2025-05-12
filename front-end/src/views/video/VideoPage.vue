<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const mockData = [
  { 
    id: 1, 
    videoSrc: '/src/assets/video.mp4', 
    coverSrc: '/src/assets/学校logo.jpeg', 
    videoTitle: '视频标题', 
    videoDescription: '视频简介：这是一段演示视频。社会发展离不开社会思潮的影响，而社会思潮的引导离不开新闻传播的作用。传统与现代从来都不是一对相互对立的词语，随着人类社会的不断进步，传统思想必然要朝向现代思想进行转变，但是传统思想的禁锢并不是轻易就可以被打破的，而且在传统阶级社会中，统治者为了维护自身权益所形成的思想文化已经形成了巨大的思想牢笼，人们要想从这个牢笼中脱离出来就必须拥有钥匙，而新闻传播就充分的发挥了钥匙的作用，通过对现代化思想的报道和解析，新闻传播有效的解开了传统思想覆盖在人们身上的枷锁，给了人们自由选择生活的机会。'
  },{ 
    id: 2, 
    videoSrc: '/src/assets/video.mp4', 
    coverSrc: '/src/assets/学校logo.jpeg', 
    videoTitle: '我是第二个视频', 
    videoDescription: '第二个视频'
  },{ 
    id: 3, 
    videoSrc: '/src/assets/video.mp4', 
    coverSrc: '/src/assets/学校logo.jpeg', 
    videoTitle: '我是第3个视频', 
    videoDescription: '第3个视频'
  },{ 
    id: 4, 
    videoSrc: '/src/assets/video.mp4', 
    coverSrc: '/src/assets/学校logo.jpeg', 
    videoTitle: '我是第4个视频', 
    videoDescription: '第4个视频'
  },{ 
    id: 5, 
    videoSrc: '/src/assets/video.mp4', 
    coverSrc: '/src/assets/学校logo.jpeg', 
    videoTitle: '我是第5个视频', 
    videoDescription: '第5个视频'
  },{ 
    id: 6, 
    videoSrc: '/src/assets/video.mp4', 
    coverSrc: '/src/assets/学校logo.jpeg', 
    videoTitle: '我是第6个视频', 
    videoDescription: '第6个视频'
  },{ 
    id: 7, 
    videoSrc: '/src/assets/video.mp4', 
    coverSrc: '/src/assets/学校logo.jpeg', 
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
