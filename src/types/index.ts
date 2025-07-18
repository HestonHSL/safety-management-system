// 部门类型
export interface Department {
  deptId: string;
  deptCode: string;
  deptName: string;
  orderNum: number;
  parentId?: number;
  pointCount?: number;
  createTime?: string;
  updateTime?: string;
  remark?: string;
  children?: Department[];
}

// 部门表单类型
export interface DepartmentForm {
  deptCode: string;
  deptName: string;
  orderNum: number;
  parentId?: number;
  remark?: string;
}

// 部门查询参数类型
export interface DepartmentQuery {
  deptCode?: string;
  deptName?: string;
  pageNum?: number;
  pageSize?: number;
}

// 区域类型（根据Java后端接口调整）
export interface Region {
  id: string;
  name: string;
  areaName?: string; // 兼容后端字段
  parentId?: string;
  orderNum?: number;
  description?: string;
  createTime: string;
  updateTime: string;
  pointCount?: number;
}

// 安全员类型（根据Java后端接口调整）
export interface SafetyOfficer {
  id: string;
  guardId?: number;
  name: string;
  dept: string;
  officePhone?: string;
  phoneNumber: string;
  wechatId?: string;
  // 保留字段用于显示
  phone?: string;
  mobile?: string;
  department?: string;
  position?: string;
  employeeNumber?: string;
  createTime?: string;
  updateTime?: string;
}

// 点位类型（根据Java后端接口调整）
export interface Point {
  id: string;
  pointId?: string; // 点位编号
  pointName: string; // 点位名称
  college: string; // 学院
  building: string; // 楼栋
  floor: string; // 楼层
  areaId: string; // 所属区域ID
  guardId?: string; // 绑定安全员ID
  
  // 保留旧字段以支持向后兼容
  name?: string;
  code?: string;
  regionId?: string;
  regionName?: string;
  roomNumber?: string;
  location?: string;
  purpose?: string;
  safetyOfficerId?: string;
  safetyOfficerName?: string;
  description?: string;
  qrCode?: string;
  createTime?: string;
  updateTime?: string;
}

// 表单数据类型（根据Java后端接口调整）
export interface RegionForm {
  areaName: string;  // 根据接口文档调整
  parentId?: string;
  orderNum?: number;
  name?: string;     // 保留兼容性
  description?: string;
}

export interface SafetyOfficerForm {
  name: string;
  dept: string;
  officePhone?: string;
  phoneNumber: string;
  wechatId?: string;
  guardId?: number;
  pointIds?: string[]; // 负责点位ID列表
}

export interface PointForm {
  pointName: string; // 必填 - 点位名称
  college: string; // 必填 - 学院
  building: string; // 必填 - 楼栋
  floor: string; // 必填 - 楼层
  areaId: string; // 必填 - 所属区域ID
  guardId?: string; // 可选 - 绑定安全员ID
  pointId?: string; // 编辑时使用 - 点位编号
  
  // 前端页面使用的字段（需要后端接口支持）
  code?: string; // 点位编码
  roomNumber?: string; // 房间号
  location?: string; // 详细名称
  purpose?: string; // 用途
  description?: string; // 描述
  
  // 保留旧字段以支持向后兼容
  name?: string;
  regionId?: string;
  safetyOfficerId?: string;
}

// 查询参数类型
export interface RegionQuery {
  name?: string;
}

export interface SafetyOfficerQuery {
  name?: string;
  phoneNumber?: string;
  pageNum?: number;
  pageSize?: number;
}

export interface PointQuery {
  pointName?: string; // 点位名称(模糊匹配)
  college?: string; // 学院
  building?: string; // 楼栋
  floor?: string; // 楼层
  areaId?: string; // 区域编号
  guardId?: string; // 安全员编号
  pageNum?: number; // 当前页数(必填)
  pageSize?: number; // 每页数量(必填)
  
  // 保留旧字段以支持向后兼容
  name?: string;
  code?: string;
  regionId?: string;
}

// 用户角色枚举
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin'
}

// 用户类型
export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email?: string;
  phone?: string;
  status: 'active' | 'inactive';
  createTime: string;
  updateTime: string;
  lastLoginTime?: string;
}

// 用户表单类型
export interface UserForm {
  username: string;
  name: string;
  password: string;
  role: UserRole;
  email?: string;
  phone?: string;
  status: 'active' | 'inactive';
}

// 登录表单类型
export interface LoginForm {
  username: string;
  password: string;
  rememberMe?: boolean; // 记住我
}

// 登录响应类型
export interface LoginResponse {
  user: User;
  token: string;
}

// 用户查询参数
export interface UserQuery {
  name?: string;
  username?: string;
  role?: UserRole;
  status?: 'active' | 'inactive';
} 