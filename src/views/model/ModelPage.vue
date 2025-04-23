<script setup>
import Clothes3D from '@/components/Clothes3D.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getModelService } from '@/api/model.js'

const route = useRoute()
const data = ref()

const getModel = async () => {
  const res = await getModelService(route.params.id)
  data.value = res.data.data
}

getModel()
</script>

<template>
  <div class="model-page">
    <Clothes3D :modelUrl="data.modelUrl" />
  </div>
</template>

<style scoped lang="scss"></style>
