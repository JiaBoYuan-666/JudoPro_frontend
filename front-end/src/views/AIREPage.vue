<template>
  <div class="analysis-container">
    <dpanalysis :athlete-meta="processedData" />
  </div>
</template>

<script>
import dpanalysis from '@/components/dpanalysis.vue'

export default {
  name: 'AIREPage',
  components: { dpanalysis },
  computed: {
    // 在computed属性中添加完整校验逻辑
    processedData() {
      try {
        const rawData = decodeURIComponent(this.$route.params.athleteData || '');
        const data = JSON.parse(rawData || '{}');
        
        // 增强空值处理和类型转换
        return {
          name: data.NAME || data.name || '未知运动员',
          age: data.AGE ? parseInt(data.AGE.match(/\d+/)?.[0] || 0) : data.age || '未知',
          height: data.HEIGHT ? parseInt(data.HEIGHT) || '未知' : data.height || '未知',
          weight: data.KG ? parseInt(data.KG) || '未知' : data.weight || '未知',
          nationality: data.LOCATION || data.nationality || '未指定',
          image: data.IMAGE || '',
          isValid: !!(data.NAME || data.name)
        };
      } catch (e) {
        console.error('数据解析失败:', e);
        return { isValid: false };
      }
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 800px;
  margin: 20px auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>