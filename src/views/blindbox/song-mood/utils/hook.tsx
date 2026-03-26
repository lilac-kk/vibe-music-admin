
import { message } from "@/utils/message";
import { getKeyList, deviceDetection } from "@pureadmin/utils";
import {
  getSongList,
  getAllArtists
} from "@/api/system";
import {
  getSongMoods,
  bindMoods
} from "@/api/blindbox";
import { type Ref, h, ref, reactive, computed, onMounted } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import type { FormItemProps } from "../utils/types";
import editForm from "../form.vue";
 
export function useSongMood(tableRef: Ref) {
  const form = reactive({
    pageNum: 1,
    pageSize: 10,
    songName: null,
    artistId: null
  });
  
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const artists = ref([]);
  const selectedNum = ref(0);
  const dialogVisible = ref(false);
  const currentSong = ref<any>(null);
 
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
      label: "歌曲ID",
      prop: "songId",
      width: 90
    },
    {
      label: "歌曲封面",
      prop: "coverUrl",
      cellRenderer: ({ row }) => (
        <el-image
          fit="cover"
          preview-teleported={true}
          src={row.coverUrl || "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"}
          preview-src-list={[row.coverUrl || "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"]}
          class="w-[50px] h-[50px] rounded-lg align-middle"
        />
      ),
      width: 90
    },
    {
      label: "歌曲名称",
      prop: "songName",
      minWidth: 180
    },
    {
      label: "歌手",
      prop: "artistName",
      width: 150
    },
    {
      label: "已关联情绪",
      prop: "moodCount",
      width: 120,
      cellRenderer: ({ row }) => {
        const count = row.moodCount || 0;
        return (
          <el-tag
            type={count > 0 ? "success" : "info"}
            size="small"
          >
            {count} 个情绪
          </el-tag>
        );
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
 
  // 获取歌手列表
  async function fetchArtists() {
    try {
      const result = await getAllArtists();
      if (result.code === 0 || result.code === 200) {
        artists.value = result.data || [];
      }
    } catch (error) {
      console.error("获取歌手列表失败:", error);
    }
  }
 
  // 获取歌曲列表
  async function onSearch() {
    loading.value = true;
    try {
      const result = await getSongList(toRaw(form));
      
      if (result.code === 0 || result.code === 200) {
        const songList = result.data?.items || [];
        
        // 获取每首歌曲的情绪关联数量
        const songsWithMoodCount = await Promise.all(
          songList.map(async (song: any) => {
            try {
              const moodResult = await getSongMoods(song.songId);
              if (moodResult.code === 0 || moodResult.code === 200) {
                song.moodCount = moodResult.data?.length || 0;
              }
            } catch (error) {
              song.moodCount = 0;
            }
            return song;
          })
        );
        
        dataList.value = songsWithMoodCount;
        pagination.total = result.data?.total || 0;
      } else {
        dataList.value = [];
        pagination.total = 0;
        message("未找到歌曲数据", { type: "warning" });
      }
    } catch (error) {
      console.error("获取歌曲列表失败:", error);
      dataList.value = [];
      pagination.total = 0;
      message("获取歌曲列表失败，请检查网络", { type: "error" });
    }
 
    setTimeout(() => {
      loading.value = false;
    }, 300);
  }
 
  // 重置表单
  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };
 
  // 打开关联弹窗
  async function openDialog(row: any) {
    currentSong.value = row;
    
    // 获取歌曲已关联的情绪
    const moodIds: number[] = [];
    try {
      const result = await getSongMoods(row.songId);
      if (result.code === 0 || result.code === 200) {
        const moods = result.data || [];
        moods.forEach((mood: any) => {
          if (mood.id) {
            moodIds.push(mood.id);
          }
        });
      }
    } catch (error) {
      console.error("获取歌曲情绪关联失败:", error);
    }
 
    addDialog({
      title: "关联情绪 - " + row.songName,
      props: {
        formInline: {
          songId: row.songId,
          songName: row.songName,
          coverUrl: row.coverUrl,
          audioUrl: row.audioUrl,
          artistName: row.artistName,
          moodIds: moodIds
        }
      },
      width: "50%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, {
        ref: formRef,
        formInline: null,
        "onUpdate:formInline": (val: FormItemProps) => {
          // 更新 formInline
        }
      }),
      beforeSure: async (done, { options }) => {
        const curData = options.props.formInline as FormItemProps;
        
        try {
          const result = await bindMoods({
            songId: curData.songId,
            moodIds: curData.moodIds
          });
 
          if (result.code === 0 || result.code === 200) {
            message(`成功关联 ${curData.moodIds.length} 个情绪`, {
              type: "success"
            });
            done();
            onSearch();
          } else {
            message("关联情绪失败，" + (result.message || ""), { type: "error" });
          }
        } catch (error) {
          console.error("关联情绪失败:", error);
          message("关联情绪失败", { type: "error" });
        }
      }
    });
  }
 
  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    form.pageSize = val;
    onSearch();
  }
 
  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    form.pageNum = val;
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
 
  onMounted(() => {
    fetchArtists();
    onSearch();
  });
 
  return {
    form,
    formRef,
    loading,
    columns,
    dataList,
    artists,
    selectedNum,
    pagination,
    buttonClass,
    deviceDetection,
    onSearch,
    resetForm,
    openDialog,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange
  };
}
