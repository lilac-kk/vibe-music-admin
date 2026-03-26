import editForm from "../form.vue";
import { message } from "@/utils/message";
import { getKeyList, deviceDetection } from "@pureadmin/utils";
import {
  getRarityList,
  addRarity,
  updateRarity,
  deleteRarity
} from "@/api/blindbox";
import { type Ref, h, ref, toRaw, computed, reactive, onMounted } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import type { FormItemProps } from "../utils/types";

export function useRarity(tableRef: Ref) {
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
      label: "稀有度图标",
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
      label: "稀有度名称",
      prop: "name",
      minWidth: 150,
      cellRenderer: ({ row, props }) => {
        const color = row.color || "#409EFF";
        return (
          <el-tag
            size={props.size}
            style={{
              backgroundColor: `${color}20`,
              color: color,
              border: `1px solid ${color}40`
            }}
          >
            {row.name}
          </el-tag>
        );
      }
    },
    {
      label: "权重",
      prop: "weight",
      width: 120,
      cellRenderer: ({ row }) => {
        return (
          <div class="flex items-center">
            <el-progress
              percentage={row.weight}
              color={row.color || "#409EFF"}
              :stroke-width="8"
              :show-text="true"
            />
          </div>
        );
      }
    },
    {
      label: "颜色",
      prop: "color",
      width: 120,
      cellRenderer: ({ row }) => (
        <div class="flex items-center justify-center">
          <el-color-picker
            v-model={row.color}
            disabled
            show-alpha
            size="small"
          />
          <span class="ml-2 text-sm">{row.color}</span>
        </div>
      )
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
    deleteRarity(row.id).then(res => {
      if (res.code === 0 || res.code === 200) {
        message(`您删除了稀有度【${row.name}】`, {
          type: "success"
        });
        onSearch();
      } else {
        message("删除稀有度失败，" + (res.message || ""), { type: "error" });
      }
    }).catch(err => {
      console.error("删除稀有度失败:", err);
      message("删除稀有度失败", { type: "error" });
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
        deleteRarity(id).then(res => {
          if (res.code === 0 || res.code === 200) {
            successCount++;
          }
        }).catch(err => {
          console.error(`删除稀有度 ${id} 失败:`, err);
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
      const result = await getRarityList();
      
      if (result.code === 0 || result.code === 200) {
        const rarityList = result.data || [];
        
        // 如果有搜索条件，进行过滤
        let filteredList = rarityList;
        if (form.name) {
          filteredList = rarityList.filter((item: any) => 
            item.name && item.name.includes(form.name)
          );
        }
        
        dataList.value = filteredList;
        pagination.total = filteredList.length;
      } else {
        dataList.value = [];
        pagination.total = 0;
        message("未找到稀有度数据", { type: "warning" });
      }
    } catch (error) {
      console.error("获取稀有度列表失败:", error);
      dataList.value = [];
      pagination.total = 0;
      message("获取稀有度列表失败，请检查网络", { type: "error" });
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
      title: `${title}稀有度`,
      props: {
        formInline: {
          title,
          id: row?.id ?? "",
          name: row?.name ?? "",
          weight: row?.weight ?? 0,
          color: row?.color ?? "#409EFF",
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
          message(`您${title}了稀有度【${curData.name}】`, {
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
              addRarity(curData).then(res => {
                if (res.code === 0 || res.code === 200) {
                  chores();
                } else {
                  message("新增稀有度失败，" + (res.message || ""), { type: "error" });
                }
              }).catch(err => {
                console.error("新增稀有度失败:", err);
                message("新增稀有度失败", { type: "error" });
              });
            } else {
              updateRarity(curData.id!, curData).then(res => {
                if (res.code === 0 || res.code === 200) {
                  chores();
                } else {
                  message("修改稀有度失败，" + (res.message || ""), { type: "error" });
                }
              }).catch(err => {
                console.error("修改稀有度失败:", err);
                message("修改稀有度失败", { type: "error" });
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
