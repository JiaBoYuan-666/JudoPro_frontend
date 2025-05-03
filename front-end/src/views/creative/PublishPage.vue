<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/index.js'
// import { userLoginStatusService } from '@/api/user.js'
// import { uploadSegyService } from '@/api/segy.js'
import { ElButton } from 'element-plus'
import { CircleCloseFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus' // 用于提示用户

const coordinateInput = ref('') // 绑定输入框的值

// 处理输入框点击事件
const handleInputClick = async () => {
  try {
    // 读取剪切板内容
    const text = await navigator.clipboard.readText()
    coordinateInput.value = text // 将剪切板内容填充到输入框
  } catch (err) {
    console.error('粘贴失败: ', err)
    ElMessage.error('粘贴失败，请确保剪切板中有内容且已授予权限')
  }
}
const visible = ref(false)

const router = useRouter()
const userStore = useUserStore()

const formRef = ref()
const isPreview = ref(false) // 控制是否处于预览状态
const previewData = ref({
  name: '',
  detail: '',
  modelUrl: '',
  views: 0,
  likes: 0,
  imageUrl: '',
  backUp: {}
})

// 切换预览状态
const onPreview = () => {
  isPreview.value = !isPreview.value
}
const loading = ref(false)

// // 用户登录状态验证
// const loginStatusCheck = async () => {
//   await userLoginStatusService().catch((res) => {
//     if (res.response.status === 401) {
//       ElMessage.error('登录过期，请重新登录')
//       userStore.removeUser()
//       router.push('/login')
//     } else {
//       ElMessage.error('未知错误')
//     }
//   })
// }
// if (!userStore.user) {
//   ElMessage.error('请登录')
//   router.replace('/login')
// } else {
//   loginStatusCheck()
// }

const form = ref({
  name: '',
  detail: '',
  file: {}
})

// 表单校验规则
const rules = {
  name: [
    { required: true, message: '工程名称不能为空', trigger: 'change' },
    {
      min: 1,
      max: 19,
      message: '工程名称长度需要为 1-19 个字符',
      trigger: 'blur'
    }
  ],
  detail: [
    { required: true, message: '工程描述不能为空', trigger: 'change' },
    {
      min: 1,
      max: 2900,
      message: '工程描述长度需要为 1-2900 个字符',
      trigger: 'blur'
    }
  ]
}

// 上传 SEG-Y 文件
const onUpload = async () => {
  await formRef.value.validate()

  loading.value = true

  const formData = new FormData()

  formData.append('name', form.value.name)
  formData.append('detail', form.value.detail)
  
  formData.append('file', form.value.file)

  // 输出 FormData 内容进行调试
  for (let [key, value] of formData.entries()) {
    console.log(key, value)
  }

  // const res = await uploadSegyService(formData).catch((res) => {
  //   loading.value = false
  //   if (res.response.status === 401) {
  //     ElMessage.error('登录过期，请重新登录')
  //     userStore.removeUser()
  //     router.push('/login')
  //   } else {
  //     ElMessage.error('未知错误')
  //   }
  // })
  loading.value = false
  if (res.data?.code === 0) {
    ElMessage.success('上传成功')
    router.push(`/waiting/${res.data.data.parseId}`)
  } else ElMessage.error(res.data?.message)
}

// 处理拖拽上传
const handleFileChange = (file, fileList) => {
  if (fileList.length > 1) {
    fileList.splice(0, 1)
  }

  // const fileExtension = file.name.split('.').pop().toLowerCase() // 获取文件后缀名
  // if (!'.segy'.includes(fileExtension)) {
  //   // 不符合要求，清空文件列表
  //   fileList.splice(0) // 清空上传组件的文件列表
  //   ElMessage.error('仅支持上传 SEG-Y 文件')

  //   return
  // }

  if (fileList.length > 0) {
    form.value.file = file.raw // 存储唯一文件对象
  } else {
    form.value.file = null // 如果没有文件，清空变量
  }
}

// 接收子组件传递的位置信息

</script>
<template>
  <div class="publish-container" v-loading="loading" element-loading-text="上传中">
    <div class="publish-page">解析并保存</div>
    <el-form
      class="publish-form"
      ref="formRef"
      :model="form"
      :rules="rules"
      :class="{ 'form-slide': isPreview }"
      style="width: 600px"
    >
      <el-form-item prop="name">
        <label>工程名称：</label>
        <el-input v-model="form.name" type="text" placeholder="请输入工程名称"></el-input>
      </el-form-item>
      <el-form-item prop="detail">
        <label>工程描述：</label>
        <el-input v-model="form.detail" type="textarea" placeholder="请输入工程描述"></el-input>
      </el-form-item>
      <!-- <el-form-item prop="position">
        <label>坐标：</label>
        <el-input
          v-model="coordinateInput"
          type="text"
          placeholder="请输入坐标"
          @click="handleInputClick"
        ></el-input>
      </el-form-item> -->
      
      <el-form-item>
        <div>SEG-Y 文件：</div>
      </el-form-item>
      <el-form-item>
        <div>
          <el-upload
            class="upload"
            drag
            :auto-upload="false"
            :on-change="handleFileChange"
            style="width: 600px"
            :limit="2"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
            <template #tip>
              <div class="el-upload__tip">SEG-Y file with a size less than 100MB</div>
            </template>
          </el-upload>
        </div>
      </el-form-item>
      <el-button @click="onUpload" type="success" style="background-color: #0d4799">
        解析并保存
      </el-button>
      

      <el-button  @click="onPreview" type="success" style="background-color: #a5343c">
        预览效果
      </el-button>
    </el-form>
  </div>
  <div v-if="isPreview" class="el-card-preview">
    <div>首页预览效果（单击卡片预览模型效果）：</div>
    <el-card
      style="margin-left: 2vw; height: 450px; max-width: 20vw; cursor: pointer"
      shadow="hover"
    >
      <div class="img-container">
        <img
          :src="previewData.imageUrl"
          style="max-width: 100%; height: auto; position: relative; top: 5px; font-size: 18px"
        />
      </div>
      <template #footer>
        <div>{{ form.name }}</div>

        <div class="content2">
          <div>作者：{{ userStore.user.name }}</div>
          <div>浏览: 0</div>
          <div>点赞: 0</div>
        </div>
      </template>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.content2 {
  display: flex;
  justify-content: space-between;
  color: #7f7f7f;
  font-size: 13px;
}
.img-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    max-height: 300px;
  }
}
.publish-container {
  height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.publish-page {
  font-size: 24px;
  color: #333;
  text-align: center;
  margin: 20px 0;
  font-weight: bold;
}

.publish-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  transition: transform 0.5s ease; /* 动画过渡 */
}

.form-slide {
  transform: translateX(-300px); /* 控制向左滑动 */
}

.el-button {
  background-color: #409eff;
  color: white;
  transition: background-color 0.3s;
}

.el-button:hover {
  background-color: #66b1ff;
}

.personal-center {
  font-size: 18px;
  color: #007bff;
  text-decoration: underline;
  margin: 10px 0;
  cursor: pointer;
  text-align: center;
}
.el-card-preview {
  position: absolute;
  right: 20px; /* 控制预览卡片的位置 */
  top: 20px;
  transition: transform 0.5s ease;
  transform: translate(-250px, 200px);
}

.is-preview .el-card-preview {
  transform: translate(0, 0);
}
</style>
