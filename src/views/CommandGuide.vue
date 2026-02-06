<script setup lang="ts">
import { ref } from 'vue'
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
  <div class="guide-container">
    <div class="guide-header">
      <h1>命令详解</h1>
      <p class="guide-subtitle">深入了解 Dockerfile 和 Docker Compose 中每个命令的含义、用法和最佳实践</p>
    </div>

    <el-tabs v-model="activeTab" @tab-change="switchTab" class="guide-tabs">
      <el-tab-pane label="Dockerfile 命令" name="dockerfile" />
      <el-tab-pane label="Docker Compose 命令" name="docker-compose" />
    </el-tabs>

    <div class="commands-grid">
      <div class="commands-nav">
        <h3>命令列表</h3>
        <div class="command-list">
          <div
            v-for="cmd in currentCommands"
            :key="cmd.name"
            class="command-item"
            :class="{ active: activeCommand === cmd.name }"
            @click="selectCommand(cmd.name)"
          >
            <span class="command-name">{{ cmd.name }}</span>
          </div>
        </div>
      </div>

      <div class="command-detail">
        <template v-if="activeCommand && getCommand(activeCommand)">
          <div class="detail-content">
            <h2 class="detail-title">{{ getCommand(activeCommand)?.name }}</h2>
            
            <section class="detail-section">
              <h3>语法</h3>
              <pre class="syntax-block"><code>{{ getCommand(activeCommand)?.syntax }}</code></pre>
            </section>

            <section class="detail-section">
              <h3>说明</h3>
              <p class="description">{{ getCommand(activeCommand)?.description }}</p>
            </section>

            <section class="detail-section">
              <h3>使用场景</h3>
              <p class="usage">{{ getCommand(activeCommand)?.usage }}</p>
            </section>

            <section class="detail-section">
              <h3>示例</h3>
              <div class="examples-list">
                <div
                  v-for="(example, index) in getCommand(activeCommand)?.examples"
                  :key="index"
                  class="example-item"
                >
                  <pre class="example-code"><code>{{ example.code }}</code></pre>
                  <p class="example-explanation">{{ example.explanation }}</p>
                </div>
              </div>
            </section>

            <section class="detail-section">
              <h3>注意事项</h3>
              <ul class="tips-list">
                <li v-for="(tip, index) in getCommand(activeCommand)?.tips" :key="index">
                  {{ tip }}
                </li>
              </ul>
            </section>

            <section v-if="getCommand(activeCommand)?.bestPractices?.length" class="detail-section">
              <h3>最佳实践</h3>
              <ul class="best-practices-list">
                <li v-for="(practice, index) in getCommand(activeCommand)?.bestPractices" :key="index">
                  {{ practice }}
                </li>
              </ul>
            </section>
          </div>
        </template>

        <template v-else>
          <div class="empty-state">
            <div class="empty-icon">📖</div>
            <h3>选择一个命令查看详解</h3>
            <p>点击左侧的命令查看详细说明、示例和最佳实践</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.guide-container {
  max-width: 1400px;
  margin: 0 auto;
}

.guide-header {
  text-align: center;
  margin-bottom: 30px;
}

.guide-header h1 {
  font-size: 32px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px 0;
}

.guide-subtitle {
  font-size: 16px;
  color: #606266;
  margin: 0;
}

.guide-tabs {
  margin-bottom: 24px;
}

.commands-grid {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 24px;
  min-height: calc(100vh - 280px);
}

.commands-nav {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 84px;
}

.commands-nav h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

.command-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.command-item {
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.command-item:hover {
  background-color: #f5f7fa;
}

.command-item.active {
  background-color: #ecf5ff;
  color: #409EFF;
}

.command-name {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  font-weight: 500;
}

.command-detail {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.detail-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.detail-title {
  font-size: 28px;
  font-weight: 600;
  color: #409EFF;
  font-family: 'Consolas', 'Monaco', monospace;
  margin: 0 0 24px 0;
  padding-bottom: 16px;
  border-bottom: 2px solid #409EFF;
}

.detail-section {
  margin-bottom: 28px;
}

.detail-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px 0;
}

.syntax-block {
  background-color: #1e1e1e;
  color: #d4d4d4;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 0;
}

.syntax-block code {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  line-height: 1.5;
}

.description,
.usage {
  font-size: 15px;
  line-height: 1.8;
  color: #606266;
  margin: 0;
}

.examples-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.example-item {
  border: 1px solid #ebeef5;
  border-radius: 6px;
  overflow: hidden;
}

.example-code {
  background-color: #f8f9fa;
  padding: 12px 16px;
  margin: 0;
  border-bottom: 1px solid #ebeef5;
}

.example-code code {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  color: #303133;
  white-space: pre-wrap;
}

.example-explanation {
  padding: 12px 16px;
  margin: 0;
  font-size: 14px;
  color: #606266;
  background-color: #fff;
}

.tips-list,
.best-practices-list {
  margin: 0;
  padding-left: 20px;
}

.tips-list li,
.best-practices-list li {
  font-size: 14px;
  line-height: 1.8;
  color: #606266;
  margin-bottom: 8px;
}

.best-practices-list li {
  color: #67C23A;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #909399;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 500;
  margin: 0 0 8px 0;
  color: #606266;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}
</style>
