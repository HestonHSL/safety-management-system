import { httpClient } from './httpClient';
import { Department, DepartmentQuery } from '../types/department';

// 部门管理API - 根据API文档
export const departmentApi = {
  // 查询部门树形结构列表 - GET /campus/department/tree
  getDepartmentTree: async (params?: DepartmentQuery): Promise<{ data: Department[] }> => {
    const queryParams: Record<string, any> = {};
    if (params?.deptCode) queryParams.deptCode = params.deptCode;
    if (params?.deptId) queryParams.deptId = params.deptId;
    if (params?.deptName) queryParams.deptName = params.deptName;
    if (params?.parentId) queryParams.parentId = params.parentId;

    const response = await httpClient.get<Department[]>('/campus/department/tree', queryParams);
    return {
      data: response.data || []
    };
  },

  // 根据父部门ID查询子部门列表 - GET /campus/department/children/{parentId}
  getChildrenDepartments: async (parentId: number): Promise<{ data: Department[] }> => {
    const response = await httpClient.get<Department[]>(`/campus/department/children/${parentId}`);
    return {
      data: response.data || []
    };
  },

  // 查询部门信息 - GET /campus/department/{deptId}
  getDepartmentById: async (deptId: number): Promise<Department> => {
    const response = await httpClient.get<Department>(`/campus/department/${deptId}`);
    return response.data!;
  },

  // 获取部门点位数量统计 - GET /campus/department/pointCount/{deptId}
  getDepartmentPointCount: async (deptId: number): Promise<{ pointCount: number }> => {
    const response = await httpClient.get<{ pointCount: number }>(`/campus/department/pointCount/${deptId}`);
    return response.data!;
  },

  // 删除部门信息 - DELETE /campus/department/{ids}
  deleteDepartments: async (ids: number[]): Promise<void> => {
    const idsStr = ids.join(',');
    await httpClient.delete(`/campus/department/${idsStr}`);
  },
};