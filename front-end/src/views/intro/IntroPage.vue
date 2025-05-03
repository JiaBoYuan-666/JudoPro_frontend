<template>
  <el-main class="app-main">
    <!-- 项目简介 -->
    <section class="section">
      <h2 class="section-title animate__title">项目简介</h2>
      <p class="section-content animate__content">
        在柔道运动领域，训练效果直接关系到运动员的竞技水平与赛事成绩。JudoPro 智训平台旨在填补国内柔道训练智能化的空白，通过智能算法生成个性化训练建议，提升运动员的训练效率和竞技水平。
      </p>
    </section>


    <section class="section">
      <h2 class="section-title animate__title">功能亮点</h2>
      <el-row :gutter="20" class="feature-row">
        <el-col 
          v-for="(item, index) in features"
          :key="index"
          :span="8"
          class="animate__feature"
          :style="{ transitionDelay: `${index * 0.1}s` }"
        >
          <el-card class="feature-card">
            <div class="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path v-if="item.icon === 'personalized'" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                <path v-if="item.icon === 'analysis'" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-5h2v5zm4 0h-2v-3h2v3zm0-5h-2v-2h2v2zm4 5h-2V7h2v10z"/>
                <path v-if="item.icon === 'efficiency'" d="M13 2.05v2.02c3.95.49 7 3.85 7 7.93 0 3.21-1.92 6-4.72 7.28l-1.43-1.43c1.9-1.03 3.15-3.03 3.15-5.35 0-3.31-2.69-6-6-6-.97 0-1.87.23-2.67.63l-1.49-1.49C10.02 4.84 11.45 4.22 13 4v-.95zm-2 .67c-.63.18-1.23.44-1.79.76l1.51 1.51C10.28 5.64 10 6.29 10 7c0 1.1.9 2 2 2 .71 0 1.36-.37 1.72-.94l1.51 1.51c-.32.56-.58 1.16-.76 1.79h2.06c.24-1.1.39-2.26.39-3.45 0-4.5-3.1-8.31-7.33-9.35zM2.81 2.81L1.39 4.22l3.03 3.03c-.05.16-.08.33-.08.5 0 1.1.9 2 2 2 .17 0 .34-.03.5-.08l1.97 1.97c-1.07.45-2.12.95-3.18 1.49-1.03.52-1.65 1.62-1.45 2.74.23 1.32 1.3 2.4 2.62 2.63 1.12.2 2.22-.42 2.74-1.45.54-1.06 1.04-2.11 1.49-3.18l3.18 3.18c-.17.0-.33.08-.5.08-1.1 0-2-.9-2-2 0-.17.03-.34.08-.5l3.28 3.28c-.4.32-.84.6-1.3.83l1.49 1.49c1.15-.58 2.21-1.35 3.15-2.29l4.2 4.2 1.41-1.41L2.81 2.81z"/>
              </svg>
            </div>
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-content">{{ item.content }}</p>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <!-- 未来展望 -->
    <section class="section">
      <h2 class="section-title">未来展望</h2>
      <p class="section-content">
        JudoPro 智训平台的研发还可为其他体育项目提供范例，为整个体育训练数字化转型提供有力支撑。
      </p>
    </section>
  </el-main>
</template>

<script>
export default {
  name: 'JudoProIntro',
  data() {
    return {
      features: [
        { 
          title: '个性化训练建议',
          content: '根据运动员数据生成专属训练计划。',
          icon: 'personalized'
        },
        { 
          title: '优势与不足分析',
          content: '帮助运动员清晰了解自身优势与不足。',
          icon: 'analysis'
        },
        { 
          title: '训练效率提升',
          content: '有针对性地改进训练，提升效率。',
          icon: 'efficiency'
        }
      ]
    };
  },
  mounted() {
    this.initScrollAnimations();
  },
  methods: {
    initScrollAnimations() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate__active');
            observer.unobserve(entry.target); // 动画执行后停止监听
          }
        });
      }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -5px 0px' 
      });

      document.querySelectorAll('.animate__title').forEach(el => observer.observe(el));
      document.querySelectorAll('.animate__content').forEach(el => observer.observe(el));
      document.querySelectorAll('.animate__feature').forEach(el => observer.observe(el));
    }
  }
};
</script>

<style scoped>

.app-main {
  padding: 40px;
  overflow: auto;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  color: #1f1f1f;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  height: 100%;
  padding-bottom: 40px;
}

/* 外层容器滚动条设置 */
:deep(.el-container) {
  height: 100vh;
  overflow: auto;
}

.section {
  margin-bottom: 40px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 20px;
}

.section-title {
  font-size: 2.2rem;
  color: #005bac;
  margin-bottom: 30px;
  padding-left: 15px;
  position: relative;
}

/* 标题动画 */
.animate__title {
  opacity: 0;
  transform: translateX(-20px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate__title.animate__active {
  opacity: 1;
  transform: translateX(0);
  border-left: 4px solid #005bac;
  animation: titleUnderline 1s ease-out forwards;
}

@keyframes titleUnderline {
  from { border-left-width: 0 }
  to { border-left-width: 4px }
}

.section-content {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #4a4a4a;
  max-width: 800px;
  margin: 0 auto;
}

/* 内容动画 */
.animate__content {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate__content.animate__active {
  opacity: 1;
  transform: translateY(0);
}

.feature-row {
  margin-top: 40px;
}

/* 功能卡片动画 */
.animate__feature {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity;
  margin-bottom: 20px;
}

.animate__feature.animate__active {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.feature-card {
  background: white;
  border: none;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  height: 280px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 6px rgba(0, 91, 172, 0.05);
}

.feature-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 24px rgba(0, 91, 172, 0.15);
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(25, 118, 210, 0.1),
    transparent
  );
  transition: left 0.6s;
}

.feature-card:hover::before {
  left: 100%;
}

.card-title {
  font-size: 1.4rem;
  color: #1976d2;
  margin: 20px 0 15px;
  font-weight: 600;
}

.card-content {
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
  margin: 0 auto;
  max-width: 240px;
}

/* 图标动画 */
.card-icon {
  text-align: center;
  margin: 20px 0;
  transition: transform 0.3s;
}

.card-icon svg {
  width: 60px;
  height: 60px;
  fill: #1976d2;
  transition: fill 0.3s;
}

.feature-card:hover .card-icon {
  transform: rotate(15deg) scale(1.1);
}

.feature-card:hover .card-icon svg {
  fill: #005bac;
}

@media (max-width: 768px) {
  .app-main {
    padding: 20px;
  }
  
  .el-col {
    width: 100%;
    margin-bottom: 20px;
  }
  
  .feature-card {
    height: auto;
    padding: 20px;
  }
}
</style>