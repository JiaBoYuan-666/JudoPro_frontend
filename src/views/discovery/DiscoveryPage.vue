<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { modelPageService } from '@/api/model.js'
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

const getPage = async () => {
  loading.value = true
  const res = await modelPageService(page.value, pageSize.value, searchStore.search)
  data.value = res.data.records
  total.value = res.data.total
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
            @click="router.push(`/model/${item.id}`)"
          >
            <el-card
              class="el-card"
              style="height: 450px; max-width: 480px; cursor: pointer"
              shadow="hover"
            >
              <div class="img-container">
                <img
                  :src="item.imageUrl"
                  alt="userpng"
                  style="
                    max-width: 100%;
                    height: auto;
                    position: relative;
                    top: 5px;
                    font-size: 18px;
                  "
                />
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
      <el-pagination
        v-model:page-size="pageSize"
        v-model:current-page="page"
        layout="prev, total, pager, jumper, next"
        :total="total"
        @current-change="getPage"
      />
    </el-main>
  </el-container>
</template>

<style scoped lang="scss">
.img-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-height: 300px;
  }
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
  align-items: center; //垂直居中
  display: flex;
  justify-content: space-between; //水平居中
}

.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}

.mb-4 {
  display: flex;
  flex-direction: column;
  justify-content: space-between; //水平居中
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

// .el-col {
//   border: 1px solid transparent; /* 初始边框设置为透明 */
//   transition:
//     border-color 0.3s,
//     border-radius 0.3s; /* 添加过渡效果 */

//   &:hover {
//     border-color: black; /* 鼠标悬浮时边框变为黑色 */
//     border-radius: 10px; /* 鼠标悬浮时边框变为圆角 */
//     cursor: pointer; /* 改变鼠标指针为手型 */
//   }
// }

.content2 {
  display: flex;
  justify-content: space-between;
  color: #7f7f7f;
  font-size: 13px;
}

.el-pagination {
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
}
</style>
