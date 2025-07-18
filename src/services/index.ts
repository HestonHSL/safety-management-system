// API服务统一导出
// 根据环境变量决定使用模拟API还是真实API

import * as mockApi from './api';
import * as realApi from './realApi';

// 开发环境下的API切换标志
const USE_REAL_API = process.env.NODE_ENV === 'production' || process.env.REACT_APP_USE_REAL_API === 'true';

console.log(`[API] 当前使用 ${USE_REAL_API ? '真实' : '模拟'} API`);

// 根据配置选择API实现
export const authApi = USE_REAL_API ? realApi.authApi : mockApi.authApi;
export const departmentApi = USE_REAL_API ? realApi.departmentApi : mockApi.departmentApi;
export const regionApi = USE_REAL_API ? realApi.regionApi : mockApi.regionApi;
export const safetyOfficerApi = USE_REAL_API ? realApi.safetyOfficerApi : mockApi.safetyOfficerApi;
export const pointApi = USE_REAL_API ? realApi.pointApi : mockApi.pointApi;
export const userApi = USE_REAL_API ? realApi.userApi : mockApi.userApi;
export const getSelectOptions = USE_REAL_API ? realApi.getSelectOptions : mockApi.getSelectOptions;

// 如果使用真实API，导出额外的API
export const uploadApi = USE_REAL_API ? realApi.uploadApi : undefined;
export const downloadApi = USE_REAL_API ? realApi.downloadApi : mockApi.downloadApi;

// 导出配置信息
export const API_CONFIG = {
  USE_REAL_API,
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
  ENV: process.env.NODE_ENV,
};

// 导出所有类型定义
export * from '../types'; 