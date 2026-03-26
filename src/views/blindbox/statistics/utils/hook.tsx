import { ref, reactive, onMounted } from "vue";
import { message } from "@/utils/message";
import echarts from "@/plugins/echarts";
import {
  getDrawStatistics,
  getRarityDistribution
} from "@/api/blindbox";
 
export function useBlindBoxStatistics() {
  const loading = ref(false);
  const chartLoading = ref(false);
  
  // 抽取统计图表
  const drawChartRef = ref();
  const drawChartInstance = ref();
  
  // 稀有度分布图表
  const rarityChartRef = ref();
  const rarityChartInstance = ref();
  
  // 统计数据
  const statisticsData = reactive({
    totalDraws: 0,
    todayDraws: 0,
    activeUsers: 0,
    avgDrawsPerUser: 0
  });
  
  // 时间范围选择
  const timeRange = ref("7"); // 默认7天
 
  // 初始化抽取统计图表
  function initDrawChart() {
    if (!drawChartRef.value) return;
    
    drawChartInstance.value = echarts.init(drawChartRef.value);
    
    const option = {
      title: {
        text: "抽取趋势",
        left: "center",
        textStyle: {
          fontSize: 16,
          fontWeight: 600
        }
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: {
        type: "category",
        data: [],
        boundaryGap: true,
        axisLabel: {
          rotate: 30
        }
      },
      yAxis: {
        type: "value",
        name: "抽取次数"
      },
      series: [
        {
          name: "抽取次数",
          type: "bar",
          data: [],
          itemStyle: {
            color: "#409EFF",
            borderRadius: [4, 4, 0, 0]
          },
          barWidth: "40%"
        },
        {
          name: "趋势",
          type: "line",
          data: [],
          smooth: true,
          itemStyle: {
            color: "#67C23A"
          },
          lineStyle: {
            width: 3
          }
        }
      ]
    };
    
    drawChartInstance.value.setOption(option);
  }
  
  // 初始化稀有度分布图表
  function initRarityChart() {
    if (!rarityChartRef.value) return;
    
    rarityChartInstance.value = echarts.init(rarityChartRef.value);
    
    const option = {
      title: {
        text: "稀有度分布",
        left: "center",
        textStyle: {
          fontSize: 16,
          fontWeight: 600
        }
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
        orient: "vertical",
        left: "left",
        top: "middle"
      },
      series: [
        {
          name: "抽取次数",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: "{b}: {d}%"
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: "bold"
            }
          },
          data: []
        }
      ]
    };
    
    rarityChartInstance.value.setOption(option);
  }
  
  // 获取统计数据
  async function fetchStatistics() {
    loading.value = true;
    chartLoading.value = true;
    
    try {
      // 并行获取两个接口的数据
      const [drawResult, rarityResult] = await Promise.all([
        getDrawStatistics(),
        getRarityDistribution()
      ]);
      
      // 处理抽取统计数据
      if (drawResult.code === 0 || drawResult.code === 200) {
        const drawData = drawResult.data;
        
        // 更新统计卡片数据
        statisticsData.totalDraws = drawData.totalDraws || 0;
        statisticsData.todayDraws = drawData.todayDraws || 0;
        statisticsData.activeUsers = drawData.activeUsers || 0;
        statisticsData.avgDrawsPerUser = drawData.avgDrawsPerUser || 0;
        
        // 更新抽取趋势图表
        if (drawChartInstance.value && drawData.trendData) {
          drawChartInstance.value.setOption({
            xAxis: {
              data: drawData.trendData.dates || []
            },
            series: [
              {
                data: drawData.trendData.counts || []
              },
              {
                data: drawData.trendData.counts || []
              }
            ]
          });
        }
      }
      
      // 处理稀有度分布数据
      if (rarityResult.code === 0 || rarityResult.code === 200) {
        const rarityData = rarityResult.data;
        
        // 更新稀有度分布图表
        if (rarityChartInstance.value && rarityData) {
          const pieData = Object.entries(rarityData).map(([name, value]) => ({
            name,
            value: value as number
          }));
          
          rarityChartInstance.value.setOption({
            series: [
              {
                data: pieData
              }
            ]
          });
        }
      }
      
      message("统计数据加载成功", { type: "success" });
    } catch (error) {
      console.error("获取统计数据失败:", error);
      message("获取统计数据失败，请检查网络", { type: "error" });
    } finally {
      loading.value = false;
      chartLoading.value = false;
    }
  }
  
  // 刷新数据
  function refresh() {
    fetchStatistics();
  }
  
  // 切换时间范围
  function changeTimeRange(range: string) {
    timeRange.value = range;
    fetchStatistics();
  }
  
  // 窗口大小变化时重绘图表
  function handleResize() {
    drawChartInstance.value?.resize();
    rarityChartInstance.value?.resize();
  }
  
  // 页面卸载时销毁图表实例
  function beforeUnmount() {
    drawChartInstance.value?.dispose();
    rarityChartInstance.value?.dispose();
  }
  
  onMounted(() => {
    // 初始化图表
    setTimeout(() => {
      initDrawChart();
      initRarityChart();
      fetchStatistics();
    }, 100);
    
    // 监听窗口大小变化
    window.addEventListener("resize", handleResize);
  });
  
  return {
    loading,
    chartLoading,
    drawChartRef,
    rarityChartRef,
    statisticsData,
    timeRange,
    refresh,
    changeTimeRange,
    beforeUnmount
  };
}
