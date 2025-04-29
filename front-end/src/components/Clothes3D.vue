<script setup>
//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
//导入three.js
import * as THREE from 'three'
//引入性能监控插件
// import Stats from 'three/examples/jsm/libs/stats.modules'
//导入hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
//导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { ref, onMounted, defineProps } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
// 路由切换时触发刷新操作
router.afterEach((to, from) => {
  if (from && from.name !== to.name) {
    // 如果从不同页面切换过来，则刷新当前页面
    setTimeout(() => {
      location.reload()
    }, 100)
  }
})

// 处理 “上衣/裙子” 按钮逻辑
const btn0 = ref()
const btn1 = ref()
const onClick = (num) => {
  btn0.value.classList.remove('active')
  btn1.value.classList.remove('active')
  if (num === 0) btn0.value.classList.add('active')
  if (num === 1) btn1.value.classList.add('active')
}

const props = defineProps({
  modelUrl: {
    type: String,
    required: true
  }
})
// 引入资源路径
const modelPath = new URL('@/assets/两套.gltf', import.meta.url).href
const backgroundPath = new URL('@/assets/autumn_field_puresky_4k.hdr', import.meta.url).href
const addTextToMesh = (text, mesh) => {
  // 创建 Canvas
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  // 设置 Canvas 大小
  canvas.width = 50
  canvas.height = 50

  // 设置文字样式
  ctx.fillStyle = '#000000' // 文字颜色
  ctx.font = 'Bold 1000px Arial' // 文字字体和大小
  ctx.textAlign = 'center' // 文字对齐方式
  ctx.textBaseline = 'middle' // 文字基线对齐方式

  // 在 Canvas 上绘制文字
  ctx.clearRect(0, 0, canvas.width, canvas.height) // 清除画布
  ctx.fillText(text, canvas.width / 2, canvas.height / 2) // 在画布中央绘制文字

  // 创建纹理
  const texture = new THREE.CanvasTexture(canvas)

  // 创建材质并将纹理应用到材质
  const textMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide
  })

  // 将材质应用到模型的 Mesh 上
  mesh.material = textMaterial
}

// 示例：添加文字到上衣的 Mesh
onMounted(() => {
  show()

  // 添加文字输入和按钮点击监听事件
  document.getElementById('submitText').addEventListener('click', function () {
    const inputText = document.getElementById('textInput').value // 获取输入框中的文字
    if (inputText) {
      const mesh = model.children[0].children[1] // 上衣的 Mesh 对象
      addTextToMesh(inputText, mesh) // 调用函数将文字添加到模型
    }
  })
})

const show = () => {
  // 实例化加载器
  const loader = new GLTFLoader()
  const percentDiv = document.getElementById('per') // 获取进度条元素
  // 加载gltf文件
  loader.load(
    modelPath,
    (gltf) => {
      console.log(gltf) // 打印出gltf文件内容

      // 模型位置自适应
      const model = gltf.scene
      // 计算包围盒
      const box = new THREE.Box3().setFromObject(model)
      const size = new THREE.Vector3()
      box.getSize(size) // 获取模型尺寸
      const center = new THREE.Vector3()
      box.getCenter(center) // 获取模型的中心点
      // 自动缩放模型，使其最大尺寸为 1 (适应相机视野)
      const maxSize = Math.max(size.x, size.y, size.z)
      const scale = 1 / maxSize
      model.scale.set(scale, scale, scale)
      // 将模型居中
      model.position.x -= center.x * scale
      model.position.y -= center.y * scale
      model.position.z -= center.z * scale

      scene.add(model) // 将场景添加到场景中
      document.getElementById('container').style.display = 'none'

      // 找到场景中的mesh对象
      const mesh = model.children[0].children[1] //上衣
      const mesh2 = model.children[0].children[0] //裙子

      // 用于跟踪当前选择的 mesh
      let currentMesh = mesh // 默认选择 mesh

      // 按钮点击事件设置
      document.getElementById('top').addEventListener('click', function () {
        currentMesh = mesh // 选择 mesh
      })

      document.getElementById('skirt').addEventListener('click', function () {
        currentMesh = mesh2 // 选择 mesh2
      })

      // 通过UI按钮与3D场景交互，改变当前选择的mesh颜色
      document.getElementById('red').addEventListener('click', function () {
        if (currentMesh && currentMesh.material) {
          currentMesh.material.color.set(0xff0000) // 设置材质颜色为红色
        }
      })

      document.getElementById('green').addEventListener('click', function () {
        if (currentMesh && currentMesh.material) {
          currentMesh.material.color.set(0x00ff00) // 设置材质颜色为绿色
        }
      })

      document.getElementById('blue').addEventListener('click', function () {
        if (currentMesh && currentMesh.material) {
          currentMesh.material.color.set(0x0000ff) // 设置材质颜色为蓝色
        }
      })

      document.getElementById('white').addEventListener('click', function () {
        if (currentMesh && currentMesh.material) {
          currentMesh.material.color.set(0xffffff) // 设置材质颜色为白色
        }
      })

      document.getElementById('black').addEventListener('click', function () {
        if (currentMesh && currentMesh.material) {
          currentMesh.material.color.set(0x000000) // 设置材质颜色为黑色
        }
      })

      document.getElementById('gray').addEventListener('click', function () {
        if (currentMesh && currentMesh.material) {
          currentMesh.material.color.set(0x808080) // 设置材质颜色为灰色
        }
      })

      document.getElementById('yellow').addEventListener('click', function () {
        if (currentMesh && currentMesh.material) {
          currentMesh.material.color.set(0xffff00) // 设置材质颜色为黄色
        }
      })

      document.getElementById('pink').addEventListener('click', function () {
        if (currentMesh && currentMesh.material) {
          currentMesh.material.color.set(0xff00ff) // 设置材质颜色为紫色
        }
      })

      document.getElementById('random').addEventListener('click', function () {
        if (currentMesh && currentMesh.material) {
          const r = Math.floor(Math.random() * 256)
          const g = Math.floor(Math.random() * 256)
          const b = Math.floor(Math.random() * 256)
          const color = new THREE.Color(`rgb(${r},${g},${b})`)
          currentMesh.material.color.set(color) // 设置材质颜色为随机颜色
        }
      })
    },
    function (xhr) {
      // 进度条
      const percent = xhr.loaded / xhr.total
      console.log('加载进度' + percent)
      percentDiv.style.width = percent * 400 + 'px' //进度条元素长度
      percentDiv.style.textIndent = percent * 400 + 5 + 'px' //缩进元素中的首行文本
      // Math.floor:小数加载进度取整
      percentDiv.innerHTML = Math.floor(percent * 100) + '%' //进度百分比
    }
  )

  //export default model;

  //性能监控
  //const stats = new Stats(); //创建性能监控器
  //document.body.appendChild(stats.domElement); //将性能监控器添加到body中

  //创建场景
  const scene = new THREE.Scene()

  //设置环境贴图
  //rgbeLoader 加载hdr文件
  let rgbeLoader = new RGBELoader()
  rgbeLoader.load(backgroundPath, (envMap) => {
    //加载hdr文件
    //设置球形环境贴图
    envMap.mapping = THREE.EquirectangularReflectionMapping //让环境贴图能跟着物体转动!!!!!!!重要！！
    scene.background = envMap //设置背景为球形环境贴图
  })

  //透视相机
  const camera = new THREE.PerspectiveCamera(
    45, //视角范围
    window.innerWidth / window.innerHeight, //宽高比
    0.1, //近平面
    1000 //远平面
  )
  camera.position.set(0.3, 1.5, 1.5) //设置相机位置
  camera.lookAt(0, 0, 0) //设置相机视角,指向立方体的位置

  //渲染器
  const renderer = new THREE.WebGLRenderer({
    antialias: true //开启优化锯齿
  })
  renderer.setSize(window.innerWidth, window.innerHeight) //设置渲染器的宽度和高度
  document.getElementsByClassName('model-page')[0].appendChild(renderer.domElement) //将渲染器添加到body中
  console.log(renderer.domElement)
  camera.aspect = window.innerWidth / window.innerHeight //更新相机的宽高比
  camera.updateProjectionMatrix() //更新投影矩阵
  renderer.setPixelRatio(window.devicePixelRatio) //防止输出模糊

  //轨道控制器
  const Controls = new OrbitControls(camera, renderer.domElement) //创建轨道控制器
  Controls.target.set(0, 0, 0) //设置轨道控制器的目标点
  //阻尼滑动惯性
  Controls.enableDamping = true
  Controls.damping = 0.1
  //设置选择速度
  //Controls.autoRotate = true;

  // //添加动画
  function animate() {
    Controls.update() //更新轨道控制器
    requestAnimationFrame(animate) //渲染动画
    //cube.rotation.x += 0.001;
    //cube.rotation.y += 0.001;
    renderer.render(scene, camera) //渲染场景
    camera.updateProjectionMatrix() //更新投影矩阵
    // stats.update(); //更新性能监控器
  }

  animate()

  // //世界坐标辅助器
  // const axesHelper = new THREE.AxesHelper(5) //创建坐标辅助器
  // scene.add(axesHelper) //添加到场景中

  //光源
  const directionalLight = new THREE.DirectionalLight(0xffffff, 5) //创建平行光
  directionalLight.position.set(10, 10, 10) //设置位置
  scene.add(directionalLight) //添加到场景中
  const ambientLight = new THREE.AmbientLight(0xffffff, 4) //创建环境光
  scene.add(ambientLight) //添加到场景中
  ambientLight.position.set(5, 5, 5) //设置位置

  //  //光源辅助器
  //  const lightHelper = new THREE.PointLightHelper(directionalLight, 0.5); //创建光源辅助器
  //  scene.add(lightHelper); //添加到场景中
}
</script>

<template>
  <div id="container">
    <div ref="per" id="per"></div>
  </div>
  <div class="title">服装试穿程序</div>
  <div class="pos">
    <div id="red" class="bu">红</div>
    <div id="blue" class="bu" style="margin-left: 10px">蓝</div>
    <div id="green" class="bu" style="margin-left: 10px">绿</div>
    <div id="yellow" class="bu" style="margin-left: 10px">黄</div>
    <div id="pink" class="bu" style="margin-left: 10px">粉</div>
    <div id="black" class="bu" style="margin-left: 10px">黑</div>
    <div id="white" class="bu" style="margin-left: 10px">白</div>
    <div id="gray" class="bu" style="margin-left: 10px">灰</div>
    <div id="random" class="bu" style="margin-left: 10px">随机</div>
  </div>

  <div class="pos2" style="bottom: 150px">
    <div @click="onClick(0)" ref="btn0" id="top" class="bu2" style="margin-left: 20px">上衣</div>
    <div @click="onClick(1)" ref="btn1" id="skirt" class="bu2" style="margin-left: 20px">裙子</div>
  </div>

  <div class="input-container">
    <!-- 输入框 -->
    <input type="text" id="textInput" placeholder="输入文字" />
    <button id="submitText">记录</button>
  </div>

  <div id="app"></div>
</template>

<style scoped lang="scss">
body {
  overflow: hidden;
  margin: 0px;
}

#container {
  position: absolute;
  width: 400px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin-left: -200px;
  margin-top: -8px;
  border-radius: 8px;
  border: 1px solid #009999;
  overflow: hidden;
}

#per {
  height: 100%;
  width: 0px;
  background: #00ffff;
  color: #00ffff;
  line-height: 15px;
}

body {
  overflow: hidden;
  margin: 0px;
}

.title {
  position: absolute;
  left: 20px; /* 距离左边的距离 */
  top: 50px; /* 距离顶部的距离 */
  color: #ffffff; /* 标题文字颜色 */
  font-size: 50px; /* 标题文字大小 */
  font-weight: bold; /* 标题文字加粗 */
}

.bu {
  background: rgba(255, 255, 255, 0.1);
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  display: inline-block;
}

.bu:hover {
  cursor: pointer;
}

.bu:active {
  background: rgba(132, 255, 0, 0.5); /* 点击时改变背景颜色 */
}

.pos {
  position: absolute;
  left: 35%;
  margin-left: -65px;
  bottom: 80px;
}

.bu2 {
  background: rgba(255, 255, 255, 0.1);
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  display: inline-block;
}

.bu2:hover {
  cursor: pointer;
}

.bu2:active,
.bu2.active {
  background: rgba(132, 255, 0, 0.5); /* 被激活时的背景颜色 */
}

.pos2 {
  position: absolute;
  left: 35%;
  margin-left: -65px;
  bottom: 80px;
}

.input-container {
  position: absolute;
  left: 50%;
  margin-left: -100px; /* 根据输入框宽度调整 */
  bottom: 160px; /* 适当调整与按钮的间距 */
}

#textInput {
  width: 200px; /* 输入框宽度 */
  height: 30px; /* 输入框高度 */
}

#submitText {
  margin-left: 10px; /* 输入框与按钮之间的间距 */
  height: 36px;
}
</style>
