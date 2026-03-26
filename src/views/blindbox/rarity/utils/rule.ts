import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("稀有度名称为必填项"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  weight: [
    {
      validator: (rule, value, callback) => {
        if (value === "" || value === null || value === undefined) {
          callback(new Error("权重为必填项"));
        } else if (value < 0 || value > 100) {
          callback(new Error("权重必须在0-100之间"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  color: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("颜色为必填项"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});
