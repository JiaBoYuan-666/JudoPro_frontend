<script>
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()

    const goBack = () => {
      router.back()
    }

    return {
      goBack
    }
  }
}

</script>

<template>
<el-button type="primary"  @click=goBack  >
    返回上一页
</el-button>
新闻页    
<div>
    <h1>新闻题目</h1>
</div>
<div>
    <p>新闻内容</p>
</div>
</template>

<style>

</style>