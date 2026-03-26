export default {
  path: "/blindbox",
  redirect: "/blindbox/mood",
  meta: {
    icon: "ri:gift-fill",
    title: "盲盒管理",
    rank: 8
  },
  children: [
    {
      path: "/blindbox/mood",
      name: "MoodManagement",
      component: () => import("@/views/blindbox/mood/index.vue"),
      meta: { title: "情绪标签管理" }
    },
    {
      path: "/blindbox/rarity",
      name: "RarityManagement",
      component: () => import("@/views/blindbox/rarity/index.vue"),
      meta: { title: "稀有度配置" }
    },
    {
      path: "/blindbox/config",
      name: "BlindBoxConfig",
      component: () => import("@/views/blindbox/config/index.vue"),
      meta: { title: "盲盒配置" }
    },
    {
      path: "/blindbox/song-mood",
      name: "SongMoodRelation",
      component: () => import("@/views/blindbox/song-mood/index.vue"),
      meta: { title: "歌曲情绪关联" }
    },
    {
      path: "/blindbox/statistics",
      name: "BlindBoxStatistics",
      component: () => import("@/views/blindbox/statistics/index.vue"),
      meta: { title: "数据统计" }
    }
  ]
} satisfies RouteConfigsTable;
