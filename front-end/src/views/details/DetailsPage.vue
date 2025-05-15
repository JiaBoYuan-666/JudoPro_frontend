<template>
  <div class="details-container">
    <el-button type="primary" @click="goBack" class="back-button">
      返回上一页
    </el-button>
    
    <div class="athlete-card" v-if="athleteData.isValid">
      <div class="athlete-header">
        <div class="athlete-avatar">
          <el-image 
            :src="athleteData.IMAGE" 
            fit="cover"
            :preview-src-list="[athleteData.IMAGE]"
            :preview-teleported="true"
          />
        </div>
        <div class="athlete-basic-info">
          <h1 class="athlete-name">{{ athleteData.NAME }}</h1>
          <div class="athlete-location">
            <img :src="athleteData.LOCATION_ICON" alt="国旗" class="location-icon" />
            <span>{{ athleteData.LOCATION }}</span>
          </div>
          <div class="athlete-stats">
            <div class="stat-item">
              <span class="stat-label">ID:</span>
              <span class="stat-value">{{ athleteData.ID }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">年龄:</span>
              <span class="stat-value">{{ athleteData.AGE }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">体重:</span>
              <span class="stat-value">{{ athleteData.KG }}kg</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="athlete-photos" v-if="photos.length">
        <h2 class="section-title">照片集</h2>
        <div class="photos-grid">
          <div 
            v-for="(photo, index) in photos" 
            :key="index"
            class="photo-container"
          >
            <el-image 
              :src="photo.url || photo"
              :preview-src-list="photoUrls"
              :initial-index="index"
              fit="cover"
              :preview-teleported="true"
              class="photo-item"
            >
              <template #error>
                <div class="image-error">
                  <el-icon><Picture /></el-icon>
                  <span>加载失败</span>
                </div>
              </template>
            </el-image>
            <div v-if="photo.title" class="photo-title" :title="photo.title">{{ photo.title }}</div>
          </div>
        </div>
      </div>
      
      <div class="athlete-details">
        <h2 class="section-title">详细信息</h2>
        <el-descriptions :column="1" border>
          <el-descriptions-item v-for="(value, key) in athleteDetails" :key="key" :label="key">
            {{ value }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    
    <div v-else class="error-message">
      <el-empty description="无法加载运动员数据" />
    </div>
  </div>
</template>

<script>
import { Picture } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

export default {
  name: 'DetailsPage',
  components: {
    Picture
  },
  setup() {
    const router = useRouter()
    const goBack = () => router.back()
    return { goBack }
  },
  data() {
    return {
      photos: [],
      photoUrls: []
    }
  },
  computed: {
    athleteData() {
      try {
        const rawData = decodeURIComponent(this.$route.params.athleteData || '')
        const data = JSON.parse(rawData || '{}')
        return {
          ...data,
          isValid: !!(data.NAME || data.name)
        }
      } catch (e) {
        console.error('数据解析失败:', e)
        return { isValid: false }
      }
    },
    athleteDetails() {
      // 过滤掉已经在上方显示的基本信息，只展示其他字段
      const excludeKeys = ['IMAGE', 'LOCATION_ICON', 'isValid']
      const details = {}
      
      for (const [key, value] of Object.entries(this.athleteData)) {
        if (!excludeKeys.includes(key) && key !== 'PHOTOS') {
          details[key] = value
        }
      }
      
      return details
    }
  },
  mounted() {
    this.parsePhotos()
  },
  methods: {
    parsePhotos() {
      const photosStr = this.athleteData.PHOTOS
      if (!photosStr) return
      
      try {
        const photos = JSON.parse(photosStr)
        if (Array.isArray(photos)) {
          // 处理纯字符串URL数组
          this.photos = photos.filter(url => url && typeof url === 'string')
            .map(url => ({ url })) // 转换为对象格式以统一处理
        } else {
          // 处理对象格式的照片数据
          if (photos.underTheSpotlights && Array.isArray(photos.underTheSpotlights)) {
            // 确保每个元素都是对象格式
            const spotlightPhotos = photos.underTheSpotlights.map(photo => {
              if (typeof photo === 'object') return photo
              return { url: photo }
            })
            this.photos.push(...spotlightPhotos)
          }
          
          if (photos.photos && Array.isArray(photos.photos)) {
            // 处理包含title和url字段的照片对象
            photos.photos.forEach(photo => {
              if (typeof photo === 'object' && photo.url) {
                // 已经是对象格式，直接添加
                this.photos.push(photo)
              } else if (typeof photo === 'string') {
                // 字符串格式转为对象格式
                this.photos.push({ url: photo })
              }
            })
          }
          
          // 如果存在urls字段，也加入解析
          if (photos.urls && Array.isArray(photos.urls)) {
            this.photos.push(...photos.urls.map(url => {
              // 确保每个URL都转换为对象格式
              return typeof url === 'object' ? url : { url }
            }))
          }
        }
        
        // 提取所有URL用于预览
        this.photoUrls = this.photos.map(photo => photo.url || photo)
      } catch (err) {
        console.error('解析照片数据失败:', err)
      }
    }
  }
}
</script>

<style scoped>
.details-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.back-button {
  margin-bottom: 20px;
}

.athlete-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.athlete-header {
  display: flex;
  padding: 24px;
  border-bottom: 1px solid #eee;
}

.athlete-avatar {
  width: 150px;
  height: 150px;
  margin-right: 24px;
  flex-shrink: 0;
}

.athlete-avatar .el-image {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.athlete-basic-info {
  flex: 1;
}

.athlete-name {
  font-size: 24px;
  margin: 0 0 12px 0;
  color: #333;
}

.athlete-location {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.location-icon {
  width: 24px;
  height: 18px;
  margin-right: 8px;
}

.athlete-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.stat-item {
  background: #f5f7fa;
  padding: 8px 16px;
  border-radius: 4px;
}

.stat-label {
  font-weight: 500;
  margin-right: 8px;
  color: #606266;
}

.section-title {
  font-size: 18px;
  margin: 24px 0 16px;
  padding: 0 24px;
  color: #333;
}

.athlete-photos {
  padding-bottom: 24px;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 0 24px;
}

@media (max-width: 768px) {
  .photos-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .photo-item {
    height: 150px;
  }
}

.photo-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.photo-item {
  height: 200px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
}

.photo-title {
  text-align: center;
  padding: 8px;
  font-size: 14px;
  color: #606266;
  background-color: #f5f7fa;
  border-radius: 0 0 4px 4px;
  margin-top: -4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
}

.photo-title:hover::after {
  content: attr(title);
  position: absolute;
  left: 50%;
  bottom: 100%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  white-space: normal;
  max-width: 200px;
  z-index: 10;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
}

.athlete-details {
  padding: 0 24px 24px;
}

.error-message {
  padding: 40px 0;
  text-align: center;
}
</style>