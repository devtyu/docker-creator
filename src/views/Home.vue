<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Document, Files, Reading, Coffee, Link, ChromeFilled, ArrowRight, Ship } from '@element-plus/icons-vue'

const router = useRouter()

const features = [
  {
    title: 'Dockerfile 生成器',
    description: '可视化配置 Dockerfile 指令，支持 Java 单体项目、分布式项目、Vue 前端项目模板，快速生成符合最佳实践的 Dockerfile 文件。',
    icon: Document,
    path: '/dockerfile',
    gradient: 'from-blue-500 to-cyan-400',
    glowColor: 'rgba(59, 130, 246, 0.4)'
  },
  {
    title: 'Docker Compose 生成器',
    description: '可视化配置 docker-compose.yml 文件，支持多服务编排、环境变量配置、网络和卷管理，一键生成完整的编排文件。',
    icon: Files,
    path: '/docker-compose',
    gradient: 'from-green-500 to-emerald-400',
    glowColor: 'rgba(34, 197, 94, 0.4)'
  },
  {
    title: '命令详解',
    description: '深入了解 Dockerfile 和 Docker Compose 中每个命令的含义、作用、使用示例和注意事项，通俗易懂的讲解帮助你快速掌握。',
    icon: Reading,
    path: '/guide',
    gradient: 'from-amber-500 to-orange-400',
    glowColor: 'rgba(245, 158, 11, 0.4)'
  }
]

const projectTypes = [
  {
    name: 'Java 单体项目',
    description: '支持 Spring Boot、Maven/Gradle 构建，多阶段构建优化镜像大小',
    icon: Coffee,
    color: '#f89820'
  },
  {
    name: 'Java 分布式项目',
    description: '支持微服务架构，配置服务发现、配置中心等中间件依赖',
    icon: Link,
    color: '#5382a1'
  },
  {
    name: 'Vue 前端项目',
    description: '支持 Nginx 部署，多阶段构建，优化静态资源缓存',
    icon: ChromeFilled,
    color: '#42b883'
  }
]

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="home-container">
    <!-- Hero 区域 -->
    <section class="hero-section">
      <div class="hero-bg-effects">
        <div class="glow-orb orb-1"></div>
        <div class="glow-orb orb-2"></div>
        <div class="glow-orb orb-3"></div>
      </div>
      
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          开发者工具
        </div>
        
        <h1 class="hero-title">
          Docker
          <span class="text-gradient">Creator</span>
        </h1>
        
        <p class="hero-subtitle">
          可视化生成 Dockerfile 和 Docker Compose 配置文件
        </p>
        
        <p class="hero-description">
          结合 Docker 最佳实践，帮助开发者快速构建 Java 和 Vue 项目的容器化配置
        </p>
        
        <div class="hero-actions">
          <button class="btn-primary" @click="navigateTo('/dockerfile')">
            开始使用
            <el-icon class="btn-icon"><ArrowRight /></el-icon>
          </button>
          <button class="btn-secondary" @click="navigateTo('/guide')">
            查看文档
          </button>
        </div>
      </div>
    </section>

    <!-- 功能卡片区域 -->
    <section class="features-section">
      <div class="section-header">
        <span class="section-tag">核心功能</span>
        <h2 class="section-title">快速生成 Docker 配置</h2>
        <p class="section-desc">选择适合的工具，开始构建您的容器化应用</p>
      </div>
      
      <div class="features-grid">
        <div
          v-for="(feature, index) in features"
          :key="feature.path"
          class="feature-card"
          :style="{ animationDelay: `${index * 0.1}s` }"
          @click="navigateTo(feature.path)"
        >
          <div class="card-glow" :style="{ background: feature.glowColor }"></div>
          
          <div class="feature-icon-wrapper" :class="feature.gradient">
            <el-icon class="feature-icon" :size="32">
              <component :is="feature.icon" />
            </el-icon>
          </div>
          
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
          
          <div class="feature-action">
            <span>开始使用</span>
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
    </section>

    <!-- 支持的项目类型 -->
    <section class="types-section">
      <div class="section-header">
        <span class="section-tag">支持的项目类型</span>
        <h2 class="section-title">多技术栈覆盖</h2>
        <p class="section-desc">内置多种项目模板，满足不同的技术需求</p>
      </div>
      
      <div class="types-grid">
        <div
          v-for="(type, index) in projectTypes"
          :key="type.name"
          class="type-card"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="type-icon" :style="{ backgroundColor: `${type.color}20`, color: type.color }">
            <el-icon :size="28">
              <component :is="type.icon" />
            </el-icon>
          </div>
          <h4 class="type-name">{{ type.name }}</h4>
          <p class="type-desc">{{ type.description }}</p>
        </div>
      </div>
    </section>

    <!-- 底部信息 -->
    <footer class="home-footer">
      <div class="footer-content">
        <div class="footer-brand">
          <el-icon class="footer-logo" :size="24"><Ship /></el-icon>
          <span>Docker Creator</span>
        </div>
        <p class="footer-text">为开发者打造的 Docker 配置生成工具</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* 导入图标 */
:deep(.el-icon) {
  display: inline-flex;
}

/* 主容器 */
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* Hero 区域 */
.hero-section {
  position: relative;
  padding: 80px 20px;
  margin-bottom: 80px;
  border-radius: 24px;
  overflow: hidden;
  text-align: center;
}

.hero-bg-effects {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: float 10s ease-in-out infinite;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(36, 150, 237, 0.4) 0%, transparent 70%);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 70%);
  top: 50%;
  right: -50px;
  animation-delay: -3s;
}

.orb-3 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%);
  bottom: -100px;
  left: 30%;
  animation-delay: -6s;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(36, 150, 237, 0.1);
  border: 1px solid rgba(36, 150, 237, 0.3);
  border-radius: 50px;
  color: #2496ed;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 24px;
}

.badge-dot {
  width: 6px;
  height: 6px;
  background: #2496ed;
  border-radius: 50%;
  box-shadow: 0 0 10px #2496ed;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.hero-title {
  font-size: clamp(40px, 8vw, 72px);
  font-weight: 800;
  color: #f1f5f9;
  letter-spacing: -2px;
  margin: 0 0 20px 0;
  line-height: 1.1;
}

.text-gradient {
  background: linear-gradient(135deg, #2496ed 0%, #22d3ee 50%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: clamp(18px, 3vw, 24px);
  color: #e2e8f0;
  margin: 0 0 16px 0;
  font-weight: 500;
}

.hero-description {
  font-size: 16px;
  color: #94a3b8;
  max-width: 600px;
  margin: 0 auto 40px;
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #2496ed 0%, #1d7bc8 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(36, 150, 237, 0.4);
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-icon {
  transition: transform 0.3s ease;
}

.btn-primary:hover .btn-icon {
  transform: translateX(4px);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  padding: 14px 28px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: #f1f5f9;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* 功能卡片区域 */
.features-section {
  margin-bottom: 100px;
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-tag {
  display: inline-block;
  padding: 6px 14px;
  background: rgba(36, 150, 237, 0.1);
  border: 1px solid rgba(36, 150, 237, 0.2);
  border-radius: 50px;
  color: #2496ed;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
}

.section-title {
  font-size: clamp(28px, 4vw, 36px);
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 12px 0;
}

.section-desc {
  font-size: 16px;
  color: #64748b;
  margin: 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.feature-card {
  position: relative;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 32px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out backwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0;
  transform: translate(-50%, -50%);
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.feature-card:hover {
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-4px);
}

.feature-card:hover .card-glow {
  opacity: 0.5;
}

.feature-icon-wrapper {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  margin-bottom: 24px;
  background: linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to));
  position: relative;
  z-index: 1;
}

.feature-icon-wrapper::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 16px;
  padding: 1px;
  background: linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

.from-blue-500 {
  --tw-gradient-from: rgba(59, 130, 246, 0.3);
  --tw-gradient-to: rgba(34, 211, 238, 0.3);
}

.from-green-500 {
  --tw-gradient-from: rgba(34, 197, 94, 0.3);
  --tw-gradient-to: rgba(52, 211, 153, 0.3);
}

.from-amber-500 {
  --tw-gradient-from: rgba(245, 158, 11, 0.3);
  --tw-gradient-to: rgba(251, 146, 60, 0.3);
}

.feature-icon {
  color: white;
}

.feature-title {
  font-size: 20px;
  font-weight: 600;
  color: #f1f5f9;
  margin: 0 0 12px 0;
  position: relative;
  z-index: 1;
}

.feature-description {
  font-size: 14px;
  color: #64748b;
  line-height: 1.7;
  margin: 0 0 24px 0;
  position: relative;
  z-index: 1;
}

.feature-action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #2496ed;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.feature-card:hover .feature-action {
  gap: 10px;
}

/* 项目类型区域 */
.types-section {
  margin-bottom: 100px;
}

.types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.type-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 28px;
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease-out backwards;
}

.type-card:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.type-icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  margin-bottom: 20px;
}

.type-name {
  font-size: 17px;
  font-weight: 600;
  color: #f1f5f9;
  margin: 0 0 8px 0;
}

.type-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

/* 底部 */
.home-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 40px 0;
  margin-top: 60px;
}

.footer-content {
  text-align: center;
}

.footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #f1f5f9;
  font-weight: 600;
  margin-bottom: 12px;
}

.footer-logo {
  color: #2496ed;
}

.footer-text {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .hero-section {
    padding: 60px 16px;
    margin-bottom: 60px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .feature-card {
    padding: 24px;
  }
  
  .types-grid {
    grid-template-columns: 1fr;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>

