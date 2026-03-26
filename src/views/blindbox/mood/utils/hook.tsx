import editForm from "../form.vue";
import { message } from "@/utils/message";
import { getKeyList, deviceDetection } from "@pureadmin/utils";
import {
  getMoodList,
  addMood,
  updateMood,
  deleteMood
} from "@/api/blindbox";
import { type Ref, h, ref, toRaw, computed, reactive, onMounted } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import type { FormItemProps } from "../utils/types";

export function useMood(tableRef: Ref) {
  const form = reactive({
    name: null
  });
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const selectedNum = ref(0);

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const columns: TableColumnList = [
    {
      label: "勾选列",
      type: "selection",
      fixed: "left",
      reserveSelection: true
    },
    {
      label: "ID",
      prop: "id",
      width: 90
    },
    {
      label: "情绪图标",
      prop: "icon",
      cellRenderer: ({ row }) => (
        <el-image
          fit="cover"
          preview-teleported={true}
          src={row.icon || "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"}
          preview-src-list={[row.icon || "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"]}
          class="w-[64px] h-[64px] rounded-lg align-middle"
        />
      ),
      width: 90
    },
    {
      label: "情绪名称",
      prop: "name",
      minWidth: 150
    },
    {
      label: "情绪描述",
      prop: "description",
      minWidth: 250,
      formatter: ({ description }) => {
        if (!description) return "";
        const maxChars = 50;
        if (description.length > maxChars) {
          return description.slice(0, maxChars) + "...";
        }
        return description;
      }
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];

  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });

  function handleUpdate(row) {
    console.log("查看详情", row);
    // 可以扩展为打开详情弹窗
  }

  function handleDelete(row) {
    deleteMood(row.id).then(res => {
      if (res.code === 0 || res.code === 200) {
        message(`您删除了情绪【${row.name}】`, {
          type: "success"
        });
        onSearch();
      } else {
        message("删除情绪失败，" + (res.message || ""), { type: "error" });
      }
    }).catch(err => {
      console.error("删除情绪失败:", err);
      message("删除情绪失败", { type: "error" });
    });
  }

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  function handleSelectionChange(val) {
    selectedNum.value = val.length;
    tableRef.value?.setAdaptive();
  }

  function onSelectionCancel() {
    selectedNum.value = 0;
    tableRef.value?.getTableRef().clearSelection();
  }

  function onbatchDel() {
    const curSelected = tableRef.value?.getTableRef().getSelectionRows();
    if (!curSelected || curSelected.length === 0) {
      message("请先选择要删除的数据", { type: "warning" });
      return;
    }

    const ids = getKeyList(curSelected, "id");
    // 注意：后端暂时不支持批量删除，这里逐个删除
    let successCount = 0;
    const total = ids.length;
    
    Promise.all(
      ids.map(id => 
        deleteMood(id).then(res => {
          if (res.code === 0 || res.code === 200) {
            successCount++;
          }
        }).catch(err => {
          console.error(`删除情绪 ${id} 失败:`, err);
        })
      )
    ).then(() => {
      if (successCount === total) {
        message(`成功删除 ${successCount} 条数据`, { type: "success" });
      } else {
        message(`删除 ${successCount}/${total} 条数据成功`, { type: "warning" });
      }
      tableRef.value?.getTableRef().clearSelection();
      onSearch();
    }).catch(err => {
      console.error("批量删除失败:", err);
      message("批量删除失败", { type: "error" });
    });
  }

  async function onSearch() {
    loading.value = true;
    try {
      const result = await getMoodList();
      
      if (result.code === 0 || result.code === 200) {
        const moodList = result.data || [];
        
        // 如果有搜索条件，进行过滤
        let filteredList = moodList;
        if (form.name) {
          filteredList = moodList.filter((item: any) => 
            item.name && item.name.includes(form.name)
          );
        }
        
        dataList.value = filteredList;
        pagination.total = filteredList.length;
      } else {
        dataList.value = [];
        pagination.total = 0;
        message("未找到情绪数据", { type: "warning" });
      }
    } catch (error) {
      console.error("获取情绪列表失败:", error);
      dataList.value = [];
      pagination.total = 0;
      message("获取情绪列表失败，请检查网络", { type: "error" });
    }

    setTimeout(() => {
      loading.value = false;
    }, 300);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}情绪`,
      props: {
        formInline: {
          title,
          id: row?.id ?? "",
          name: row?.name ?? "",
          description: row?.description ?? "",
          icon: row?.icon ?? ""
        }
      },
      width: "46%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value?.getRef();
        const curData = options.props.formInline as FormItemProps;
        
        function chores() {
          message(`您${title}了情绪【${curData.name}】`, {
            type: "success"
          });
          done();
          onSearch();
        }

        if (!FormRef) {
          message("表单未正确加载", { type: "error" });
          return;
        }

        FormRef.validate(valid => {
          if (valid) {
            if (title === "新增") {
              addMood(curData).then(res => {
                if (res.code === 0 || res.code === 200) {
                  chores();
                } else {
                  message("新增情绪失败，" + (res.message || ""), { type: "error" });
                }
              }).catch(err => {
                console.error("新增情绪失败:", err);
                message("新增情绪失败", { type: "error" });
              });
            } else {
              updateMood(curData.id!, curData).then(res => {
                if (res.code === 0 || res.code === 200) {
                  chores();
                } else {
                  message("修改情绪失败，" + (res.message || ""), { type: "error" });
                }
              }).catch(err => {
                console.error("修改情绪失败:", err);
                message("修改情绪失败", { type: "error" });
              });
            }
          }
        });
      }
    });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    formRef,
    loading,
    columns,
    dataList,
    selectedNum,
    pagination,
    buttonClass,
    deviceDetection,
    onSearch,
    resetForm,
    openDialog,
    handleUpdate,
    handleDelete,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange,
    onbatchDel
  };
}
