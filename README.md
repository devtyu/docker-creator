# Docker Creator

可视化生成 Dockerfile 和 Docker Compose 配置文件的 Web 应用。

## 项目概述

Docker Creator 是一个基于 Vue 3 + TypeScript + Vite 构建的现代化 Web 应用，旨在帮助开发者快速创建符合最佳实践的 Docker 配置文件。该工具支持 Java 单体项目、分布式项目和 Vue 前端项目的容器化配置生成。

## 技术栈

- **框架**: Vue 3 (Composition API + `<script setup>`)
- **语言**: TypeScript 5.9
- **构建工具**: Vite 7
- **UI 组件库**: Element Plus 2
- **路由**: Vue Router 5

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 项目结构

```
docker-creator/
├── src/                          # 源代码目录
│   ├── main.ts                   # 应用入口文件
│   ├── App.vue                   # 根组件，包含全局布局
│   ├── style.css                 # 全局样式
│   ├── router/                   # 路由配置
│   │   └── index.ts              # 路由定义（4个页面）
│   ├── views/                    # 页面视图组件
│   │   ├── Home.vue              # 首页 - 功能概览和快速入口
│   │   ├── Dockerfile.vue        # Dockerfile 生成器页面
│   │   ├── DockerCompose.vue     # Docker Compose 生成器页面
│   │   └── CommandGuide.vue      # 命令详解页面
│   ├── components/               # 公共组件
│   ├── data/                     # 数据定义
│   │   ├── dockerfile-instructions.ts    # Dockerfile 指令数据
│   │   ├── compose-instructions.ts       # Docker Compose 指令数据
│   │   └── command-details.ts            # 命令详情数据
│   ├── utils/                    # 工具函数
│   │   └── file.ts               # 文件操作工具
│   └── assets/                   # 静态资源
├── public/                       # 公共静态资源
├── index.html                    # 入口 HTML
├── vite.config.ts                # Vite 配置
├── tsconfig.json                 # TypeScript 配置
└── package.json                  # 项目依赖
```

## 核心功能

### 1. Dockerfile 生成器

- **指令支持**: 15 个核心 Dockerfile 指令（FROM, ARG, LABEL, ENV, WORKDIR, USER, COPY, ADD, RUN, EXPOSE, VOLUME, CMD, ENTRYPOINT, HEALTHCHECK, ONBUILD）
- **项目模板**: 
  - Java 单体项目 (Maven/Gradle)
  - Java 分布式项目（微服务架构）
  - Vue 前端项目（Nginx 部署）
- **最佳实践**: 多阶段构建、非 root 用户、健康检查、JVM 参数配置

### 2. Docker Compose 生成器

- 可视化配置 docker-compose.yml 文件
- 支持多服务编排、环境变量、网络和卷管理

### 3. 命令详解

- Dockerfile 和 Docker Compose 指令详细说明
- 使用示例和注意事项

## 路由结构

| 路径                | 组件            | 描述                     |
| ----------------- | ------------- | ---------------------- |
| `/`               | Home          | 首页 - 展示核心功能入口          |
| `/dockerfile`     | Dockerfile    | Dockerfile 可视化生成器      |
| `/docker-compose` | DockerCompose | Docker Compose 配置文件生成器 |
| `/guide`          | CommandGuide  | Docker 命令详解和指南         |

## 代码规范

项目遵循以下代码规范（详见 `AGENTS.md`）：

- **TypeScript**: 使用接口定义数据结构，函数参数和返回值明确标注类型
- **Vue 组件**: 使用 `<script setup lang="ts">` 语法
- **命名规范**: 
  - 组件文件: PascalCase (如 `DockerfileGenerator.vue`)
  - 变量/函数: camelCase
  - 常量: UPPER_SNAKE_CASE
  - 接口/类型: PascalCase
  - CSS 类名: kebab-case
- **导入顺序**: Vue 核心库 → 第三方库 → 内部模块 → CSS/资源

## 支持的浏览器

- Chrome (最新)
- Firefox (最新)
- Safari (最新)
- Edge (最新)

## 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

[MIT](LICENSE)

---

*基于 Vue 3 + TypeScript + Vite 构建*
