import { BaseEntity } from './common';

// 部门类型（根据后端返回的数据结构）
export interface Department extends BaseEntity {
  ancestors?: string;
  children?: Department[];
  createBy?: string;
  createTime?: Date | string;
  delFlag?: string;
  deptCode?: string;
  deptId?: number;
  deptName?: string;
  orderNum?: number;
  params?: { [key: string]: any };
  parentId?: number;
  parentName?: string;
  pointCount?: number;
  remark?: string;
  status?: string;
  updateBy?: string;
  updateTime?: Date | string;
  [property: string]: any;
}

// 部门表单类型
export interface DepartmentForm {
  deptId?: number;
  deptCode?: string;
  deptName: string;
  orderNum?: number;
  parentId?: number;
  remark?: string;
  status?: string;
}

// 部门查询参数类型
export interface DepartmentQuery {
  deptCode?: string;
  deptId?: number;
  deptName?: string;
  parentId?: number;
}

