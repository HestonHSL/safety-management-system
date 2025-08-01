// 通用 API 响应类型
export interface ApiResponse<T = any> {
  code: number;
  message?: string;
  msg?: string;
  data?: T;
  rows?: T;
  total?: number;
  pageNum?: number;
  pageSize?: number;
  success?: boolean;
}

// 分页表格数据类型
export interface TableDataInfo<T = any> {
  code?: number;
  msg?: string;
  rows?: T[];
  total?: number;
  [property: string]: any;
}

// 分页查询基础参数
export interface BaseQuery {
  pageNum?: number;
  pageSize?: number;
  orderByColumn?: string;
  isAsc?: string;
}

// 基础实体类型
export interface BaseEntity {
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
  params?: Record<string, any>;
}