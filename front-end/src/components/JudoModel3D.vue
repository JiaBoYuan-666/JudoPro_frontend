<script setup>
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { ref, onMounted, onBeforeUnmount } from 'vue'

// 引入资源路径
const modelPath = new URL('@/assets/两套.gltf', import.meta.url).href
const backgroundPath = new URL('@/assets/brown_photostudio_02_4k.hdr', import.meta.url).href

// 创建引用以便在组件卸载时清理资源
const container = ref(null)
const loadingProgress = ref(0)
const isLoading = ref(true)
const animationId = ref(null)

// 场景相关变量
let scene, camera, renderer, controls, model, mixer, clock;
let currentModel = null;

// 动画状态
const animations = ref([
  { name: '站立姿势', active: true },
  { name: '柔道技术动作', active: false },
  { name: '防守姿势', active: false }
])

// 模型路径
const standingModelPath = new URL('@/assets/站立.glb', import.meta.url).href
const attackModelPath = new URL('@/assets/进攻.glb', import.meta.url).href
const defenseModelPath = new URL('@/assets/防守.glb', import.meta.url).href

// 选择动画
const selectAnimation = (index) => {
  animations.value.forEach((anim, i) => {
    anim.active = i === index
  })
  
  // 根据选择加载不同的模型
  if (scene) {
    // 如果当前有模型，先移除
    if (currentModel) {
      scene.remove(currentModel);
    }
    
    // 根据选择加载不同的模型
    switch(index) {
      case 0: // 站立姿势
        loadModel(standingModelPath);
        break;
      case 1: // 柔道技术动作
        loadModel(attackModelPath);
        break;
      case 2: // 防守姿势
        loadModel(defenseModelPath);
        break;
    }
  }
}



// 初始化3D场景
const initScene = () => {
  // 创建场景
  scene = new THREE.Scene();
  clock = new THREE.Clock();
  
  // 创建相机
  // 确保容器尺寸正确计算
  const containerWidth = container.value.clientWidth || window.innerWidth;
  const containerHeight = container.value.clientHeight || window.innerHeight;
  
  camera = new THREE.PerspectiveCamera(
    45,
    containerWidth / containerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1, 3);
  camera.lookAt(0, 0, 0);
  
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  
  renderer.setSize(containerWidth, containerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.value.appendChild(renderer.domElement);
  
  // 创建轨道控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 1.5;
  controls.maxDistance = 5;
  controls.maxPolarAngle = Math.PI / 1.5;
  controls.target.set(0, 0.75, 0);
  
  // 加载HDR环境贴图
  const rgbeLoader = new RGBELoader();
  rgbeLoader.load(backgroundPath, (envMap) => {
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = envMap;
    // 使用模糊的环境贴图作为背景
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envMapBlurred = pmremGenerator.fromEquirectangular(envMap).texture;
    scene.background = envMapBlurred;
  });
  
  // 添加光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
  
  const pointLight1 = new THREE.PointLight(0x0066cc, 1, 10); // 蓝色光源
  pointLight1.position.set(2, 1, 2);
  scene.add(pointLight1);
  
  const pointLight2 = new THREE.PointLight(0xff5722, 1, 10); // 橙色光源
  pointLight2.position.set(-2, 1, -2);
  scene.add(pointLight2);
  
  // 加载默认模型（站立姿势）
  loadModel(standingModelPath);
  
//   // 添加地面
//   const groundGeometry = new THREE.CircleGeometry(2, 32);
//   const groundMaterial = new THREE.MeshStandardMaterial({
//     color: 0xffffff,
//     roughness: 0.8,
//     metalness: 0.2,
//     transparent: true,
//     opacity: 0.3
//   });
//   const ground = new THREE.Mesh(groundGeometry, groundMaterial);
//   ground.rotation.x = -Math.PI / 2;
//   ground.position.y = -0.001;
//   ground.receiveShadow = true;
//   scene.add(ground);
  

  
  // 动画循环
  const animate = () => {
    animationId.value = requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    
    controls.update();
    
    renderer.render(scene, camera);
  };
  
  animate();
  
  // 窗口大小调整
  const handleResize = () => {
    // 确保容器尺寸正确计算
    const containerWidth = container.value.clientWidth || window.innerWidth;
    const containerHeight = container.value.clientHeight || window.innerHeight;
    
    camera.aspect = containerWidth / containerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(containerWidth, containerHeight);
    
    // 强制渲染一次场景
    renderer.render(scene, camera);
  };
  
  window.addEventListener('resize', handleResize);
  
  // 返回清理函数
  return () => {
    window.removeEventListener('resize', handleResize);
    if (animationId.value !== null) {
      cancelAnimationFrame(animationId.value);
    }
    if (renderer && renderer.domElement && container.value) {
      container.value.removeChild(renderer.domElement);
    }
    // 释放资源
    if (currentModel) scene.remove(currentModel);
    renderer.dispose();
  };
};

// 加载模型
const loadModel = (modelUrl) => {
  const loader = new GLTFLoader();
  isLoading.value = true;
  
  loader.load(
    modelUrl,
    (gltf) => {
      model = gltf.scene;
      currentModel = model; // 保存当前模型引用，以便后续切换时移除
      
      // 计算包围盒
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);
      
      // 自动缩放模型
      const maxSize = Math.max(size.x, size.y, size.z);
      const scale = 1.5 / maxSize;
      model.scale.set(scale, scale, scale);
      
      // 将模型居中
      model.position.x -= center.x * scale;
      model.position.y -= center.y * scale;
      model.position.z -= center.z * scale;
      
      // 调整模型位置，使其站在地面上
      model.position.y = 0;
      
      // 设置阴影
      model.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
          
          // 基础材质设置
          if (node.material) {
            node.material.envMapIntensity = 1.5;
          }
        }
      });
      
      scene.add(model);
      
      // 处理动画
      if (gltf.animations && gltf.animations.length) {
        mixer = new THREE.AnimationMixer(model);
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
      }
      
      isLoading.value = false;
      
      // 添加延迟执行，确保DOM已完全渲染并且容器尺寸已计算
      setTimeout(() => {
        handleResize(); // 手动触发窗口大小调整
        // 强制重新渲染一次场景
        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      }, 100);
    },
    (xhr) => {
      // 更新加载进度
      loadingProgress.value = Math.floor((xhr.loaded / xhr.total) * 100) || 0;
    },
    (error) => {
      console.error('模型加载错误:', error);
      isLoading.value = false;
    }
  );
};

// 组件挂载时初始化场景
onMounted(() => {
  // 添加短暂延迟，确保DOM已完全渲染并且容器尺寸已计算
  setTimeout(() => {
    const cleanup = initScene();
    
    // 组件卸载前清理资源
    onBeforeUnmount(() => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    });
  }, 50);

});
</script>

<template>
  <div class="judo-model-container">
    <!-- 加载进度条 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${loadingProgress}%` }"></div>
        </div>
        <div class="progress-text">{{ loadingProgress }}%</div>
      </div>
    </div>
    
    <!-- 3D容器 -->
    <div ref="container" class="model-viewer"></div>
    
    <!-- 控制面板 -->
    <div class="control-panel">
      <h3>柔道姿势展示</h3>
      <div class="animation-buttons">
        <button 
          v-for="(anim, index) in animations" 
          :key="index"
          :class="{ active: anim.active }"
          @click="selectAnimation(index)"
        >
          {{ anim.name }}
        </button>
      </div>
      <div class="info-text">
        <p>通过鼠标拖拽可旋转查看模型</p>
        <p>使用鼠标滚轮可缩放模型</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.judo-model-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 500px;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 102, 204, 0.2);
}

.model-viewer {
  width: 100%;
  height: 100%;
  background: transparent;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10;
}

.loading-progress {
  width: 80%;
  max-width: 400px;
  text-align: center;
}

.progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0066cc, #00ccff);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  color: white;
  font-size: 16px;
  font-weight: bold;
}

.control-panel {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  padding: 15px;
  color: white;
  text-align: center;
  backdrop-filter: blur(10px);
  width: 80%;
  max-width: 400px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 5;
}

.control-panel h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
  color: #00ccff;
  text-shadow: 0 0 10px rgba(0, 204, 255, 0.5);
}

.animation-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
}

button {
  background: rgba(0, 102, 204, 0.3);
  border: 1px solid #0066cc;
  color: white;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
}

button:hover {
  background: rgba(0, 102, 204, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 5px 10px rgba(0, 102, 204, 0.3);
}

button.active {
  background: linear-gradient(135deg, #0066cc, #00ccff);
  box-shadow: 0 0 15px rgba(0, 204, 255, 0.7);
}

.info-text {
  font-size: 12px;
  opacity: 0.7;
}

.info-text p {
  margin: 5px 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .control-panel {
    width: 90%;
    padding: 10px;
  }
  
  .animation-buttons {
    flex-direction: column;
    gap: 5px;
  }
  
  button {
    padding: 6px 10px;
    font-size: 14px;
  }
}
</style>