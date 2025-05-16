<template>
  <div class="settings-container">
    <div class="content-wrapper" :class="{ 'centered': isCentered }">
      <div class="search-wrapper">
        <SearchComponent @search="handleSearch" ref="searchComponent" />
      </div>
    </div>
  </div>
</template>

<script>
import SearchComponent from '@/components/SearchComponent.vue'

export default {
  components: { SearchComponent },
  data() {
    return {
      isCentered: true
    }
  },
  methods: {
    handleSearch() {
      this.isCentered = false;
    }
  }
}
</script>

<style scoped>
.settings-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.content-wrapper {
  width: 100%;
  height: 100%;
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow-y: auto; /* 添加垂直滚动条 */
}

.content-wrapper.centered {
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-wrapper {
  width: 100%;
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  max-height: 100%; /* 确保内容不会超出父容器 */
}
</style>