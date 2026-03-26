<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { useBlindBoxStatistics } from "./utils/hook";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
 
import Refresh from "@iconify-icons/ep/refresh";
import DataAnalysis from "@iconify-icons/ri/bar-chart-box-line";
import TrendUp from "@iconify-icons/ri/trend-up-line";
import User from "@iconify-icons/ri/user-line";
import Calendar from "@iconify-icons/ri/calendar-line";
 
defineOptions({
  name: "BlindBoxStatistics"
});
 
const {
  loading,
  chartLoading,
  drawChartRef,
  rarityChartRef,
  statisticsData,
  timeRange,
  refresh,
  changeTimeRange,
  beforeUnmount
} = useBlindBoxStatistics();
 
onBeforeUnmount(() => {
  beforeUnmount();
});
</script>
 
<template>
  <div class="p-4">
    <!-- 顶部操作栏 -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <el-icon :size="24" class="mr-2 text-blue-500">
          <component :is="useRenderIcon(DataAnalysis)" />
        </el-icon>
        <span class="text-lg font-semibold">数据统计</span>
      </div>
      <div class="flex items-center gap-3">
        <el-select
          v-model="timeRange"
          placeholder="选择时间范围"
          @change="changeTimeRange"
          class="w-32"
        >
          <el-option label="最近7天" value="7" />
          <el-option label="最近30天" value="30" />
          <el-option label="最近90天" value="90" />
        </el-select>
        <el-button
          type="primary"
          :icon="useRenderIcon(Refresh)"
          :loading="loading"
          @click="refresh"
        >
          刷新数据
        </el-button>
      </div>
    </div>
 
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="mb-4">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-500 mb-1">总抽取次数</div>
              <div class="text-2xl font-bold text-blue-600">
                {{ statisticsData.totalDraws }}
              </div>
            </div>
            <el-icon :size="40" class="text-blue-100">
              <component :is="useRenderIcon(TrendUp)" />
            </el-icon>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-500 mb-1">今日抽取</div>
              <div class="text-2xl font-bold text-green-600">
                {{ statisticsData.todayDraws }}
              </div>
            </div>
            <el-icon :size="40" class="text-green-100">
              <component :is="useRenderIcon(Calendar)" />
            </el-icon>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-500 mb-1">活跃用户</div>
              <div class="text-2xl font-bold text-orange-600">
                {{ statisticsData.activeUsers }}
              </div>
            </div>
            <el-icon :size="40" class="text-orange-100">
              <component :is="useRenderIcon(User)" />
            </el-icon>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-500 mb-1">人均抽取</div>
              <div class="text-2xl font-bold text-purple-600">
                {{ statisticsData.avgDrawsPerUser.toFixed(2) }}
              </div>
            </div>
            <el-icon :size="40" class="text-purple-100">
              <component :is="useRenderIcon(DataAnalysis)" />
            </el-icon>
          </div>
        </el-card>
      </el-col>
    </el-row>
 
    <!-- 图表区域 -->
    <el-row :gutter="20">
      <el-col :xs="24" :lg="14">
        <el-card shadow="never" class="chart-card">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-semibold">抽取趋势</span>
              <el-tag type="info" size="small">
                {{ timeRange === "7" ? "最近7天" : timeRange === "30" ? "最近30天" : "最近90天" }}
              </el-tag>
            </div>
          </template>
          <div
            ref="drawChartRef"
            v-loading="chartLoading"
            class="chart-container"
          ></div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :lg="10">
        <el-card shadow="never" class="chart-card">
          <template #header>
            <span class="font-semibold">稀有度分布</span>
          </template>
          <div
            ref="rarityChartRef"
            v-loading="chartLoading"
            class="chart-container"
          ></div>
        </el-card>
      </el-col>
    </el-row>
 
    <!-- 数据说明 -->
    <el-card shadow="never" class="mt-4">
      <template #header>
        <span class="font-semibold">数据说明</span>
      </template>
      <div class="text-sm text-gray-600 space-y-2">
        <p>• <strong>总抽取次数</strong>：从系统上线至今的所有盲盒抽取次数总和</p>
        <p>• <strong>今日抽取</strong>：当天00:00:00至23:59:59的抽取次数</p>
        <p>• <strong>活跃用户</strong>：在选定时间范围内至少抽取过一次的用户数量</p>
        <p>• <strong>人均抽取</strong>：总抽取次数与活跃用户数量的比值</p>
        <p>• <strong>抽取趋势</strong>：展示每日抽取次数的变化趋势，柱状图表示次数，折线图表示趋势</p>
        <p>• <strong>稀有度分布</strong>：展示各稀有度级别的抽取占比，帮助分析用户运气分布</p>
      </div>
    </el-card>
  </div>
</template>
 
<style scoped lang="scss">
.stat-card {
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
}
 
.chart-card {
  :deep(.el-card__body) {
    padding: 20px;
  }
}
 
.chart-container {
  width: 100%;
  height: 400px;
}
 
.space-y-2 > * + * {
  margin-top: 0.5rem;
}
</style>
