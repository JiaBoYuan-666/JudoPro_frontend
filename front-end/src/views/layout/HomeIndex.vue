<script setup>
import { Connection, Search, User } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { Menu as IconMenu, Location, Setting, Avatar, CircleCloseFilled } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { useSearchStore, useUserStore } from '@/stores/index.js'
import JudoModel3D from '@/components/JudoModel3D.vue'
import Deepseek from '@/components/deepseek.vue'

const isCollapse = ref(true)
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const modelName = ref('')
const drawer = ref(false)
const modelDrawer = ref(false)
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
      <div class="logo" style="display: flex; align-items: center; gap: 10px; margin-left: 20px">
  <img
    @click="router.push('/')"
    src="@/assets/学校logo4.png"
    alt="logo"
    style="
      cursor: pointer;
      height: 8vh;
      width: auto;
    "
  />
  <span @click="router.push('/')" style="font-size: 24px; font-weight: bold; color: #ffffff; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">Judopro智训平台</span>
</div>
      <!-- <div class="search-box" style="position: relative; left: 100px">
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
      </div> -->
      <div class="user-box" style="margin-left: 10px">
        <div v-if="userStore.user">
          {{ userStore.user.name }}，您好
          <el-button type="danger" style="background: linear-gradient(45deg, #ff5722, #ff9800); border: none; font-weight: bold;" @click="userStore.removeUser()">退出登录</el-button>
        </div>
        <div v-else>
          未登录
          <el-button type="success" style="background: linear-gradient(45deg, #4caf50, #8bc34a); border: none; font-weight: bold;" @click="router.push('/login')">立即登录</el-button>
        </div>
      </div>

      <div class="right-btn-group">
        <el-button 
          type="primary" 
          @click="drawer = true"
          class="ai-assistant-btn"
        >
          AI助手
        </el-button>
        <el-button 
          type="primary" 
          @click="modelDrawer = true"
          class="model-btn"
        >
          3D柔道模型
        </el-button>
      </div>
  <el-drawer v-model="drawer" size="50%":show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">柔道智能助手</h4>
      <el-button type="danger" @click="close">
        <CircleCloseFilled />
        关闭
      </el-button>
    </template>
    <div class="drawer-content">
      <div class="assistant-section">
        <Deepseek />
      </div>
    </div>
  </el-drawer>
  <el-drawer v-model="modelDrawer" size="50%" :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">3D柔道模型展示</h4>
      <el-button type="danger" @click="close">
        <CircleCloseFilled />
        关闭
      </el-button>
    </template>
    <div class="drawer-content">
      <div class="model-section">
        <JudoModel3D class="judo-model" />
      </div>
    </div>
  </el-drawer>
      <!-- <el-menu
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

          </el-sub-menu> -->

      <!-- </el-menu> -->
    </el-header>
    <el-container>
      <el-aside>
        <h5 class="mb-2"></h5>
        <el-menu
  router
  :default-active="route.path"
  class="el-menu-vertical-demo"
    @close="handleClose"
>
  <!-- 简介 -->
  <el-menu-item index="/intro">
    <el-icon><Avatar /></el-icon>
    <span>简介</span>
  </el-menu-item>
  <!-- 创作中心 -->
  <el-sub-menu index="1">
    <template #title>
      <el-icon><location /></el-icon>
      <span>创作中心</span>
    </template>
    <el-menu-item-group style="margin-top: 0; background: #e8f4ff;">
      <el-menu-item index="/creative/publish">发布</el-menu-item>
      <!-- <el-menu-item index="/creative/draft">草稿</el-menu-item> -->
    </el-menu-item-group>

    <!-- <el-sub-menu index="1-4">
      <template #title>
        <span>联系客服</span>
      </template>
      <el-menu-item disabled>没有客服</el-menu-item>
    </el-sub-menu> -->
  </el-sub-menu>

  <!-- 发现 -->
  <el-menu-item index="/discovery">
    <el-icon><icon-menu /></el-icon>
    <span>摔跤视频解析</span>
  </el-menu-item>

  <!-- 个人中心 -->
  <!-- <el-menu-item index="/user">
    <el-icon><User /></el-icon>
    <span>个人中心</span>
  </el-menu-item> -->

  <!-- 检索 -->
  <el-menu-item index="/settings">
    <el-icon><setting /></el-icon>
    <span>检索运动员</span>
  </el-menu-item>

  <!-- 登录按钮，仅在未登录时显示 -->
  <el-menu-item
    index="/login"
    :disabled="userStore.user"
  >
    <el-icon><Connection /></el-icon>
    <span>立即登录</span>
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
  overflow: hidden;
  background: #f5f9ff;
}
.el-row {
  height: 100%;
}
.el-header {
  background: linear-gradient(135deg, #0066cc, #0099ff);
  color: #ffffff;
  height: 10vh;
  align-items: center;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 2px 12px rgba(0, 102, 204, 0.3);
  position: relative;
}
.right-btn-group {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-right: 40px;
}
.ai-assistant-btn, .model-btn {
  font-size: 18px;
  font-weight: bold;
  padding: 15px 25px;
  background: linear-gradient(45deg, #ff5722, #ff9800);
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(255, 87, 34, 0.5);
  transition: all 0.3s ease;
  color: #fff;
}

.ai-assistant-btn:hover, .model-btn:hover {
  background: linear-gradient(45deg, #0066cc, #0099ff);
  transform: scale(1.05);
  color: #fff;
}
.model-btn {
  font-size: 18px;
  font-weight: bold;
  padding: 15px 25px;
  background: linear-gradient(45deg, #009688, #4caf50);
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 150, 136, 0.5);
  transition: all 0.3s ease;
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
  background: #e8f4ff;
  width: 235px;
  max-height: 90vh;
  border-right: 1px solid rgba(0, 102, 204, 0.2);
  box-shadow: 2px 0 10px rgba(0, 102, 204, 0.1);
}
.el-main {
  background-color: #f5f9ff;
  max-height: 90vh;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 235 px;
  min-height: 400px;
}

.el-menu-vertical-demo {
  border-right: none;
  background: #e8f4ff;
}

.el-menu-item {
  transition: all 0.3s ease;
  margin: 0;
  padding: 0 20px;
}

.el-menu-item:hover, .el-menu-item.is-active {
  background: rgba(0, 102, 204, 0.15);
  color: #0066cc !important;
  font-weight: bold;
  border-left: 3px solid #0066cc;
}

.el-sub-menu__title:hover {
  background: rgba(0, 102, 204, 0.1);
  color: #0066cc;
}

.el-sub-menu__title {
  background: #e8f4ff;
  margin: 0;
  padding: 0 20px;
}

.el-menu-item-group__title {
  padding: 0;
  background: #e8f4ff;
}

.el-menu--popup {
  background: #e8f4ff;
  padding: 0;
  margin: 0;
}

.el-menu--popup .el-menu-item {
  background: #e8f4ff;
  margin: 0;
  padding: 0 20px;
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
    border-radius 0.3s,
    transform 0.3s; /* 添加过渡效果 */

  &:hover {
    border-color: #0066cc; /* 鼠标悬浮时边框变为蓝色 */
    border-radius: 10px; /* 鼠标悬浮时边框变为圆角 */
    cursor: pointer; /* 改变鼠标指针为手型 */
    transform: translateY(-3px); /* 添加上浮效果，增强动感 */
    box-shadow: 0 5px 15px rgba(255, 87, 34, 0.2); /* 添加阴影效果 */
  }
}

.ai-assistant-btn:hover {
  background: linear-gradient(45deg, #0066cc, #0099ff);
  transform: scale(1.05);
}

/* 抽屉内容样式 */
.drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.section-title {
  color: #0066cc;
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 102, 204, 0.2);
}

.model-section {
  flex: 0 0 auto;
  height: 500px;
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 102, 204, 0.2);
}

.judo-model {
  width: 100%;
  height: 100%;
}

.assistant-section {
  flex: 1;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 102, 204, 0.2);
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
