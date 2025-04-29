<script setup>
import { ref } from 'vue'
import $ from 'jquery'
import { userLoginService, userRegisterService } from '@/api/user.js'
import Source1 from '@/components/SourceOne.vue'
import { useUserStore } from '@/stores/index.js'
import { useRouter } from 'vue-router'
import { ElLoading } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const user = ref({
  data: null,
  username: '',
  password: '',
  name: '',
  phone: ''
})

const rules = {
  username: [
    { required: true, message: '用户名不能为空', trigger: 'change' },
    {
      min: 5,
      max: 10,
      message: '用户名长度需要为 5-10 个字符',
      trigger: 'blur'
    },
    { pattern: /^\S+$/, message: '用户名需要为非空字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'change' },
    {
      min: 6,
      max: 15,
      message: '密码长度需要为 6-15 个字符',
      trigger: 'blur'
    },
    { pattern: /^\S+$/, message: '密码需要为非空字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '昵称不能为空', trigger: 'change' },
    {
      min: 1,
      max: 10,
      message: '昵称长度需要为 1-10 个字符',
      trigger: 'blur'
    },
    { pattern: /^\S+$/, message: '昵称需要为非空字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '手机号不能为空', trigger: 'change' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ]
}

// 处理登录/注册按钮点击事件
// 请求类型：0-无，1-登录，2-注册
const requestType = ref(0)
const getRandomType = () => {
  return Math.floor(Math.random() * 2) ? 'blockPuzzle' : 'clickWord'
}
const onLogin = () => {
  if (user.value.username === '' || user.value.password === '') {
    ElMessage.error('用户名或密码不能为空')
    return
  }
  requestType.value = 1
  onShow(getRandomType())
}
const onRegister = async () => {
  await form.value.validate()
  requestType.value = 2
  onShow(getRandomType())
}

const requestLogin = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '正在登录',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  const res = await userLoginService(user.value).catch((res) => {
    ElMessage.error(res.response.data.message)
  })
  requestType.value = 0
  loading.close()

  if (res.data.code === 0) {
    userStore.setUser(res.data.data)
    router.replace('/')
    ElMessage.success(res.data.message)
  } else ElMessage.error(res.data.message)
}

const form = ref()
const requestRegister = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '正在注册',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  const res = await userRegisterService(user.value).catch((res) => {
    ElMessage.error(res.response.data.message)
  })
  requestType.value = 0
  loading.close()

  if (res.data.code === 0) ElMessage.success(res.data.message)
  else ElMessage.error(res.data.message)
}

// 验证码相关
import Verify from '@/components/Verify.vue'

const verify = ref(null)
const captchaType = ref('')
const onShow = (type) => {
  captchaType.value = type
  verify.value.show()
}
const handleSuccess = (res) => {
  // 保存二次校验参数
  user.value.data = res
  switch (requestType.value) {
    case 0:
      return
    case 1:
      requestLogin()
      break
    case 2:
      requestRegister()
      break
    default:
      break
  }
}
let flag = true
const mySwitch = () => {
  if (flag) {
    $('.pre-box').css('transform', 'translateX(100%)')
    $('.pre-box').css('background-color', '#c9e0ed')
    $('img').attr('src', new URL('@/assets/学校logo.jpeg', import.meta.url).href)
    flag = false
  } else {
    $('.pre-box').css('transform', 'translateX(0%)')
    $('.pre-box').css('background-color', '#edd4dc')
    $('img').attr('src', new URL('@/assets/学校logo.jpeg', import.meta.url).href)
    flag = true
  }
}
</script>

<template>
  <source1 />
  <el-button @click="router.push('/')" type="danger" style="margin: 20px 20px">返回首页</el-button>
  <div class="top-container">
  </div>
  <div class="box">
    <div class="container1">
      <h1 class="title">登录</h1>
      <el-input
        class="input1"
        v-model.trim="user.username"
        style="width: 300px"
        placeholder="请输入用户名"
        size="large "
      />

      <el-input
        class="input2"
        v-model.trim="user.password"
        style="width: 300px; height: 40px; margin-top: 20px"
        type="password"
        placeholder="请输入密码"
        show-password
      />
      <div class="button-container">
        <div class="register-btn">
          <el-button type="primary" style="margin-top: 20px" @click="mySwitch">去注册</el-button>
        </div>
        <div class="login-btn">
          <el-button @click="onLogin" type="primary" style="margin-top: 20px">登录</el-button>
        </div>
      </div>
    </div>
    <div class="container2">
      <h1 class="title">注册</h1>
      <el-form ref="form" :rules="rules" :model="user">
        <el-form-item prop="username">
          <el-input
            class="input1"
            v-model.trim="user.username"
            style="width: 300px"
            placeholder="请输入用户名"
            size="large "
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            class="input2"
            v-model.trim="user.password"
            style="width: 300px; height: 40px; margin-top: 20px"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>

        <el-form-item prop="name">
          <el-input
            class="input1"
            v-model.trim="user.name"
            style="width: 300px; height: 40px; margin-top: 20px"
            type="text"
            placeholder="请输入昵称"
          />
        </el-form-item>

        <el-form-item prop="phone">
          <el-input
            class="input1"
            v-model.trim.number="user.phone"
            style="width: 300px; height: 40px; margin-top: 20px"
            type="text"
            placeholder="请输入手机号"
          />
        </el-form-item>
      </el-form>
      <div class="button-container">
        <div class="register-btn">
          <el-button @click="onRegister" type="primary" style="margin-top: 20px">注册</el-button>
        </div>
        <div class="login-btn">
          <el-button type="primary" style="margin-top: 20px" @click="mySwitch">去登录</el-button>
        </div>
      </div>
    </div>
    <div class="pre-box">
      <h1>WELCOME</h1>
      <div class="img-box">
        <img src="@/assets/学校logo.jpeg" alt="" />
      </div>
    </div>
  </div>
  <!-- 验证码 -->
  <Verify
    @success="handleSuccess"
    mode="pop"
    :captchaType="captchaType"
    :imgSize="{ width: '400px', height: '200px' }"
    ref="verify"
  ></Verify>
</template>

<style scoped lang="scss">
.top-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -60px;
}

.container1 {
  position: absolute; // 使用绝对定位
  top: 50%; // 垂直居中
  left: 75%; // 水平居中
  transform: translate(-50%, -50%); // 通过平移调整其位置
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.container2 {
  position: absolute; // 使用绝对定位
  top: 50%; // 垂直居中
  left: 25%; // 水平居中
  transform: translate(-50%, -50%); // 通过平移调整其位置
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.total-title {
  font-size: 50px; // 设置字体大小
  //标题水平居中
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: rgb(253, 253, 253);
}

.title {
  font-size: 35px; // 设置字体大小
  margin-bottom: 50px; // 标题与输入框之间的间距
  color: rgb(253, 253, 253);
}

.button-container {
  display: flex; // 设置为 Flexbox 容器
  justify-content: center; // 按钮水平居中
  gap: 20px; // 按钮之间的间距
}

source1 {
  position: relative; // 确保 source1 有相对定位（如果需要）
}

.box {
  width: 50%;
  height: 600px;
  margin: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  border: 1px solid #ccc;
  box-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  //背景透明度
  background: linear-gradient(to right, rgba(222, 161, 161, 0.8), rgba(152, 206, 227, 0.8));
}

.pre-box {
  width: 50%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 4px;
  background-color: rgb(243, 209, 209);
  box-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
  transition: 0.5s ease-in-out;
}

.pre-box h1 {
  color: white;
  text-align: center;
  margin-top: 150px;
  text-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
}

.img-box {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  margin: 20px auto;
}

.img-box img {
  width: 100%;
  height: 100%;
}
</style>
