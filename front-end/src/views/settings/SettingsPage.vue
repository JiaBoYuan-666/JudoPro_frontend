<template>
  <div class="settings-container">
    <h2 class="page-title">运动员信息检索</h2>
    <div class="search-wrapper">
      <SearchComponent />
    </div>
  </div>
</template>

<script>
import SearchComponent from '@/components/SearchComponent.vue'

export default {
  components: { SearchComponent }
}
</script>

<style scoped>
.settings-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
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
}
</style>