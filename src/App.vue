<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { House, Document, Files, Reading, Ship } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const menuItems = [
  { path: '/', label: '首页', icon: House },
  { path: '/dockerfile', label: 'Dockerfile', icon: Document },
  { path: '/docker-compose', label: 'Docker Compose', icon: Files },
  { path: '/guide', label: '命令详解', icon: Reading }
]

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="app-wrapper">
    <!-- 固定玻璃态导航栏 -->
    <nav class="fixed-nav">
      <div class="nav-container">
        <div class="logo" @click="navigateTo('/')">
          <div class="logo-icon-wrapper">
            <el-icon class="logo-icon" :size="28">
              <Ship />
            </el-icon>
          </div>
          <span class="logo-text">
            Docker<span class="text-highlight">Creator</span>
          </span>
        </div>
        
        <div class="nav-menu">
          <button
            v-for="item in menuItems"
            :key="item.path"
            class="nav-item"
            :class="{ active: route.path === item.path }"
            @click="navigateTo(item.path)"
          >
            <el-icon class="nav-icon" :size="18">
              <component :is="item.icon" />
            </el-icon>
            <span class="nav-label">{{ item.label }}</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- 主内容区域 -->
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

/* 固定导航栏 - 玻璃态效果 */
.fixed-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: rgba(17, 24, 39, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
}

/* Logo样式 */
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logo:hover {
  transform: scale(1.02);
}

.logo-icon-wrapper {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(36, 150, 237, 0.2) 0%, rgba(34, 211, 238, 0.2) 100%);
  border: 1px solid rgba(36, 150, 237, 0.3);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.logo:hover .logo-icon-wrapper {
  box-shadow: 0 0 20px rgba(36, 150, 237, 0.3);
  border-color: rgba(36, 150, 237, 0.5);
}

.logo-icon {
  color: #2496ed;
}

.logo-text {
  font-size: 22px;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: -0.5px;
}

.text-highlight {
  background: linear-gradient(135deg, #2496ed 0%, #22d3ee 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 导航菜单 */
.nav-menu {
  display: flex;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 10px;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #f1f5f9;
}

.nav-item.active {
  background: rgba(36, 150, 237, 0.15);
  border-color: rgba(36, 150, 237, 0.4);
  color: #2496ed;
  box-shadow: 0 0 15px rgba(36, 150, 237, 0.2);
}

.nav-icon {
  transition: transform 0.3s ease;
}

.nav-item:hover .nav-icon {
  transform: scale(1.1);
}

/* 主内容区域 */
.app-main {
  padding: 80px 24px 40px;
  min-height: 100vh;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-container {
    padding: 10px 16px;
  }
  
  .logo-text {
    font-size: 18px;
  }
  
  .logo-icon-wrapper {
    width: 36px;
    height: 36px;
  }
  
  .nav-label {
    display: none;
  }
  
  .nav-item {
    padding: 10px;
  }
  
  .app-main {
    padding: 70px 16px 24px;
  }
}

@media (max-width: 480px) {
  .nav-menu {
    gap: 4px;
  }
  
  .nav-item {
    padding: 8px;
  }
}
</style>
