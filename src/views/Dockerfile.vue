<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { dockerfileInstructions, dockerfileTemplates } from '../data/dockerfile-instructions'
import { copyToClipboard, downloadFile } from '../utils/file'

const dockerfileContent = ref('')
const activeTemplate = ref('')
const editorRef = ref<InstanceType<typeof import('element-plus')['ElInput']> | null>(null)
const cursorPosition = ref(0)

// 为每个指令创建独立的输入值
const instructionValues = reactive<Record<string, string>>({})

// 记录光标位置
const updateCursorPosition = () => {
  const textarea = editorRef.value?.$el?.querySelector('textarea')
  if (textarea) {
    cursorPosition.value = textarea.selectionStart || 0
  }
}

const addInstruction = async (instructionName: string) => {
  const value = instructionValues[instructionName]?.trim()
  if (!value) {
    ElMessage.warning('请填写指令值')
    return
  }
  
  const line = `${instructionName} ${value}`
  const content = dockerfileContent.value
  const pos = cursorPosition.value
  
  // 保存当前滚动位置
  const textarea = editorRef.value?.$el?.querySelector('textarea')
  const scrollTop = textarea?.scrollTop || 0
  
  // 在光标位置插入内容
  if (content) {
    // 判断是否需要添加换行符
    const before = content.slice(0, pos)
    const after = content.slice(pos)
    const needNewlineBefore = before.length > 0 && !before.endsWith('\n')
    const needNewlineAfter = after.length > 0 && !after.startsWith('\n')
    
    const insertText = (needNewlineBefore ? '\n' : '') + line + (needNewlineAfter ? '\n' : '')
    dockerfileContent.value = before + insertText + after
    
    // 更新光标位置
    const newPos = pos + insertText.length
    await nextTick()
    if (textarea) {
      textarea.scrollTop = scrollTop
      cursorPosition.value = newPos
    }
  } else {
    dockerfileContent.value = line
    cursorPosition.value = line.length
  }
  
  instructionValues[instructionName] = ''
  ElMessage.success('指令已添加')
}

const loadTemplate = (templateName: string) => {
  const template = dockerfileTemplates.find(t => t.name === templateName)
  if (template) {
    dockerfileContent.value = template.content
    activeTemplate.value = templateName
    ElMessage.success(`已加载模板: ${template.name}`)
  }
}

const handleCopy = async () => {
  if (!dockerfileContent.value) {
    ElMessage.warning('内容为空')
    return
  }
  try {
    await copyToClipboard(dockerfileContent.value)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败')
  }
}

const handleDownload = () => {
  if (!dockerfileContent.value) {
    ElMessage.warning('内容为空')
    return
  }
  downloadFile(dockerfileContent.value, 'Dockerfile')
  ElMessage.success('文件下载成功')
}

const clearContent = () => {
  dockerfileContent.value = ''
  activeTemplate.value = ''
  ElMessage.info('内容已清空')
}
</script>

<template>
  <div class="dockerfile-container">
    <el-row :gutter="24">
      <!-- 左侧指令面板 -->
      <el-col :span="10">
        <el-card class="instruction-panel">
          <template #header>
            <div class="panel-header">
              <span>Dockerfile 指令</span>
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
                v-for="template in dockerfileTemplates"
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

          <!-- 指令列表 -->
          <div class="instructions-list">
            <h4>所有指令</h4>
            <el-collapse accordion>
              <el-collapse-item
                v-for="instruction in dockerfileInstructions"
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
                    <code>{{ instruction.example }}</code>
                  </div>
                  <div class="instruction-input">
                    <el-input
                      v-if="instruction.inputType === 'text'"
                      v-model="instructionValues[instruction.name]"
                      :placeholder="instruction.placeholder"
                    >
                      <template #append>
                        <el-button @click="addInstruction(instruction.name)">
                          添加
                        </el-button>
                      </template>
                    </el-input>
                    <div v-else-if="instruction.inputType === 'textarea'">
                      <el-input
                        v-model="instructionValues[instruction.name]"
                        type="textarea"
                        :rows="3"
                        :placeholder="instruction.placeholder"
                      />
                      <el-button
                        type="primary"
                        size="small"
                        style="margin-top: 8px"
                        @click="addInstruction(instruction.name)"
                      >
                        添加指令
                      </el-button>
                    </div>
                  </div>
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
              <span>Dockerfile 预览</span>
              <div class="header-actions">
                <el-button size="small" @click="clearContent">清空</el-button>
                <el-button size="small" type="primary" @click="handleCopy">复制</el-button>
                <el-button size="small" type="success" @click="handleDownload">下载</el-button>
              </div>
            </div>
          </template>
          <el-input
            ref="editorRef"
            v-model="dockerfileContent"
            type="textarea"
            :rows="28"
            :autosize="false"
            spellcheck="false"
            placeholder="在左侧选择指令或模板，内容将显示在这里...&#10;&#10;您也可以直接在此编辑"
            class="dockerfile-editor"
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
.dockerfile-container {
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
.instructions-list h4 {
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

.instructions-list {
  margin-top: 16px;
}

.instruction-name {
  font-family: monospace;
  font-weight: 600;
  color: #409EFF;
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

.instruction-example code {
  font-family: monospace;
  font-size: 12px;
  color: #303133;
  word-break: break-all;
}

.instruction-input {
  margin-top: 12px;
}

.dockerfile-editor {
  flex: 1;
}

.dockerfile-editor :deep(textarea) {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
  height: 100% !important;
  resize: none;
  -webkit-spellcheck: false;
  spellcheck: false;
}
</style>
