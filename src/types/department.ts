import { BaseEntity } from './common';

// 部门类型（根据后端返回的数据结构）
export interface Department extends BaseEntity {
  ancestors?: string;
  children?: Department[];
  createBy?: string;
  // createTime?: Date | string;
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
  // updateTime?: Date | string;
  [property: string]: any;
}

// 部门表单类型
export interface DepartmentForm {
    /**
     * 部门编码
     */
    deptCode: string;
    /**
     * 部门名称
     */
    deptName?: string;
    /**
     * 显示顺序
     */
    orderNum?: number;
    /**
     * 上级部门ID
     */
    parentId: number;
    /**
     * 备注
     */
    remark?: string;
}

export interface DepartmentFormWithDeptId {
    /**
     * 部门编码
     */
    deptCode: string;
    /**
     * 部门ID
     */
    deptId: string;
    /**
     * 部门名称
     */
    deptName?: string;
    /**
     * 显示顺序
     */
    orderNum?: number;
    /**
     * 上级部门ID
     */
    parentId: number;
    /**
     * 备注
     */
    remark?: string;
    [property: string]: any;
}

// 部门查询参数类型
export interface DepartmentQuery {
  deptCode?: string;
  deptId?: number;
  deptName?: string;
  parentId?: number;
}

//部门分页查询
export interface DepartmentPageQuery {
    /**
     * 部门编码
     */
    deptCode?: string;
    /**
     * 部门ID
     */
    deptId?: number;
    /**
     * 部门名称
     */
    deptName?: string;
    isAsc?: string;
    /**
     * 排序字段
     */
    orderByColumn?: string;
    /**
     * 当前页数
     */
    pageNum?: number;
    /**
     * 每页记录数
     */
    pageSize?: number;
    /**
     * 上级部门ID
     */
    parentId?: number;
}