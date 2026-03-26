<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
    id: 0,
    name: "",
    weight: 0,
    color: "#409EFF",
    icon: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

// 预设颜色选项
const presetColors = [
  "#409EFF", "#67C23A", "#E6A23C", "#F56C6C",
  "#909399", "#1890ff", "#52c41a", "#faad14",
  "#f5222d", "#722ed1", "#eb2f96", "#fa8c16"
];

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="100px"
  >
    <el-row :gutter="30">
      <re-col
        v-if="newFormInline.title === '修改'"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="稀有度ID" prop="id">
          <el-input
            v-model="newFormInline.id"
            disabled
            placeholder="稀有度ID"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="稀有度名称" prop="name" required>
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入稀有度名称，如：普通、稀有、史诗"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="权重" prop="weight" required>
          <el-input-number
            v-model="newFormInline.weight"
            :min="0"
            :max="100"
            :step="1"
            controls-position="right"
            class="w-full"
            placeholder="请输入权重，建议总和为100"
          />
          <div class="text-xs text-gray-500 mt-1">
            抽取概率权重，数值越大概率越高
          </div>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="显示颜色" prop="color" required>
          <div class="flex items-center w-full">
            <el-color-picker
              v-model="newFormInline.color"
              :predefine="presetColors"
              show-alpha
              class="mr-3"
            />
            <el-input
              v-model="newFormInline.color"
              placeholder="请选择或输入颜色值"
              clearable
              class="flex-1"
            />
          </div>
          <div class="text-xs text-gray-500 mt-1">
            用于稀有度标签的显示颜色
          </div>
        </el-form-item>
      </re-col>

      <re-col>
        <el-form-item label="稀有度图标">
          <div class="flex items-center">
            <el-image
              v-if="newFormInline.icon"
              :src="newFormInline.icon"
              class="w-20 h-20 rounded-lg mr-4"
              fit="cover"
            />
            <el-input
              v-model="newFormInline.icon"
              placeholder="请输入图标URL（可选）"
              clearable
              class="w-full"
            />
          </div>
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>

<style scoped>
.w-20 {
  width: 5rem;
}
.h-20 {
  height: 5rem;
}
</style>
