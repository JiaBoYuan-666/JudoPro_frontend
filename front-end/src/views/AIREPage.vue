<template>
  <div class="container">
    <h2>运动员详细信息</h2>
    <pre>{{ athleteData }}</pre>
  </div>
</template>

<script>
export default {
  name: 'AIREPage',
  computed: {
    athleteData() {
      try {
        return JSON.parse(this.$route.params.athleteData)
      } catch {
        return {}
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