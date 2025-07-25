import { BaseEntity, BaseQuery } from './common';

// 安全员类型（根据后端返回的数据结构）
export interface SecurityGuard extends BaseEntity {
  createBy?: string;
  createTime?: Date | string;
  deptId?: number;
  deptName?: string;
  guardId?: number;
  name?: string;
  officePhone?: string;
  params?: { [key: string]: any };
  phoneNumber?: string;
  remark?: string;
  updateBy?: string;
  updateTime?: Date | string;
  wechatId?: string;
  [property: string]: any;
}

// 安全员表单类型
export interface SecurityGuardForm {
  guardId?: number;
  name?: string;
  deptId?: number;
  phoneNumber?: string;
  officePhone?: string;
  wechatId?: string;
  remark?: string;
}

// 安全员查询参数类型
export interface SecurityGuardQuery extends BaseQuery {
  deptId?: number;
  guardId?: number;
  name?: string;
  officePhone?: string;
  phoneNumber?: string;
  wechatId?: string;
}

// 导入安全员参数
export interface ImportSecurityGuardParams {
  updateSupport: boolean;
  file: File;
}