<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { composeInstructions, composeTemplates } from '../data/compose-instructions'
import { copyToClipboard, downloadFile } from '../utils/file'
import { Files, DocumentCopy, Download, Delete, Plus } from '@element-plus/icons-vue'

const composeContent = ref('')
const activeTemplate = ref('')
const editorRef = ref<InstanceType<typeof import('element-plus')['ElInput']> | null>(null)
const cursorPosition = ref(0)

const topLevelInstructions = computed(() =>
  composeInstructions.filter(i => i.category === 'top-level')
)

const serviceInstructions = computed(() =>
  composeInstructions.filter(i => i.category === 'service')
)

// 记录光标位置
const updateCursorPosition = () => {
  const textarea = editorRef.value?.$el?.querySelector('textarea')
  if (textarea) {
    cursorPosition.value = textarea.selectionStart || 0
  }
}

const loadTemplate = (templateName: string) => {
  const template = composeTemplates.find(t => t.name === templateName)
  if (template) {
    composeContent.value = template.content
    activeTemplate.value = templateName
    ElMessage.success(`已加载模板: ${template.name}`)
  }
}

const handleCopy = async () => {
  if (!composeContent.value) {
    ElMessage.warning('内容为空')
    return
  }
  try {
    await copyToClipboard(composeContent.value)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败')
  }
}

const handleDownload = () => {
  if (!composeContent.value) {
    ElMessage.warning('内容为空')
    return
  }
  downloadFile(composeContent.value, 'docker-compose.yml')
  ElMessage.success('文件下载成功')
}

const clearContent = () => {
  composeContent.value = ''
  activeTemplate.value = ''
  ElMessage.info('内容已清空')
}

const insertExample = async (example: string) => {
  const content = composeContent.value
  const pos = cursorPosition.value
  
  // 保存当前滚动位置
  const textarea = editorRef.value?.$el?.querySelector('textarea')
  const scrollTop = textarea?.scrollTop || 0
  
  if (content) {
    // 判断是否需要添加换行符
    const before = content.slice(0, pos)
    const after = content.slice(pos)
    const needNewlineBefore = before.length > 0 && !before.endsWith('\n')
    const needNewlineAfter = after.length > 0 && !after.startsWith('\n')
    
    const insertText = (needNewlineBefore ? '\n' : '') + example + (needNewlineAfter ? '\n' : '')
    composeContent.value = before + insertText + after
    
    // 更新光标位置
    const newPos = pos + insertText.length
    await nextTick()
    if (textarea) {
      textarea.scrollTop = scrollTop
      cursorPosition.value = newPos
    }
  } else {
    composeContent.value = example
    cursorPosition.value = example.length
  }
  
  ElMessage.success('示例已添加')
}
</script>

<template>
  <div class="compose-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <el-icon :size="32"><Files /></el-icon>
        </div>
        <div class="header-text">
          <h1>Docker Compose 生成器</h1>
          <p>可视化配置多容器编排，一键生成 docker-compose.yml 文件</p>
        </div>
      </div>
    </div>

    <!-- 主编辑区 -->
    <div class="editor-grid">
        <!-- 左侧面板 -->
        <div class="instructions-sidebar">
          <div class="sidebar-header">
            <span class="sidebar-title">Compose 指令</span>
            <span class="sidebar-count">{{ topLevelInstructions.length + serviceInstructions.length }} 个</span>
          </div>
          
          <div class="sidebar-body">
            <!-- 模板选择 -->
            <div class="section">
              <div class="section-title">快速模板</div>
              <el-select
                v-model="activeTemplate"
                placeholder="选择项目模板"
                class="template-select"
                popper-class="dark-dropdown"
                @change="loadTemplate"
              >
                <el-option
                  v-for="template in composeTemplates"
                  :key="template.name"
                  :label="template.name"
                  :value="template.name"
                >
                  <div class="template-option">
                    <span class="template-name">{{ template.name }}</span>
                    <span class="template-desc">{{ template.description }}</span>
                  </div>
                </el-option>
              </el-select>
            </div>

            <div class="divider"></div>

            <!-- 顶级指令 -->
            <div class="section">
              <div class="section-title">顶级指令</div>
              <el-collapse accordion>
                <el-collapse-item
                  v-for="instruction in topLevelInstructions"
                  :key="instruction.name"
                  :name="instruction.name"
                >
                  <template #title>
                    <span class="instruction-tag primary">{{ instruction.name }}</span>
                  </template>
                  
                  <div class="instruction-content">
                    <p class="instruction-desc">{{ instruction.description }}</p>
                    
                    <div class="example-box">
                      <div class="example-label">示例</div>
                      <pre class="example-code"><code>{{ instruction.example }}</code></pre>
                    </div>
                    
                    <el-button
                      size="small"
                      type="primary"
                      class="insert-btn"
                      @click="insertExample(instruction.example)"
                    >
                      <el-icon><Plus /></el-icon>
                      插入示例
                    </el-button>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>

            <div class="divider"></div>

            <!-- 服务级指令 -->
            <div class="section">
              <div class="section-title">服务级指令</div>
              <el-collapse accordion>
                <el-collapse-item
                  v-for="instruction in serviceInstructions"
                  :key="instruction.name"
                  :name="instruction.name"
                >
                  <template #title>
                    <span class="instruction-tag secondary">{{ instruction.name }}</span>
                  </template>
                  
                  <div class="instruction-content">
                    <p class="instruction-desc">{{ instruction.description }}</p>
                    
                    <div class="example-box">
                      <div class="example-label">示例</div>
                      <pre class="example-code"><code>{{ instruction.example }}</code></pre>
                    </div>
                    
                    <el-button
                      size="small"
                      type="primary"
                      class="insert-btn"
                      @click="insertExample(instruction.example)"
                    >
                      <el-icon><Plus /></el-icon>
                      插入示例
                    </el-button>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </div>

        <!-- 右侧编辑器 -->
        <div class="editor-content">
          <div class="panel-header">
            <div class="panel-title">
              <el-icon :size="18"><DocumentCopy /></el-icon>
              <span>docker-compose.yml 预览</span>
            </div>
            <div class="panel-actions">
              <el-button size="small" class="action-btn" @click="clearContent">
                <el-icon><Delete /></el-icon>
                清空
              </el-button>
              <el-button size="small" type="primary" class="action-btn" @click="handleCopy">
                <el-icon><DocumentCopy /></el-icon>
                复制
              </el-button>
              <el-button size="small" type="success" class="action-btn" @click="handleDownload">
                <el-icon><Download /></el-icon>
                下载
              </el-button>
            </div>
          </div>
          
          <div class="panel-body editor-body">
            <div class="editor-wrapper">
              <div class="line-numbers" v-if="composeContent">
                <span 
                  v-for="n in composeContent.split('\n').length" 
                  :key="n"
                  class="line-number"
                >{{ n }}</span>
              </div>
              <el-input
                ref="editorRef"
                v-model="composeContent"
                type="textarea"
                :rows="30"
                :autosize="false"
                spellcheck="false"
                placeholder="# 在左侧选择指令或模板，内容将显示在这里..."
                class="code-editor"
                @click="updateCursorPosition"
                @keyup="updateCursorPosition"
                @select="updateCursorPosition"
              />
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<style scoped>
.compose-page {
  max-width: 1600px;
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
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 211, 153, 0.2) 100%);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 16px;
  color: #22c55e;
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

.editor-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
  min-height: calc(100vh - 280px);
}

/* 面板基础样式 */
.panel {
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #f1f5f9;
  font-weight: 600;
  font-size: 15px;
}

.panel-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 8px;
  font-weight: 500;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* 左侧指令侧边栏 */
.instructions-sidebar {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  overflow: hidden;
  height: calc(100vh);
  display: flex;
  flex-direction: column;
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

.sidebar-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
}

.template-select {
  width: 100%;
}

.template-select :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
}

.template-option {
  display: flex;
  flex-direction: column;
  padding: 4px 0;
}

.template-name {
  font-weight: 500;
  color: #f1f5f9;
}

.template-desc {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}



.divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  margin: 20px 0;
}

/* 指令列表 */
:deep(.el-collapse) {
  border: none;
}

:deep(.el-collapse-item__header) {
  background: transparent;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  padding: 12px 0;
  color: #f1f5f9;
}

:deep(.el-collapse-item__wrap) {
  background: transparent;
}

:deep(.el-collapse-item__content) {
  padding: 16px 0;
}

.instruction-tag {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
}

.instruction-tag.primary {
  color: #2496ed;
  background: rgba(36, 150, 237, 0.1);
}

.instruction-tag.secondary {
  color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
}

.instruction-content {
  color: #94a3b8;
}

.instruction-desc {
  font-size: 13px;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.example-box {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
}

.example-label {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.example-code {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 12px;
  color: #22d3ee;
  background: none;
  padding: 0;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

.insert-btn {
  border-radius: 8px;
}

/* 右侧编辑器内容区 */
.editor-content {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  min-height: calc(100vh - 280px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.editor-body {
  padding: 0;
  background: rgba(0, 0, 0, 0.3);
  flex: 1;
}

.editor-wrapper {
  display: flex;
  height: 100%;
  min-height: 600px;
}

.line-numbers {
  display: flex;
  flex-direction: column;
  padding: 16px 12px;
  background: rgba(0, 0, 0, 0.2);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  user-select: none;
}

.line-number {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #475569;
  text-align: right;
  min-width: 24px;
}

.code-editor {
  flex: 1;
}

.code-editor :deep(.el-textarea__inner) {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #e2e8f0;
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 16px;
  resize: none;
  min-height: 600px !important;
}

.code-editor :deep(.el-textarea__inner::placeholder) {
  color: #475569;
}

.code-editor :deep(.el-textarea__inner:focus) {
  box-shadow: none;
}

/* 响应式 */
@media (max-width: 1024px) {
  .editor-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    gap: 16px;
  }
  
  .instructions-sidebar {
    height: 400px;
  }
  
  .sidebar-body {
    flex: 1;
  }
  
  .editor-wrapper {
    min-height: 400px;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .panel-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .panel-actions {
    width: 100%;
  }
  
  .action-btn {
    flex: 1;
    justify-content: center;
  }
}
</style>
