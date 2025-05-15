<template>
  <div class="SearchComponentPage">
    <el-input
      v-model="kw"
      placeholder="请输入关键词"
      class="kw-input"
      style="width: 300px; margin-right: 10px"
      @keyup.enter="search"
    />
    <el-button type="primary" @click="search">搜索</el-button>

    <el-table
      v-loading="loading"
      element-loading-text="加载中..."
      :data="results"
      style="width: 100%; margin-top: 20px; table-layout: fixed;"
      v-if="results.length"
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
    }
  },
  methods: {
    async search() {
      if (!this.kw) {
        ElMessage.warning('请输入关键词')
        return
      }
      this.loading = true
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
}

/* 均匀列间距 */
.el-table th,
.el-table td {
  padding: 8px 12px;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* 确保 el-image 预览浮层在最上层 */
:deep(.el-image-viewer__wrapper) {
  z-index: 3000 !important;
}

/* 照片集预览样式 */
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