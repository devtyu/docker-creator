<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { composeInstructions, composeTemplates } from '../data/compose-instructions'
import { copyToClipboard, downloadFile } from '../utils/file'

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
  <div class="compose-container">
    <el-row :gutter="24">
      <!-- 左侧指令面板 -->
      <el-col :span="10">
        <el-card class="instruction-panel">
          <template #header>
            <div class="panel-header">
              <span>Docker Compose 指令</span>
            </div>
          </template>

          <!-- 模板选择 -->
          <div class="template-section">
            <h4>快速模板</h4>
            <el-select
              v-model="activeTemplate"
              placeholder="选择项目模板"
              style="width: 100%"
              @change="loadTemplate"
            >
              <el-option
                v-for="template in composeTemplates"
                :key="template.name"
                :label="template.name"
                :value="template.name"
              >
                <div class="template-option">
                  <span>{{ template.name }}</span>
                  <span class="template-desc">{{ template.description }}</span>
                </div>
              </el-option>
            </el-select>
          </div>

          <el-divider />

          <!-- 顶级指令 -->
          <div class="instructions-section">
            <h4>顶级指令</h4>
            <el-collapse accordion>
              <el-collapse-item
                v-for="instruction in topLevelInstructions"
                :key="instruction.name"
                :name="instruction.name"
              >
                <template #title>
                  <span class="instruction-name">{{ instruction.name }}</span>
                </template>
                <div class="instruction-detail">
                  <p class="instruction-desc">{{ instruction.description }}</p>
                  <div class="instruction-example">
                    <strong>示例:</strong>
                    <pre><code>{{ instruction.example }}</code></pre>
                  </div>
                  <el-button
                    size="small"
                    type="primary"
                    @click="insertExample(instruction.example)"
                  >
                    插入示例
                  </el-button>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>

          <el-divider />

          <!-- 服务级指令 -->
          <div class="instructions-section">
            <h4>服务级指令</h4>
            <el-collapse accordion>
              <el-collapse-item
                v-for="instruction in serviceInstructions"
                :key="instruction.name"
                :name="instruction.name"
              >
                <template #title>
                  <span class="instruction-name">{{ instruction.name }}</span>
                </template>
                <div class="instruction-detail">
                  <p class="instruction-desc">{{ instruction.description }}</p>
                  <div class="instruction-example">
                    <strong>示例:</strong>
                    <pre><code>{{ instruction.example }}</code></pre>
                  </div>
                  <el-button
                    size="small"
                    type="primary"
                    @click="insertExample(instruction.example)"
                  >
                    插入示例
                  </el-button>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧编辑区 -->
      <el-col :span="14">
        <el-card class="editor-panel">
          <template #header>
            <div class="panel-header">
              <span>docker-compose.yml 预览</span>
              <div class="header-actions">
                <el-button size="small" @click="clearContent">清空</el-button>
                <el-button size="small" type="primary" @click="handleCopy">复制</el-button>
                <el-button size="small" type="success" @click="handleDownload">下载</el-button>
              </div>
            </div>
          </template>
          <el-input
            ref="editorRef"
            v-model="composeContent"
            type="textarea"
            :rows="28"
            :autosize="false"
            spellcheck="false"
            placeholder="在左侧选择指令或模板，内容将显示在这里...&#10;&#10;您也可以直接在此编辑"
            class="compose-editor"
            @click="updateCursorPosition"
            @keyup="updateCursorPosition"
            @select="updateCursorPosition"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.compose-container {
  max-width: 1400px;
  margin: 0 auto;
}

.instruction-panel,
.editor-panel {
  height: calc(100vh - 130px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.instruction-panel :deep(.el-card__body) {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.editor-panel :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.template-section h4,
.instructions-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #606266;
}

.template-option {
  display: flex;
  flex-direction: column;
}

.template-desc {
  font-size: 12px;
  color: #909399;
}

.instructions-section {
  margin-top: 16px;
}

.instruction-name {
  font-family: monospace;
  font-weight: 600;
  color: #67C23A;
}

.instruction-detail {
  padding: 8px 0;
}

.instruction-desc {
  font-size: 13px;
  color: #606266;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.instruction-example {
  background-color: #f5f7fa;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 12px;
}

.instruction-example pre {
  margin: 8px 0 0 0;
  white-space: pre-wrap;
}

.instruction-example code {
  font-family: monospace;
  font-size: 12px;
  color: #303133;
}

.compose-editor {
  flex: 1;
}

.compose-editor :deep(textarea) {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
  height: 100% !important;
  resize: none;
  -webkit-spellcheck: false;
  spellcheck: false;
}
</style>
