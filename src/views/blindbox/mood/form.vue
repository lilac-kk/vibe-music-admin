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
    description: "",
    icon: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

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
        <el-form-item label="情绪ID" prop="id">
          <el-input
            v-model="newFormInline.id"
            disabled
            placeholder="情绪ID"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="情绪名称" prop="name" required>
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入情绪名称"
          />
        </el-form-item>
      </re-col>

      <re-col>
        <el-form-item label="情绪描述">
          <el-input
            v-model="newFormInline.description"
            placeholder="请输入情绪描述"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 10 }"
          />
        </el-form-item>
      </re-col>

      <re-col>
        <el-form-item label="情绪图标">
          <div class="flex items-center">
            <el-image
              v-if="newFormInline.icon"
              :src="newFormInline.icon"
              class="w-20 h-20 rounded-lg mr-4"
              fit="cover"
            />
            <el-input
              v-model="newFormInline.icon"
              placeholder="请输入图标URL"
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
