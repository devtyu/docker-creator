<script setup lang="ts">
import { ref } from 'vue'
import { Reading, Document, Files } from '@element-plus/icons-vue'
import { dockerfileCommands, composeCommands, type CommandDetail } from '../data/command-details'

const activeTab = ref('dockerfile')
const activeCommand = ref<string>('')

const currentCommands = ref<CommandDetail[]>(dockerfileCommands)

const switchTab = (tab: string) => {
  activeTab.value = tab
  currentCommands.value = tab === 'dockerfile' ? dockerfileCommands : composeCommands
  activeCommand.value = ''
}

const selectCommand = (name: string) => {
  activeCommand.value = activeCommand.value === name ? '' : name
}

const getCommand = (name: string): CommandDetail | undefined => {
  return currentCommands.value.find(c => c.name === name)
}
</script>

<template>
  <div class="guide-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <el-icon :size="32"><Reading /></el-icon>
        </div>
        <div class="header-text">
          <h1>命令详解</h1>
          <p>深入了解 Dockerfile 和 Docker Compose 中每个命令的含义、用法和最佳实践</p>
        </div>
      </div>
    </div>

    <!-- 标签切换 -->
    <div class="tab-switcher">
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'dockerfile' }"
        @click="switchTab('dockerfile')"
      >
        <el-icon :size="16"><Document /></el-icon>
        Dockerfile 命令
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: activeTab === 'docker-compose' }"
        @click="switchTab('docker-compose')"
      >
        <el-icon :size="16"><Files /></el-icon>
        Docker Compose 命令
      </button>
    </div>

    <!-- 命令网格 -->
    <div class="commands-container">
      <div class="commands-sidebar">
        <div class="sidebar-header">
          <span class="sidebar-title">命令列表</span>
          <span class="sidebar-count">{{ currentCommands.length }} 个</span>
        </div>
        <div class="commands-list">
          <div
            v-for="cmd in currentCommands"
            :key="cmd.name"
            class="command-item"
            :class="{ active: activeCommand === cmd.name }"
            @click="selectCommand(cmd.name)"
          >
            <span class="command-name">{{ cmd.name }}</span>
            <el-icon v-if="activeCommand === cmd.name" class="active-icon"><ArrowRight /></el-icon>
          </div>
        </div>
      </div>

      <div class="command-content">
        <template v-if="activeCommand && getCommand(activeCommand)">
          <div class="content-wrapper">
            <div class="content-header">
              <h2 class="command-title">{{ getCommand(activeCommand)?.name }}</h2>
              <span class="command-type">{{ activeTab === 'dockerfile' ? 'Dockerfile 指令' : 'Compose 指令' }}</span>
            </div>
            
            <div class="content-body">
              <!-- 语法 -->
              <section class="content-section">
                <div class="section-header-row">
                  <div class="section-icon">
                    <el-icon><CodeIcon /></el-icon>
                  </div>
                  <h3>语法</h3>
                </div>
                <div class="code-block">
                  <pre><code>{{ getCommand(activeCommand)?.syntax }}</code></pre>
                </div>
              </section>

              <!-- 说明 -->
              <section class="content-section">
                <div class="section-header-row">
                  <div class="section-icon">
                    <el-icon><InfoFilled /></el-icon>
                  </div>
                  <h3>说明</h3>
                </div>
                <p class="section-text">{{ getCommand(activeCommand)?.description }}</p>
              </section>

              <!-- 使用场景 -->
              <section class="content-section">
                <div class="section-header-row">
                  <div class="section-icon">
                    <el-icon><UseCase /></el-icon>
                  </div>
                  <h3>使用场景</h3>
                </div>
                <p class="section-text">{{ getCommand(activeCommand)?.usage }}</p>
              </section>

              <!-- 示例 -->
              <section class="content-section">
                <div class="section-header-row">
                  <div class="section-icon">
                    <el-icon><View /></el-icon>
                  </div>
                  <h3>示例</h3>
                </div>
                <div class="examples-list">
                  <div
                    v-for="(example, index) in getCommand(activeCommand)?.examples"
                    :key="index"
                    class="example-card"
                  >
                    <div class="example-code-wrapper">
                      <pre><code>{{ example.code }}</code></pre>
                    </div>
                    <p class="example-explanation">{{ example.explanation }}</p>
                  </div>
                </div>
              </section>

              <!-- 注意事项 -->
              <section class="content-section">
                <div class="section-header-row">
                  <div class="section-icon warning">
                    <el-icon><Warning /></el-icon>
                  </div>
                  <h3>注意事项</h3>
                </div>
                <ul class="tips-list">
                  <li v-for="(tip, index) in getCommand(activeCommand)?.tips" :key="index">
                    {{ tip }}
                  </li>
                </ul>
              </section>

              <!-- 最佳实践 -->
              <section v-if="getCommand(activeCommand)?.bestPractices?.length" class="content-section">
                <div class="section-header-row">
                  <div class="section-icon success">
                    <el-icon><SuccessFilled /></el-icon>
                  </div>
                  <h3>最佳实践</h3>
                </div>
                <ul class="best-practices-list">
                  <li v-for="(practice, index) in getCommand(activeCommand)?.bestPractices" :key="index">
                    {{ practice }}
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="empty-state">
            <div class="empty-icon">
              <el-icon :size="64"><Reading /></el-icon>
            </div>
            <h3>选择一个命令查看详解</h3>
            <p>点击左侧的命令查看详细说明、示例和最佳实践</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.guide-page {
  max-width: 1400px;
  margin: 0 auto;
}

/* 页面标题 */
.page-header {
  margin-bottom: 32px;
  padding: 0 8px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(251, 146, 60, 0.2) 100%);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 16px;
  color: #f59e0b;
}

.header-text h1 {
  font-size: 28px;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 6px 0;
}

.header-text p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* 标签切换 */
.tab-switcher {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  padding: 0 8px;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #f1f5f9;
}

.tab-btn.active {
  background: rgba(36, 150, 237, 0.15);
  border-color: rgba(36, 150, 237, 0.4);
  color: #2496ed;
}

/* 命令容器 */
.commands-container {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
  min-height: calc(100vh - 320px);
}

/* 侧边栏 */
.commands-sidebar {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  overflow: hidden;
  height: fit-content;
  position: sticky;
  top: 100px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.sidebar-title {
  font-size: 14px;
  font-weight: 600;
  color: #f1f5f9;
}

.sidebar-count {
  font-size: 12px;
  color: #64748b;
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 8px;
  border-radius: 12px;
}

.commands-list {
  max-height: calc(100vh - 400px);
  overflow-y: auto;
  padding: 8px;
}

.command-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 4px;
}

.command-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.command-item.active {
  background: rgba(36, 150, 237, 0.15);
}

.command-name {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  font-weight: 500;
  color: #94a3b8;
}

.command-item.active .command-name {
  color: #2496ed;
  font-weight: 600;
}

.active-icon {
  color: #2496ed;
}

/* 命令内容区 */
.command-content {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  min-height: calc(100vh - 320px);
}

.content-wrapper {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.content-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.command-title {
  font-size: 28px;
  font-weight: 700;
  color: #2496ed;
  font-family: 'Consolas', 'Monaco', monospace;
  margin: 0;
}

.command-type {
  font-size: 12px;
  color: #64748b;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 10px;
  border-radius: 20px;
}

.content-body {
  padding: 24px;
}

.content-section {
  margin-bottom: 32px;
}

.content-section:last-child {
  margin-bottom: 0;
}

.section-header-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.section-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(36, 150, 237, 0.1);
  border-radius: 8px;
  color: #2496ed;
}

.section-icon.warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.section-icon.success {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.section-header-row h3 {
  font-size: 16px;
  font-weight: 600;
  color: #f1f5f9;
  margin: 0;
}

.section-text {
  font-size: 14px;
  line-height: 1.8;
  color: #94a3b8;
  margin: 0;
  padding-left: 42px;
}

.code-block {
  margin-left: 42px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  overflow: hidden;
}

.code-block pre {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
}

.code-block code {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #22d3ee;
}

.examples-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-left: 42px;
}

.example-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  overflow: hidden;
}

.example-code-wrapper {
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.example-code-wrapper pre {
  margin: 0;
  padding: 14px;
  overflow-x: auto;
}

.example-code-wrapper code {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  color: #e2e8f0;
  white-space: pre-wrap;
  word-break: break-all;
}

.example-explanation {
  padding: 14px;
  margin: 0;
  font-size: 13px;
  color: #94a3b8;
  line-height: 1.6;
}

.tips-list,
.best-practices-list {
  margin: 0;
  padding-left: 58px;
  list-style: none;
}

.tips-list li,
.best-practices-list li {
  position: relative;
  font-size: 14px;
  line-height: 1.8;
  color: #94a3b8;
  margin-bottom: 8px;
  padding-left: 20px;
}

.tips-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #f59e0b;
  font-weight: bold;
}

.best-practices-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #22c55e;
  font-weight: bold;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  color: #475569;
}

.empty-icon {
  color: rgba(36, 150, 237, 0.3);
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #94a3b8;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
  color: #64748b;
}

/* 响应式 */
@media (max-width: 1024px) {
  .commands-container {
    grid-template-columns: 1fr;
  }
  
  .commands-sidebar {
    position: static;
    max-height: 300px;
  }
  
  .commands-list {
    max-height: 200px;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .tab-switcher {
    flex-direction: column;
  }
  
  .content-header {
    flex-direction: column;
    text-align: center;
  }
  
  .section-text,
  .code-block,
  .examples-list {
    margin-left: 0;
  }
  
  .tips-list,
  .best-practices-list {
    padding-left: 20px;
  }
}
</style>

