import { ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import {
  getBlindBoxConfig,
  updateBlindBoxConfig
} from "@/api/blindbox";

export function useBlindBoxConfig() {
  const loading = ref(false);
  const saving = ref(false);

  // 表单数据
  const form = reactive({
    dailyLimit: 5,
    isEnabled: true,
    description: ""
  });

  // 表单验证规则
  const formRules = {
    dailyLimit: [
      {
        required: true,
        message: "每日抽取限额为必填项",
        trigger: "blur"
      },
      {
        type: "number",
        min: 1,
        max: 100,
        message: "每日抽取限额必须在1-100之间",
        trigger: "blur"
      }
    ]
  };

  const formRef = ref();

  // 获取盲盒配置
  async function fetchConfig() {
    loading.value = true;
    try {
      const result = await getBlindBoxConfig();
      
      if (result.code === 0 || result.code === 200) {
        const configData = result.data;
        if (configData) {
          Object.assign(form, {
            dailyLimit: configData.dailyLimit ?? 5,
            isEnabled: configData.isEnabled ?? true,
            description: configData.description ?? ""
          });
        }
        message("获取配置成功", { type: "success" });
      } else {
        message("获取配置失败，" + (result.message || ""), { type: "error" });
      }
    } catch (error) {
      console.error("获取盲盒配置失败:", error);
      message("获取盲盒配置失败，请检查网络", { type: "error" });
    } finally {
      loading.value = false;
    }
  }

  // 保存配置
  async function saveConfig() {
    if (!formRef.value) {
      message("表单未正确加载", { type: "error" });
      return;
    }

    // 表单验证
    try {
      await formRef.value.validate();
    } catch (error) {
      message("请检查表单填写是否正确", { type: "warning" });
      return;
    }

    saving.value = true;
    try {
      const result = await updateBlindBoxConfig({
        dailyLimit: form.dailyLimit,
        isEnabled: form.isEnabled,
        description: form.description
      });

      if (result.code === 0 || result.code === 200) {
        message("保存配置成功", { type: "success" });
      } else {
        message("保存配置失败，" + (result.message || ""), { type: "error" });
      }
    } catch (error) {
      console.error("保存盲盒配置失败:", error);
      message("保存盲盒配置失败，请检查网络", { type: "error" });
    } finally {
      saving.value = false;
    }
  }

  // 重置配置
  function resetConfig() {
    Object.assign(form, {
      dailyLimit: 5,
      isEnabled: true,
      description: ""
    });
    message("已重置为默认配置", { type: "info" });
  }

  // 页面加载时获取配置
  onMounted(() => {
    fetchConfig();
  });

  return {
    form,
    formRef,
    formRules,
    loading,
    saving,
    fetchConfig,
    saveConfig,
    resetConfig
  };
}
