import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("情绪名称为必填项"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});
