// 用户实体类型（根据 API 文档）
export interface UserEntity {
  userId: number;
  username: string;
  password?: string;
  mobile?: string;
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

// 登录表单类型
export interface LoginForm {
  username: string;
  password: string;
  rememberMe?: boolean;
}

// 登录响应类型
export interface LoginResponse {
  user: User;
  token: string;
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

// 用户查询参数
export interface UserQuery {
  name?: string;
  username?: string;
  role?: UserRole;
  status?: 'active' | 'inactive';
}