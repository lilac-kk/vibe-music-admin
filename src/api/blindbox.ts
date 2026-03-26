import { http } from "@/utils/http";

// ==================== 类型定义 ====================

export type Result = {
  code: number;
  message: string;
  data?: any;
};

export type ResultTable = {
  code: number;
  message: string;
  data?: {
    items: Array<any>;
    total?: number;
    pageSize?: number;
    currentPage?: number;
  };
};

// ==================== 用户端接口 ====================

export const drawBlindBox = (data: {
  userId: number;
  moodId?: number;
  isRandom: boolean;
}) => {
  return http.request<Result>("post", "/blindbox/draw", {
    data
  });
};

export const getDrawHistory = (userId: number) => {
  return http.request<Result>("get", `/blindbox/history/${userId}`);
};

export const getBlindBoxConfig = () => {
  return http.request<Result>("get", "/blindbox/config");
};

// ==================== 管理端接口 ====================

// 情绪管理
export const getMoodList = () => {
  return http.request<Result>("get", "/blindbox/admin/mood/list");
};

export const addMood = (data: {
  name: string;
  description?: string;
  icon?: string;
}) => {
  return http.request<Result>("post", "/blindbox/admin/mood", {
    data
  });
};

export const updateMood = (id: number, data: any) => {
  return http.request<Result>("put", `/blindbox/admin/mood/${id}`, {
    data
  });
};

export const deleteMood = (id: number) => {
  return http.request<Result>("delete", `/blindbox/admin/mood/${id}`);
};

export const getMoodDetail = (id: number) => {
  return http.request<Result>("get", `/blindbox/admin/mood/${id}`);
};

// 稀有度管理
export const getRarityList = () => {
  return http.request<Result>("get", "/blindbox/admin/rarity/list");
};

export const addRarity = (data: any) => {
  return http.request<Result>("post", "/blindbox/admin/rarity", {
    data
  });
};

export const updateRarity = (id: number, data: any) => {
  return http.request<Result>("put", `/blindbox/admin/rarity/${id}`, {
    data
  });
};

export const deleteRarity = (id: number) => {
  return http.request<Result>("delete", `/blindbox/admin/rarity/${id}`);
};

// 配置管理
export const updateBlindBoxConfig = (data: any) => {
  return http.request<Result>("put", "/blindbox/admin/config", {
    data
  });
};

// 歌曲情绪
export const getSongMoods = (songId: number) => {
  return http.request<Result>("get", `/blindbox/admin/song/${songId}/moods`);
};

export const bindMoods = (data: any) => {
  return http.request<Result>("post", "/blindbox/admin/song/mood/bind", {
    data
  });
};

// 统计
export const getDrawStatistics = () => {
  return http.request<Result>("get", "/blindbox/admin/statistics/draw");
};

export const getRarityDistribution = () => {
  return http.request<Result>("get", "/blindbox/admin/statistics/rarity");
};
