<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const features = [
  {
    title: 'Dockerfile 生成器',
    description: '可视化配置 Dockerfile 指令，支持 Java 单体项目、分布式项目、Vue 前端项目模板，快速生成符合最佳实践的 Dockerfile 文件。',
    icon: '📄',
    path: '/dockerfile',
    color: '#409EFF'
  },
  {
    title: 'Docker Compose 生成器',
    description: '可视化配置 docker-compose.yml 文件，支持多服务编排、环境变量配置、网络和卷管理，一键生成完整的编排文件。',
    icon: '📦',
    path: '/docker-compose',
    color: '#67C23A'
  },
  {
    title: '命令详解',
    description: '深入了解 Dockerfile 和 Docker Compose 中每个命令的含义、作用、使用示例和注意事项，通俗易懂的讲解帮助你快速掌握。',
    icon: '📖',
    path: '/guide',
    color: '#E6A23C'
  }
]

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="home-container">
    <div class="hero-section">
      <h1 class="hero-title">Docker Creator</h1>
      <p class="hero-subtitle">
        可视化生成 Dockerfile 和 Docker Compose 配置文件
      </p>
      <p class="hero-description">
        结合 Docker 最佳实践，帮助开发者快速构建 Java 和 Vue 项目的容器化配置
      </p>
    </div>

    <div class="features-section">
      <h2 class="section-title">核心功能</h2>
      <div class="features-grid">
        <el-card
          v-for="feature in features"
          :key="feature.path"
          class="feature-card"
          shadow="hover"
          @click="navigateTo(feature.path)"
        >
          <div class="feature-icon" :style="{ backgroundColor: feature.color + '20' }">
            <span>{{ feature.icon }}</span>
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
          <el-button type="primary" :style="{ backgroundColor: feature.color, borderColor: feature.color }">
            开始使用
          </el-button>
        </el-card>
      </div>
    </div>

    <div class="info-section">
      <h2 class="section-title">支持的项目类型</h2>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="hover">
            <template #header>
              <span>☕ Java 单体项目</span>
            </template>
            <p>支持 Spring Boot、Maven/Gradle 构建，多阶段构建优化镜像大小</p>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            <template #header>
              <span>🔗 Java 分布式项目</span>
            </template>
            <p>支持微服务架构，配置服务发现、配置中心等中间件依赖</p>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            <template #header>
              <span>💚 Vue 前端项目</span>
            </template>
            <p>支持 Nginx 部署，多阶段构建，优化静态资源缓存</p>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: #fff;
  margin-bottom: 40px;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 16px 0;
}

.hero-subtitle {
  font-size: 24px;
  margin: 0 0 12px 0;
  opacity: 0.9;
}

.hero-description {
  font-size: 16px;
  margin: 0;
  opacity: 0.8;
}

.section-title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  text-align: center;
  margin-bottom: 30px;
}

.features-section {
  margin-bottom: 40px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feature-card {
  cursor: pointer;
  transition: transform 0.3s ease;
  text-align: center;
  padding: 20px;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.feature-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 36px;
}

.feature-title {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px 0;
}

.feature-description {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.info-section {
  margin-bottom: 40px;
}

.info-section .el-card {
  height: 100%;
}

.info-section p {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin: 0;
}
</style>
