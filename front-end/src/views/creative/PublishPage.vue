<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/index.js'
// import { userLoginStatusService } from '@/api/user.js'
// import { uploadSegyService } from '@/api/segy.js'



const coordinateInput = ref('') // 绑定输入框的值

// // 处理输入框点击事件
// const handleInputClick = async () => {
//   try {
//     // 读取剪切板内容
//     const text = await navigator.clipboard.readText()
//     coordinateInput.value = text // 将剪切板内容填充到输入框
//   } catch (err) {
//     console.error('粘贴失败: ', err)
//     ElMessage.error('粘贴失败，请确保剪切板中有内容且已授予权限')
//   }
// }
// const visible = ref(false)

const router = useRouter()
const userStore = useUserStore()

const formRef = ref()
const isPreview = ref(false) // 控制是否处于预览状态
const previewData = ref({
  id: 1,
  userName: '',
  views: 0,
  likes: 0,
  image: ''
})

// 切换预览状态
const onPreview = async () => {
  // 先验证表单再预览
  const valid = await formRef.value.validate()
  if (!valid) return

  // 如果已经处于预览状态，则关闭预览
  if (isPreview.value) {
    isPreview.value = false
    return
  }

  isPreview.value = true
  previewData.value = {
    id: 1,
    userName: form.value.name || '匿名运动员',
    views: 0,
    likes: 0,
    image: form.value.file 
      ? URL.createObjectURL(form.value.file) 
      : require('@/assets/placeholder.png')
  }
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
  tittle: '',
  file:{},
  videofile: {}
})

// 表单校验规则
const rules = {
  name: [
    { required: true, message: '运动员名称不能为空', trigger: 'change' },
    {
      min: 1,
      max: 19,
      message: '运动员名称长度需要为 1-19 个字符',
      trigger: 'blur'
    }
  ],
  tittle: [
    { required: true, message: '视频标题不能为空', trigger: 'change' },
    {
      min: 1,
      max: 19,
      message: '视频标题长度需要为 1-19 个字符',
      trigger: 'blur'
    }
  ],
  detail: [
    { required: true, message: '视频简介不能为空', trigger: 'change' },
    {
      min: 1,
      max: 2900,
      message: '视频简介长度需要为 1-2900 个字符',
      trigger: 'blur'
    }
  ]
}

// 上传封面文件
const onUpload = async () => {
  await formRef.value.validate()

  loading.value = true

  const formData = new FormData()

  formData.append('name', form.value.name)
  formData.append('detail', form.value.detail)
  formData.append('tittle', form.value.tittle)
  formData.append('file', form.value.file)
  formData.append('videofile', form.value.videofile)
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
// 处理图片上传
const handleImageChange = (file, fileList) => {
  const allowed = ['jpg','jpeg','png'];
  const ext = file.name.split('.').pop().toLowerCase();

  if (!allowed.includes(ext)) {
    ElMessage.error('仅支持 JPG/JPEG/PNG 格式图片');
    ElMessage.error('仅支持 JPG/JPEG/PNG 格式图片');    ElMessage.error('仅支持 JPG/JPEG/PNG 格式图片');    ElMessage.error('仅支持 JPG/JPEG/PNG 格式图片');
    // 清除所有 ready 状态的文件
    imageUpload.value.clearFiles(['ready']);
    form.value.file = null;
    return;
  }

  form.value.file = fileList.length ? file.raw : null;
};

// 处理视频上传
const handleVideoChange = (file, fileList) => {
  const allowedExtensions = ['mp4', 'mov', 'avi'];
  const fileExtension = file.name.split('.').pop().toLowerCase();
  
  if (!allowedExtensions.includes(fileExtension)) {
    ElMessage.error('仅支持 MP4/MOV/AVI 格式视频');
    ElMessage.error('仅支持 MP4/MOV/AVI 格式视频');
    ElMessage.error('仅支持 MP4/MOV/AVI 格式视频');
    videoUpload.value.clearFiles(['ready']);
    form.value.videofile = null;
    return false;
  }

  if (fileList.length > 0) {
    form.value.videofile = file.raw;
  } else {
    form.value.videofile = null;
  }
  return true;
};

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
        <label>运动员名称：</label>
        <el-input v-model="form.name" type="text" placeholder="请输入运动员名称"></el-input>
      </el-form-item>
      <el-form-item prop="tittle">
        <label>视频标题：</label>
        <el-input v-model="form.tittle" type="textarea" placeholder="请输入视频标题"></el-input>
      </el-form-item>
      <el-form-item prop="detail">
        <label>视频简介：</label>
        <el-input v-model="form.detail" type="textarea" placeholder="请输入视频简介"></el-input>
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
        <div>封面图片文件：</div>
      </el-form-item>
      <el-form-item prop="file">
        <div>
          <el-upload
          
            ref="imageUpload"
            class="upload"
            drag
            :auto-upload="false"
            :on-change="handleImageChange"
            style="width: 600px"
            :limit="2"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
            <template #tip>
              <div class="el-upload__tip"> file with a size less than 10MB</div>
            </template>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item>
        <div>视频文件：</div>
      </el-form-item>
      <el-form-item prop="videofile">
        <div>
          <el-upload
            ref="videoUpload"
            class="upload"
            drag
            :auto-upload="false"
            :on-change="handleVideoChange"
            style="width: 600px"
            :limit="2"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
            <template #tip>
              <div class="el-upload__tip"> file with a size less than 1000MB</div>
            </template>
          </el-upload>
        </div>
      </el-form-item>
      <el-button @click="onUpload" type="success" style="background-color: #0d4799">
        上传
      </el-button>
      

      <el-button  @click="onPreview" type="success" style="background-color: #a5343c">
        预览效果
      </el-button>
    </el-form>
  </div>
  <div v-if="isPreview" class="preview-container">
    <div class="preview-grid">
      <el-card
              class="el-card"
              style="height: 450px; max-width: 480px; cursor: pointer"
              shadow="hover"
              :body-style="{ padding: '20px' }"
            >
              <div class="title-container" style="height: 350px; margin-bottom: 15px; display: flex; justify-content: center; align-items: center; background: #f5f5f5; border-radius: 8px; overflow: hidden;">
                <el-image
                  :src="previewData.image"
                  style="max-height: 100%; max-width: 100%; width: auto; height: auto; object-fit: contain; transition: transform 0.3s ease;"
                  :hover="{ transform: 'scale(1.05)' }"
                />
              </div>
              <div style="margin-bottom: 15px">
                <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 10px; color: #333"></h3>
                <div class="content2" style="font-size: 14px; color: #666; width: 100%; overflow: hidden; display: flex; flex-direction: column">
                  <div style="margin-bottom: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-shrink: 0">运动员：{{ previewData.userName }}</div>
                  <div style="display: flex; justify-content: space-between; gap: 20px; flex-shrink: 0">
                    <span>浏览：{{ previewData.views }}  </span>
                    <span>点赞: {{ previewData.likes }}</span>
                  </div>
                </div>
              </div>
            </el-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content2 {
  display: flex;
  justify-content: space-between;
  color: #7f7f7f;
  font-size: 13px;
}

.preview-container {
  position: fixed;
  top: 50%;
  right: 5%;
  transform: translateY(-50%);
  width: 300px;
  height: 70vh;
  max-height: 700px;
  z-index: 10;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.3) transparent;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-container::-webkit-scrollbar {
  width: 8px;
}

.preview-container::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.3);
  border-radius: 4px;
}

.preview-grid {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.preview-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s;
  cursor: pointer;
  width: 100%;
  max-width: 250px;

  &:hover {
    transform: scale(1.05);
  }

  .preview-card-image {
    width: 100%;
    height: 250px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .preview-card-content {
    padding: 15px;

    .preview-card-username {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      margin-bottom: 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .preview-card-stats {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: #888;
    }
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
</style>
