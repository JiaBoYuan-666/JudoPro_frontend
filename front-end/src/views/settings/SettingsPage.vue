<template>
  <div class="settings-container">
    <transition name="fade">
      <h2 v-if="!isCentered" class="page-title">运动员信息检索</h2>
    </transition>
    
    <div class="search-wrapper" :class="{ 'centered': isCentered }">
      <SearchComponent @search="handleSearch" ref="searchComponent" />
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
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-title {
  margin-bottom: 20px;
  color: #333;
  font-weight: 500;
}

.search-wrapper {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.5s ease;
}

.search-wrapper.centered {
  margin: auto 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  transform: translateY(-10%);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>