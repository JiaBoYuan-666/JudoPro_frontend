<script setup>
import { Connection, Search, User } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { Menu as IconMenu, Location, Setting } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { useSearchStore, useUserStore } from '@/stores/index.js'

const isCollapse = ref(true)
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const modelName = ref('')

const searchStore = useSearchStore()
const onSearch = () => {
  if (route.path !== '/discovery') router.push('/discovery')
  searchStore.setSearch(modelName.value)
}

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}

const handleSelect = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>

<template>
  <el-container>
    <el-header>
      <div class="logo">
        <img
          @click="router.push('/')"
          src="@/assets/学校logo4.png"
          alt="logo"
          style="
            cursor: pointer;
            height: 8vh;
            width: auto;
            position: relative;
            bottom: 0;
            left: 50px;
          "
        />
      </div>
      <div class="search-box" style="position: relative; left: 100px">
        <el-input
          v-model="modelName"
          style="width: 450px; height: 55px"
          placeholder="探索更多内容"
          class="input-with-select"
        >
          <template #append>
            <el-button @click="onSearch" :icon="Search" />
          </template>
        </el-input>
      </div>
      <div class="user-box" style="margin-left: 10px">
        <div v-if="userStore.user">
          {{ userStore.user.name }}，您好
          <el-button type="danger" @click="userStore.removeUser()">退出登录</el-button>
        </div>
        <div v-else>
          未登录
          <el-button type="success" @click="router.push('/login')">立即登录</el-button>
        </div>
      </div>
      <el-menu
        default-active="1"
        class="el-menu-demo"
        mode="horizontal"
        :ellipsis="false"
        @select="handleSelect"
      >
        <el-menu-item index="0"> </el-menu-item>
        <el-menu-item index="1">联系我们</el-menu-item>
        <el-sub-menu index="2">
          <template #title>更多内容</template>
          <el-menu-item index="2-1">
            <a href="https://www.baidu.com" target="_blank" rel="noopener noreferrer">百度</a>
          </el-menu-item>
          <el-menu-item index="2-2">
            <a href="https://www.bilibili.com/" target="_blank" rel="noopener noreferrer">b站</a>
          </el-menu-item>
          <el-menu-item index="2-3">
            <a href="https://www.bilibili.com/" target="_blank" rel="noopener noreferrer">b站</a>
          </el-menu-item>
          <el-sub-menu index="2-4">
            <template #title>更多的更多</template>
            <el-menu-item index="2-4-1">链接</el-menu-item>
            <el-menu-item index="2-4-2">链接</el-menu-item>
            <el-menu-item index="2-4-3">链接</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
      </el-menu>
    </el-header>
    <el-container>
      <el-aside>
        <h5 class="mb-2"></h5>
        <el-menu
          router="router"
          :default-active="route.path"
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-sub-menu index="1">
            <template #title>
              <el-icon><location /></el-icon>
              <span>创作中心</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/creative/publish">发布</el-menu-item>
              <el-menu-item index="/creative/draft">草稿</el-menu-item>
            </el-menu-item-group>

            <el-sub-menu index="1-4">
              <template #title><span>联系客服</span></template>
              <el-menu-item>没有客服</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-menu-item index="/discovery">
            <el-icon><icon-menu /></el-icon>
            <template #title>发现</template>
          </el-menu-item>
          <el-menu-item index="/user">
            <el-icon><User /></el-icon>
            <template #title>个人中心</template>
          </el-menu-item>
          <el-menu-item index="/settings">
            <el-icon><setting /></el-icon>
            <template #title>设置</template>
          </el-menu-item>
          <el-menu-item index="/login" :disabled="userStore.user">
            <el-icon><Connection /></el-icon>
            <template #title>立即登录</template>
          </el-menu-item>
        </el-menu>
        <!-- 老版菜单
         <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
          <el-radio-button :value="false">展开</el-radio-button>
          <el-radio-button :value="true">&#60;&#60;</el-radio-button>
        </el-radio-group>
        <el-menu
          router="router"
          :default-active="route.path"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-sub-menu index="1">
            <template #title>
              <el-icon><location /></el-icon>
              <span>导航</span>
            </template>
            <el-menu-item-group>
              <template #title><span>创作中心</span></template>
              <el-menu-item index="/creative/publish">发布</el-menu-item>
              <el-menu-item index="/creative/draft">草稿</el-menu-item>
            </el-menu-item-group>

            <el-sub-menu index="1-4">
              <template #title><span>联系客服</span></template>
              <el-menu-item>没有客服</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-menu-item index="/discovery">
            <el-icon><icon-menu /></el-icon>
            <template #title>发现</template>
          </el-menu-item>
          <el-menu-item index="/user">
            <el-icon><User /></el-icon>
            <template #title>个人中心</template>
          </el-menu-item>
          <el-menu-item index="/settings">
            <el-icon><setting /></el-icon>
            <template #title>设置</template>
          </el-menu-item>
          <el-menu-item index="/login" :disabled="userStore.user">
            <el-icon><Connection /></el-icon>
            <template #title>立即登录</template>
          </el-menu-item>
        </el-menu> -->
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.el-container {
  height: 100%;
}
.el-row {
  height: 100%;
}
.el-header {
  background-color: #ffffff;
  color: #7f7f7f;
  height: 10vh;
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
  background-color: #ffffff;
  width: 235px;
  max-height: 90vh;
}
.el-main {
  background-color: #f7f7f7;
  max-height: 90vh;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 235 px;
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

.el-col {
  border: 1px solid transparent; /* 初始边框设置为透明 */
  transition:
    border-color 0.3s,
    border-radius 0.3s; /* 添加过渡效果 */

  &:hover {
    border-color: black; /* 鼠标悬浮时边框变为黑色 */
    border-radius: 10px; /* 鼠标悬浮时边框变为圆角 */
    cursor: pointer; /* 改变鼠标指针为手型 */
  }
}
.content2 {
  display: flex;
  justify-content: space-between;
}
.el-pagination {
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
}
</style>
