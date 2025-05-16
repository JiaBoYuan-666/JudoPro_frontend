<template>
  <div class="SearchComponentPage" :class="{ 'searched': hasSearched }">
    <div class="search-container">
      <h2 class="search-title">运动员信息检索</h2>
      <div class="search-box">
        <el-input
          v-model="kw"
          placeholder="请输入关键词"
          class="kw-input"
          style="width: 300px; margin-right: 10px"
          @keyup.enter="search"
        />
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
    </div>

    <div class="table-container" v-if="results.length">
      <el-table
        v-loading="loading"
        element-loading-text="加载中..."
        :data="results"
        style="width: 100%; margin-top: 20px; table-layout: fixed;"
        @row-click="handleRowClick"
      >
      <el-table-column prop="ID" label="ID" :min-width="60" />
      <el-table-column prop="NAME" label="名称" :min-width="120" />
      <el-table-column prop="AGE" label="年龄" :min-width="80" />
      <el-table-column prop="KG" label="体重(kg)" :min-width="100" />
      <el-table-column label="地区" :min-width="150">
        <template #default="{ row }">
          <img
            :src="row.LOCATION_ICON"
            alt=""
            style="width: 20px; vertical-align: middle; margin-right: 6px"
          />
          <span>{{ row.LOCATION }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" :min-width="120">
        <template #default="{ row }">
          <el-image
            style="width: 50px; height: 50px"
            :src="row.IMAGE"
            :preview-src-list="[row.IMAGE]"
            fit="cover"
            :preview-teleported="true"
          />
        </template>
      </el-table-column>
      <el-table-column label="照片集" :min-width="120">
        <template #default="{ row }">
          <div v-if="row.PHOTOS">
            <el-popover
              placement="right"
              trigger="hover"
              :width="300"
            >
              <template #reference>
                <el-button size="small" type="info" plain>
                  <el-icon><Picture /></el-icon>
                  {{ getPhotoCount(row.PHOTOS) }}
                </el-button>
              </template>
              <div class="photos-preview">
                <el-scrollbar height="200px">
                  <div class="photos-grid">
                    <el-image
                      v-for="(photo, index) in parsePhotos(row.PHOTOS)"
                      :key="index"
                      style="width: 80px; height: 80px; margin: 5px;"
                      :src="photo"
                      :preview-src-list="parsePhotos(row.PHOTOS)"
                      fit="cover"
                      :preview-teleported="true"
                      :initial-index="index"
                    />
                  </div>
                </el-scrollbar>
              </div>
            </el-popover>
          </div>
          <span v-else>无照片</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" :min-width="120" fixed="right">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click.stop="viewDetails(row)">
            查看详情
          </el-button>
        </template>
      </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request.js'
import { useRouter } from 'vue-router'
import { Picture } from '@element-plus/icons-vue'

export default {
  name: 'SearchComponentPage',
  components: {
    Picture
  },
  setup() {
    const router = useRouter()
    return { router }
  },
  data() {
    return {
      kw: '',
      results: [],
      loading: false,
      hasSearched: false,
    }
  },
  methods: {
    async search() {
      if (!this.kw) {
        ElMessage.warning('请输入关键词')
        return
      }
      this.loading = true
      // 设置已搜索状态，触发动画
      this.hasSearched = true
      // 触发search事件，用于通知父组件搜索已开始
      this.$emit('search', this.kw)
      try {
        const { data: res } = await request.get('query/kw', {
          params: { pageNo: 1, pageSize: 8, kw: this.kw },
        })
        if (res && res.success) {
          this.results = res.data || []
          // 处理KG字段，去掉前面的横杠
          this.results = this.results.map(item => {
            if (item.KG && typeof item.KG === 'string' && item.KG.startsWith('-')) {
              item.KG = item.KG.substring(1)
            }
            return item
          })
          if (!this.results.length) {
            ElMessage.info('未找到相关结果')
          }
        } else {
          ElMessage.error(res.msg || '检索失败')
          this.results = []
        }
      } catch (err) {
        ElMessage.error(err.message || '请求失败')
      } finally {
        this.loading = false
      }
    },
    handleRowClick(row) {
      this.router.push({
        name: 'DetailsPage',
        params: { athleteData: JSON.stringify(row) }
      })
    },
    
    viewDetails(row) {
      this.router.push({
        name: 'AIREPage',
        params: { athleteData: JSON.stringify(row) }
      })
    },
    
    /**
     * 解析照片字符串为数组
     * @param {string} photosStr - 照片字符串，可能是逗号分隔的URL列表
     * @returns {Array} 照片URL数组
     */
    parsePhotos(photosStr) {
      if (!photosStr) return []
      try {
        // 尝试直接解析为URL数组
        const photos = JSON.parse(photosStr)
        if (Array.isArray(photos)) {
          return photos.filter(url => url && typeof url === 'string')
        }
        // 如果是对象格式，则尝试解析特定字段
        const allPhotos = []
        if (photos.underTheSpotlights && Array.isArray(photos.underTheSpotlights)) {
          allPhotos.push(...photos.underTheSpotlights.map(photo => photo.url || photo))
        }
        if (photos.photos && Array.isArray(photos.photos)) {
          // 处理包含title和url字段的照片对象
          allPhotos.push(...photos.photos.map(photo => {
            // 如果是对象且有url字段，返回url值；否则直接返回photo
            return typeof photo === 'object' && photo.url ? photo.url : photo
          }))
        }
        // 如果存在urls字段，也加入解析
        if (photos.urls && Array.isArray(photos.urls)) {
          allPhotos.push(...photos.urls)
        }
        return allPhotos.filter(url => url && typeof url === 'string')
      } catch (err) {
        console.error('解析照片数据失败:', err)
        return []
      }
    },
    
    /**
     * 获取照片数量
     * @param {string} photosStr - 照片字符串
     * @returns {string} 显示的照片数量文本
     */
    getPhotoCount(photosStr) {
      const count = this.parsePhotos(photosStr).length
      return `${count} 张照片`
    }
  }
}
</script>

<style scoped>
.SearchComponentPage {
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  position: relative;
}

.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  width: 100%;
  z-index: 10;
}

.search-title {
  font-size: 28px;
  margin-bottom: 20px;
  color: #0066cc;
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-weight: bold;
  opacity: 1;
  transform: scale(1);
}

.search-box {
  display: flex;
  align-items: center;
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}


.SearchComponentPage:not(.searched) .search-container {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: 0;
}


.SearchComponentPage:not(.searched) .search-title {
  opacity: 1;
  transform: scale(1.05);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.SearchComponentPage.searched .search-container {
  position: relative;
  top: 0;
  left: 0;
  transform: none;
  align-items: flex-start;
  margin-top: 0;
  transition-delay: 0.1s;
}

.SearchComponentPage.searched .search-title {
  font-size: 22px;
  margin-bottom: 15px;
  opacity: 1;
  transform: scale(1);
}

/* 表格动画效果 */
:deep(.el-table) {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.4s;
}

.SearchComponentPage.searched :deep(.el-table) {
  opacity: 1;
  transform: translateY(0);
}

/* 表格容器动画 */
.table-container {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.4s;
}

.SearchComponentPage.searched .table-container {
  opacity: 1;
  transform: translateY(0);
}


.SearchComponentPage:not(.searched) {
  overflow: hidden;
  height: 100%;
}


.SearchComponentPage:not(.searched) .search-box {
  justify-content: center;
  width: 100%;
}


.SearchComponentPage * {
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
  will-change: transform, opacity;
}

.el-table th,
.el-table td {
  padding: 8px 12px;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

:deep(.el-image-viewer__wrapper) {
  z-index: 3000 !important;
}

.photos-preview {
  padding: 5px;
}

.photos-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

:deep(.el-popover) {
  max-width: 350px;
  max-height: 250px;
}

:deep(.el-button .el-icon) {
  margin-right: 4px;
}
</style>