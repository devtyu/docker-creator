<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const menuItems = [
  { path: '/', label: '首页', icon: 'House' },
  { path: '/dockerfile', label: 'Dockerfile', icon: 'Document' },
  { path: '/docker-compose', label: 'Docker Compose', icon: 'Files' },
  { path: '/guide', label: '命令详解', icon: 'Reading' }
]

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <div class="logo" @click="navigateTo('/')">
        <span class="logo-icon">🐳</span>
        <span class="logo-text">Docker Creator</span>
      </div>
      <el-menu
        :default-active="route.path"
        mode="horizontal"
        :ellipsis="false"
        class="nav-menu"
        @select="navigateTo"
      >
        <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path">
          {{ item.label }}
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-main class="app-main">
      <router-view />
    </el-main>
  </el-container>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.app-header {
  display: flex;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0 24px;
  height: 60px;
}

.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 40px;
}

.logo-icon {
  font-size: 28px;
  margin-right: 8px;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.nav-menu {
  border-bottom: none;
  flex: 1;
}

.app-main {
  padding: 24px;
  min-height: calc(100vh - 60px);
}
</style>
