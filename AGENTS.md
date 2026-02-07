# Docker Creator - AGENTS.md

本文件为在此代码库中工作的 AI agent 提供开发规范和操作指南。

## 语言设置

**重要提示**：无论用户使用中文还是英文提问，所有的思考过程和回复必须使用**中文（简体中文）**。

- 所有思考过程使用中文
- 所有回复文字使用中文
- 代码中的注释使用中文
- 技术术语第一次出现时给出英文原文，如：Vue Router（Vue 路由）

## 项目概述

Docker Creator 是一个可视化生成 Dockerfile 和 Docker Compose 配置文件的 Web 应用，基于 Vue 3 + TypeScript + Vite 构建。

## 构建与运行命令

### 基础命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 类型检查

项目使用 `vue-tsc` 进行 TypeScript 类型检查，构建时会自动执行类型检查：

```bash
# 单独运行类型检查
npx vue-tsc -b
```

### IDE 支持

项目已配置 VS Code 工作区，推荐使用 VS Code 进行开发。

## 技术栈

- **框架**: Vue 3 (Composition API + `<script setup>`)
- **语言**: TypeScript 5.9
- **构建工具**: Vite 7
- **UI 组件库**: Element Plus 2
- **路由**: Vue Router 5
- **CSS**: 标准 CSS (项目中不使用 SCSS/Less)

## 代码风格规范

### TypeScript 规范

1. **类型定义**: 使用接口定义数据结构，接口名称使用 PascalCase
   ```typescript
   interface DockerfileInstruction {
     name: string
     description: string
     example: string
   }
   ```

2. **类型注解**: 函数参数和返回值必须明确标注类型
   ```typescript
   function navigateTo(path: string): void {
     router.push(path)
   }
   ```

3. **禁止使用 any**: 除非绝对必要，否则不使用 `any` 类型

### Vue 组件规范

1. **语法**: 必须使用 `<script setup lang="ts">` 语法
2. **导入顺序**: Vue 核心库 → 第三方库 → 内部模块 → CSS/资源
   ```typescript
   import { useRouter } from 'vue-router'
   import { ref, computed } from 'vue'
   ```

3. **组件命名**: 使用 PascalCase，如 `DockerfileGenerator.vue`

4. **Props 定义**: 使用 TypeScript 接口定义，添加必要的注释说明

5. **事件**: 使用 TypeScript 接口定义事件类型

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `DockerfileGenerator.vue` |
| 变量/函数 | camelCase | `copyToClipboard`, `dockerfileInstructions` |
| 常量 | UPPER_SNAKE_CASE | `DEFAULT_PORT`, `MAX_RETRY_COUNT` |
| 接口/类型 | PascalCase | `DockerfileInstruction` |
| CSS 类名 | kebab-case | `feature-card`, `hero-section` |

### 导入规范

1. **Vue 导入**: 使用解构导入
   ```typescript
   import { ref, computed, onMounted } from 'vue'
   ```

2. **Vue Router 导入**: 按需导入
   ```typescript
   import { useRouter } from 'vue-router'
   import type { RouteRecordRaw } from 'vue-router'
   ```

3. **相对导入**: 使用清晰的相对路径，避免深层嵌套导入

### 错误处理

1. **同步错误**: 使用 try-catch 捕获并处理错误
   ```typescript
   try {
     await someOperation()
   } catch (error) {
     console.error('操作失败:', error)
     // 显示用户友好的错误提示
   }
   ```

2. **异步错误**: 链式处理错误或使用 try-catch

3. **用户反馈**: 使用 Element Plus 的 Message 组件提示用户

### CSS 规范

1. **Scoped CSS**: 组件样式必须使用 `scoped` 属性
2. **类名命名**: 使用 kebab-case
3. **选择器深度**: 避免使用深度选择器，优先使用类名控制
4. **单位**: 使用 px 作为固定值单位，根据设计稿保持一致性

### 目录结构

```
src/
├── assets/          # 静态资源
├── components/      # 公共组件
├── data/           # 数据定义文件
├── router/         # 路由配置
├── utils/          # 工具函数
├── views/          # 页面组件
├── App.vue         # 根组件
├── main.ts         # 入口文件
└── style.css       # 全局样式
```

## 关键文件说明

- `src/data/`: 存放 Dockerfile 和 Docker Compose 指令定义
- `src/views/`: 页面组件，负责业务逻辑和 UI
- `src/utils/`: 通用工具函数
- `src/components/`: 可复用的 Vue 组件

## 最佳实践

1. **单一职责**: 每个函数/组件只做一件事
2. **代码复用**: 提取公共逻辑到 `utils/` 或 `components/`
3. **注释**: 复杂逻辑添加注释说明，接口定义添加描述
4. **类型安全**: 优先使用 TypeScript 类型而非运行时检查
5. **不可变数据**: 使用 `const` 定义常量，使用 `ref/reactive` 定义响应式数据

## Git 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具/依赖更新

示例: `feat(dockerfile): 添加多阶段构建支持`
