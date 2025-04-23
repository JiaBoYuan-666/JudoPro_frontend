<script setup>
import * as THREE from 'three'
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

//场景
const scene = new THREE.Scene()
//镜头
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000)

camera.position.set(0, 0, 4)

//渲染器
let renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

//加载纹理
const textureLoader = new THREE.TextureLoader()
const texturepath = new URL('@/assets/cat-8130334_1920.jpg', import.meta.url).href
//const texturepath = new URL('@/assets/xing.png', import.meta.url).href
const texture = textureLoader.load(texturepath)
const depthTexturePath = new URL('@/assets/cat-8130334_1920_disparity(1).png', import.meta.url).href

const depthTexture = textureLoader.load(depthTexturePath)
//创建平面
const geometry = new THREE.PlaneGeometry(19.2, 12.8)
//const material = new THREE.MeshBasicMaterial({ map: texture });

//鼠标交互
const mouse = new THREE.Vector2()

//着色器材质
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 }, //自动
    uTexture: { value: texture },
    uDepthTexture: { value: depthTexture },
    uMouse: { value: mouse }
  },
  vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
            `,
  fragmentShader: `
        uniform sampler2D uTexture;
        uniform sampler2D uDepthTexture;
        uniform vec2 uMouse;
        varying vec2 vUv;
        uniform float uTime;
        void main() {
            vec4 color = texture2D(uTexture, vUv);
            vec4 depth = texture2D(uDepthTexture, vUv);
            float depthValue = depth.r;
            float x=vUv.x + (uMouse.x+sin(uTime*0.5))*0.02*depthValue;
            float y=vUv.y + (uMouse.y+cos(uTime*0.5))*0.02*depthValue;
            vec4 newColor = texture2D(uTexture, vec2(x,y));
            gl_FragColor = newColor;
            }
            `
})

const plane = new THREE.Mesh(geometry, material)
scene.add(plane)

//渲染
requestAnimationFrame(function animate() {
  material.uniforms.uMouse.value = mouse
  material.uniforms.uTime.value = performance.now() / 1000 //自动
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
})

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
})
</script>

<template>
  <div></div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

canvas {
  width: 100%;
  height: 100%;
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>
