<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { getMoodList } from "@/api/blindbox";
import { FormProps } from "./utils/types";
 
const props = defineProps<FormProps>();
const emit = defineEmits(["update:formInline"]);
 
const loading = ref(false);
const allMoods = ref<any[]>([]);
 
// 已选择的情绪ID列表
const selectedMoodIds = ref<number[]>([]);
 
// 监听 props 变化
watch(
  () => props.formInline,
  val => {
    selectedMoodIds.value = [...val.moodIds];
  },
  { immediate: true, deep: true }
);
 
// 监听选择变化
watch(selectedMoodIds, val => {
  emit("update:formInline", {
    ...props.formInline,
    moodIds: [...val]
  });
});
 
// 获取所有情绪列表
async function fetchMoods() {
  loading.value = true;
  try {
    const result = await getMoodList();
    if (result.code === 0 || result.code === 200) {
      allMoods.value = result.data || [];
    }
  } catch (error) {
    console.error("获取情绪列表失败:", error);
  } finally {
    loading.value = false;
  }
}
 
// 计算已选择的情绪
const selectedMoods = computed(() => {
  return allMoods.value.filter(mood => 
    selectedMoodIds.value.includes(mood.id)
  );
});
 
// 计算未选择的情绪
const availableMoods = computed(() => {
  return allMoods.value.filter(mood => 
    !selectedMoodIds.value.includes(mood.id)
  );
});
 
// 添加情绪
function addMood(moodId: number) {
  if (!selectedMoodIds.value.includes(moodId)) {
    selectedMoodIds.value.push(moodId);
  }
}
 
// 移除情绪
function removeMood(moodId: number) {
  const index = selectedMoodIds.value.indexOf(moodId);
  if (index > -1) {
    selectedMoodIds.value.splice(index, 1);
  }
}
 
// 清空已选
function clearSelected() {
  selectedMoodIds.value = [];
}
 
onMounted(() => {
  fetchMoods();
});
</script>
 
<template>
  <div class="song-mood-form">
    <el-alert
      title="歌曲信息"
      type="info"
      :closable="false"
      class="mb-4"
    >
      <div class="flex items-center">
        <el-image
          :src="formInline.coverUrl || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"
          class="w-16 h-16 rounded-lg mr-4"
          fit="cover"
        />
        <div>
          <div class="font-semibold text-base">
            {{ formInline.songName }}
          </div>
          <div class="text-sm text-gray-500">
            歌手：{{ formInline.artistName || '未知' }}
          </div>
        </div>
      </div>
    </el-alert>
 
    <div class="mb-4">
      <div class="text-sm font-medium mb-2">
        已关联情绪（{{ selectedMoodIds.length }}）
        <el-button
          v-if="selectedMoodIds.length > 0"
          type="danger"
          text
          size="small"
          @click="clearSelected"
        >
          清空全部
        </el-button>
      </div>
      <div
        v-if="selectedMoods.length > 0"
        class="flex flex-wrap gap-2"
      >
        <el-tag
          v-for="mood in selectedMoods"
          :key="mood.id"
          closable
          @close="removeMood(mood.id)"
          class="mood-tag"
        >
          <div class="flex items-center">
            <el-image
              v-if="mood.icon"
              :src="mood.icon"
              class="w-5 h-5 rounded mr-2"
              fit="cover"
            />
            {{ mood.name }}
          </div>
        </el-tag>
      </div>
      <el-empty
        v-else
        description="暂无关联情绪"
        :image-size="60"
      />
    </div>
 
    <div class="mb-4">
      <div class="text-sm font-medium mb-2">
        可选情绪（{{ availableMoods.length }}）
      </div>
      <div v-loading="loading">
        <div
          v-if="availableMoods.length > 0"
          class="grid grid-cols-3 gap-2"
        >
          <div
            v-for="mood in availableMoods"
            :key="mood.id"
            class="mood-card"
            @click="addMood(mood.id)"
          >
            <div class="flex items-center p-3 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
              <el-image
                v-if="mood.icon"
                :src="mood.icon"
                class="w-8 h-8 rounded mr-3"
                fit="cover"
              />
              <div class="flex-1">
                <div class="font-medium text-sm">
                  {{ mood.name }}
                </div>
                <div class="text-xs text-gray-500 truncate">
                  {{ mood.description || '暂无描述' }}
                </div>
              </div>
              <el-icon class="text-blue-500">
                <component is="el-icon-plus" />
              </el-icon>
            </div>
          </div>
        </div>
        <el-empty
          v-else-if="!loading"
          description="所有情绪已关联"
          :image-size="60"
        />
      </div>
    </div>
  </div>
</template>
 
<style scoped>
.mood-tag {
  padding: 8px 12px;
  height: auto;
}
 
.mood-card {
  transition: all 0.3s ease;
}
 
.mood-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
