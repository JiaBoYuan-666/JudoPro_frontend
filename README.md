# JudoPro - 柔道专业信息平台

## 项目介绍

JudoPro是一个专注于柔道运动的综合信息平台，基于前后端分离架构开发。该平台整合了柔道相关的搜索、发现、视频分析、3D模型展示等功能，为柔道爱好者、运动员和教练提供专业的信息服务。

## 功能特点

- **智能搜索**：提供高效的柔道信息搜索功能，支持多种搜索条件和筛选
- **内容发现**：展示热门柔道内容，包括技术动作、比赛视频等
- **3D模型展示**：通过3D模型直观展示柔道动作和技术要点
- **视频分析**：支持柔道视频的上传和分析功能
- **AI辅助**：集成AI技术，提供智能分析和辅助功能
- **用户中心**：个人信息管理、内容发布和收藏等功能

## 技术栈

### 前端
- **框架**：Vue 3 + Vite
- **UI组件**：Element Plus
- **3D渲染**：Three.js
- **状态管理**：Pinia
- **路由**：Vue Router

### 后端
- **开发语言**：Java 11
- **索引与检索**：Lucene 8.11.1
- **爬虫**：WebMagic 0.7.6
- **分词**：HanLP portable-1.8.3
- **适配**：基于IJF(国际柔道联合会)数据

## 项目结构

```
JudoPro/
├── front-end/         # 前端项目
│   ├── src/
│   │   ├── api/       # API接口
│   │   ├── assets/    # 静态资源
│   │   ├── components/# 组件
│   │   ├── router/    # 路由配置
│   │   ├── stores/    # 状态管理
│   │   ├── utils/     # 工具函数
│   │   └── views/     # 页面视图
│   └── ...
└── back-end/          # 后端项目
    └── ir_ijf/        # 信息检索模块
        ├── src/       # 源代码
        └── ...
```

## 安装与使用

### 前端

```bash
# 进入前端目录
cd front-end

# 安装依赖
pnpm install

# 开发环境运行
pnpm dev

# 生产环境构建
pnpm build

# 代码检查
pnpm lint
```

### 后端

```bash
# 进入后端目录
cd back-end/ir_ijf

# 使用Maven构建项目
mvn clean install

# 运行项目
mvn spring-boot:run
```

## 注意事项

- 本项目基于 [ZXJC-niusile/ir_ijf](https://github.com/ZXJC-niusile/ir_ijf) 和 [ir_demo](https://github.com/ruoyu-chen/ir_demo) 进行开发
- 仅用于学习和研究使用

## 浏览器兼容性

- 推荐使用Chrome、Firefox、Edge等现代浏览器
- 不支持IE浏览器

## 许可证

[MIT](LICENSE)