interface FormItemProps {
  /** 用于判断是`新增`还是`修改` */
  title: string;
  id?: number;
  name: string;
  description?: string;
  icon?: string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
