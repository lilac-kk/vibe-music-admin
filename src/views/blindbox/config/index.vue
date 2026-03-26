<script setup lang="ts">
import { ref } from "vue";
import { useBlindBoxConfig } from "./utils/hook";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Refresh from "@iconify-icons/ep/refresh";
import Save from "@iconify-icons/ep/save";
import InfoFilled from "@iconify-icons/ep/info-filled";

defineOptions({
  name: "BlindBoxConfig"
});

const cardRef = ref();
const {
  form,
  formRef,
  formRules,
  loading,
  saving,
  fetchConfig,
  saveConfig,
  resetConfig
} = useBlindBoxConfig();
</script>

<template>
  <div class="p-4">
    <el-card
      ref="cardRef"
      v-loading="loading"
      shadow="never"
      class="max-w-4xl mx-auto"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <el-icon :size="20" class="mr-2">
              <component :is="useRenderIcon(InfoFilled)" />
            </el-icon>
            <span class="text-lg font-semibold">盲盒配置管理</span>
          </div>
          <div class="flex gap-2">
            <el-button
              :icon="useRenderIcon(Refresh)"
              @click="fetchConfig"
              :loading="loading"
            >
              刷新配置
            </el-button>
          </div>
        </div>
      </template>

      <el-alert
        title="配置说明"
        type="info"
        :closable="false"
        class="mb-6"
      >
        <div class="text-sm">
          <p>• 盲盒配置用于控制用户端抽取功能的行为和限制</p>
          <p>• 修改配置后实时生效，无需重启服务</p>
          <p>• 建议根据运营策略合理设置每日限额</p>
        </div>
      </el-alert>

      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="150px"
        label-position="left"
        class="config-form"
      >
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="启用盲盒功能" prop="isEnabled">
              <div class="flex items-center">
                <el-switch
                  v-model="form.isEnabled"
                  active-text="启用"
                  inactive-text="禁用"
                  :active-value="true"
                  :inactive-value="false"
                  size="large"
                />
                <el-tag
                  v-if="form.isEnabled"
                  type="success"
                  effect="plain"
                  class="ml-3"
                  size="small"
                >
                  当前状态：启用
                </el-tag>
                <el-tag
                  v-else
                  type="info"
                  effect="plain"
                  class="ml-3"
                  size="small"
                >
                  当前状态：禁用
                </el-tag>
              </div>
              <div class="text-xs text-gray-500 mt-2">
                控制用户是否可以进行盲盒抽取
              </div>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="每日抽取限额" prop="dailyLimit">
              <el-input-number
                v-model="form.dailyLimit"
                :min="1"
                :max="100"
                :step="1"
                controls-position="right"
                size="large"
                class="w-full"
              />
              <div class="text-xs text-gray-500 mt-2">
                用户每天最多可抽取的次数（1-100次）
              </div>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="配置描述">
              <el-input
                v-model="form.description"
                type="textarea"
                :rows="4"
                placeholder="请输入配置描述，用于记录配置变更原因等"
                maxlength="200"
                show-word-limit
              />
              <div class="text-xs text-gray-500 mt-2">
                可选，用于记录配置的目的或变更说明
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider />

        <div class="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div class="text-sm text-gray-600">
            <el-icon class="mr-1">
              <component :is="useRenderIcon(InfoFilled)" />
            </el-icon>
            配置修改后立即生效，请谨慎操作
          </div>
          <div class="flex gap-3">
            <el-button @click="resetConfig">
              重置为默认
            </el-button>
            <el-button
              type="primary"
              :icon="useRenderIcon(Save)"
              :loading="saving"
              @click="saveConfig"
            >
              保存配置
            </el-button>
          </div>
        </div>
      </el-form>
    </el-card>

    <!-- 配置历史记录卡片（可选扩展） -->
    <el-card shadow="never" class="max-w-4xl mx-auto mt-6">
      <template #header>
        <span class="text-lg font-semibold">配置提示</span>
      </template>
      <div class="text-sm text-gray-600">
        <h4 class="font-medium mb-2">💡 最佳实践建议</h4>
        <ul class="list-disc list-inside space-y-1">
          <li>每日限额建议设置为5-10次，既能保证用户体验，又能控制成本</li>
          <li>在活动期间可以临时提高限额，吸引更多用户参与</li>
          <li>修改配置前请与运营团队确认，避免影响用户体验</li>
          <li>建议定期查看数据统计，根据用户行为优化配置</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.config-form {
  :deep(.el-form-item__label) {
    font-weight: 500;
    color: var(--el-text-color-regular);
  }

  :deep(.el-input-number) {
    width: 100%;
  }

  :deep(.el-switch) {
    --el-switch-on-color: #67c23a;
    --el-switch-off-color: #dcdfe6;
  }
}
</style>
