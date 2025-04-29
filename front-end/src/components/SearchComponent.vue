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
    </el-table>
  </div>
</template>

<script>
import request from '@/utils/request.js'


import { useRouter } from 'vue-router'

export default {
  name: 'SearchComponentPage',
  components: { ElImage },
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
      try {
        const { data: res } = await request.get('query/kw', {
          params: { pageNo: 1, pageSize: 8, kw: this.kw },
        })
        if (res && res.success) {
          this.results = res.data || []
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
        name: 'AIREPage',
        params: { athleteData: JSON.stringify(row) }
      })
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
</style>