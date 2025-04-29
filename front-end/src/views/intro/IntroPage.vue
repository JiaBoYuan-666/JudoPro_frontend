<template> 
    <el-main class="app-main">
      <!-- 项目简介 -->
      <section class="section">
        <h2 class="section-title">项目简介</h2>
        <p class="section-content">
          在柔道运动领域，训练效果直接关系到运动员的竞技水平与赛事成绩。JudoPro 智训平台旨在填补国内柔道训练智能化的空白，通过智能算法生成个性化训练建议，提升运动员的训练效率和竞技水平。
        </p>
      </section>
  
      <!-- 功能亮点 -->
      <section class="section">
        <h2 class="section-title">功能亮点</h2>
        <el-row :gutter="20" class="feature-row">
          <el-col :span="8">
            <el-card class="feature-card">
              <h3 class="card-title">个性化训练建议</h3>
              <p class="card-content">根据运动员数据生成专属训练计划。</p>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="feature-card">
              <h3 class="card-title">优势与不足分析</h3>
              <p class="card-content">帮助运动员清晰了解自身优势与不足。</p>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="feature-card">
              <h3 class="card-title">训练效率提升</h3>
              <p class="card-content">有针对性地改进训练，提升效率。</p>
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
  };
  </script>
  
  <style scoped>
  .app-main {
    padding: 40px;
    background-color: #ffffff;
    color: #1f1f1f;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  .section {
    margin-bottom: 60px;
  }
  
  .section-title {
    font-size: 28px;
    color: #005bac;
    margin-bottom: 20px;
    border-left: 4px solid #005bac;
    padding-left: 10px;
  }
  
  .section-content {
    font-size: 16px;
    line-height: 1.6;
    color: #333333;
  }
  
  .feature-row {
    margin-top: 20px;
  }
  
  .feature-card {
    background-color: #f5f5f5;
    border: none;
    color: #333333;
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 91, 172, 0.1);
  }
  
  .card-title {
    font-size: 20px;
    color: #1976d2;
    margin-bottom: 10px;
  }
  
  .card-content {
    font-size: 14px;
    line-height: 1.5;
  }
  </style>
  