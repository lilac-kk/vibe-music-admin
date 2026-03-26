<script setup lang="ts">
import { ref } from "vue";
import { useSongMood } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
 
import Link from "@iconify-icons/ri/link";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
 
defineOptions({
  name: "SongMoodRelation"
});
 
const formRef = ref();
const tableRef = ref();
 
const {
  form,
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
} = useSongMood(tableRef);
</script>
 
<template>
  <div :class="['flex', 'justify-between', deviceDetection() && 'flex-wrap']">
    <div
      :class="[deviceDetection() ? ['w-full', 'mt-2'] : 'w-[calc(100%-0px)]']"
    >
      <el-form
        ref="formRef"
        :inline="true"
        :model="form"
        class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
      >
        <el-form-item label="歌曲名称：" prop="songName">
          <el-input
            v-model="form.songName"
            placeholder="请输入歌曲名称"
            clearable
            class="!w-[180px]"
          />
        </el-form-item>
        <el-form-item label="歌手：" prop="artistId">
          <el-select
            v-model="form.artistId"
            placeholder="请选择歌手"
            clearable
            class="!w-[180px]"
          >
            <el-option
              v-for="artist in artists"
              :key="artist.artistId"
              :label="artist.artistName"
              :value="artist.artistId"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="useRenderIcon('ri:search-line')"
            :loading="loading"
            @click="onSearch"
          >
            搜索
          </el-button>
          <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
            重置
          </el-button>
        </el-form-item>
      </el-form>
 
      <PureTableBar title="歌曲情绪关联" :columns="columns" @refresh="onSearch">
        <template #buttons>
          <el-alert
            title="提示"
            type="info"
            :closable="false"
            class="mb-0"
          >
            点击"关联情绪"按钮为歌曲添加情绪标签
          </el-alert>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <div
            v-if="selectedNum > 0"
            v-motion-fade
            class="bg-[var(--el-fill-color-light)] w-full h-[46px] mb-2 pl-4 flex items-center"
          >
            <div class="flex-auto">
              <span
                style="font-size: var(--el-font-size-base)"
                class="text-[rgba(42,46,54,0.5)] dark:text-[rgba(220,220,242,0.5)]"
              >
                已选 {{ selectedNum }} 项
              </span>
              <el-button type="primary" text @click="onSelectionCancel">
                取消选择
              </el-button>
            </div>
            <span class="text-sm text-gray-500">
              批量关联功能开发中...
            </span>
          </div>
          <pure-table
            ref="tableRef"
            row-key="songId"
            adaptive
            :adaptiveConfig="{ offsetBottom: 108 }"
            align-whole="center"
            table-layout="auto"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :pagination="{ ...pagination, size }"
            :header-cell-style="{
              background: 'var(--el-fill-color-light)',
              color: 'var(--el-text-color-primary)'
            }"
            @selection-change="handleSelectionChange"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
          >
            <template #operation="{ row }">
              <el-button
                class="reset-margin"
                link
                type="primary"
                :size="size"
                :icon="useRenderIcon(Link)"
                @click="openDialog(row)"
              >
                关联情绪
              </el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
