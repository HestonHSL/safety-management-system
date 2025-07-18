import { httpClient } from './httpClient';
import { 
  Department, DepartmentForm, DepartmentQuery,
  Region, RegionForm, RegionQuery,
  SafetyOfficer, SafetyOfficerForm, SafetyOfficerQuery,
  Point, PointForm, PointQuery,
  User, UserForm, UserQuery,
  LoginForm, LoginResponse
} from '../types';

// 认证API
export const authApi = {
  // 用户登录 - POST /login (使用query参数)
  login: async (data: LoginForm): Promise<LoginResponse> => {
    const queryParams: Record<string, string> = {
      username: data.username,
      password: data.password,
    };
    if (data.rememberMe !== undefined) {
      queryParams.rememberMe = data.rememberMe.toString();
    }
    
    const response = await httpClient.postWithQuery<LoginResponse>('/login', queryParams);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await httpClient.post('/user/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await httpClient.get<User>('/user/current');
    return response.data;
  },
};

// 区域管理API
export const regionApi = {
  // 查询区域信息列表 - GET /area/list
  getRegions: async (params?: RegionQuery & { pageNum?: number; pageSize?: number }): Promise<{ 
    data: Region[], 
    total: number,
    pageNum: number,
    pageSize: number 
  }> => {
    const queryParams: Record<string, any> = {
      pageNum: params?.pageNum?.toString() || '1', // 必填参数
      pageSize: params?.pageSize?.toString() || '10', // 必填参数
    };
    if (params?.name) queryParams.areaName = params.name; // 根据后端字段调整
    
    const response = await httpClient.get<Region[]>('/area/list', queryParams);
    return {
      data: response.data || [],
      total: response.total || 0,
      pageNum: response.pageNum || 1,
      pageSize: response.pageSize || 10,
    };
  },

  // 查询区域信息 - GET /area/{areaId}
  getRegionById: async (areaId: string): Promise<Region> => {
    const response = await httpClient.get<Region>(`/area/${areaId}`);
    return response.data;
  },

  // 新增区域 - POST /area/
  createRegion: async (data: RegionForm): Promise<Region> => {
    const requestData = {
      areaName: data.areaName || data.name, // 必填
      parentId: data.parentId || '', // 可选，父ID
      orderNum: data.orderNum || 0, // 必填，排序
    };
    const response = await httpClient.post<Region>('/area/', requestData);
    return response.data;
  },

  // 修改区域 - PUT /area/
  updateRegion: async (id: string, data: RegionForm): Promise<Region> => {
    const requestData = {
      areaId: parseInt(id), // 必填，区域ID
      areaName: data.areaName || data.name, // 必填
      parentId: data.parentId || '', // 可选，父id
    };
    const response = await httpClient.put<Region>('/area/', requestData);
    return response.data;
  },

  // 删除区域信息 - DELETE /area/{ids} (支持批量删除)
  deleteRegion: async (id: string): Promise<void> => {
    await httpClient.delete(`/area/${id}`);
  },

  // 批量删除区域 - DELETE /area/{ids}
  deleteRegions: async (ids: string[]): Promise<void> => {
    const idsStr = ids.join(','); // 格式：0,1,2
    await httpClient.delete(`/area/${idsStr}`);
  },

  // 获取区域下拉树列表 - GET /area/treeselect
  getRegionTreeSelect: async (): Promise<{ data: any[] }> => {
    const response = await httpClient.get<any[]>('/area/treeselect');
    return {
      data: response.data || [],
    };
  },

  // 根据父区域ID查询子区域列表 - GET /area/children/{parentId}
  getChildrenRegions: async (parentId: string): Promise<{ data: Region[] }> => {
    const response = await httpClient.get<Region[]>(`/area/children/${parentId}`);
    return {
      data: response.data || [],
    };
  },

  // 导出区域信息列表 - POST /area/export
  exportRegions: async (params?: any): Promise<Blob> => {
    return await httpClient.download('/area/export', params);
  },
};

// 安全员管理API
export const safetyOfficerApi = {
  // 安全员列表查询 - GET /guard/list
  getSafetyOfficers: async (params?: SafetyOfficerQuery & { pageNum?: number; pageSize?: number }): Promise<{ 
    data: SafetyOfficer[], 
    total: number,
    pageNum: number,
    pageSize: number 
  }> => {
    const queryParams: Record<string, any> = {
      pageNum: params?.pageNum?.toString() || '1', // 必填参数
      pageSize: params?.pageSize?.toString() || '10', // 必填参数
    };
    if (params?.name) queryParams.name = params.name;
    if (params?.phoneNumber) queryParams.phoneNumber = params.phoneNumber;
    
    const response = await httpClient.get<SafetyOfficer[]>('/guard/list', queryParams);
    
    return {
      data: response.data || [],
      total: response.total || 0,
      pageNum: response.pageNum || 1,
      pageSize: response.pageSize || 10,
    };
  },

  // 查询安全员信息 - GET /guard/{guardId}
  getSafetyOfficerById: async (guardId: string): Promise<SafetyOfficer> => {
    const response = await httpClient.get<SafetyOfficer>(`/guard/${guardId}`);
    return response.data;
  },

  // 新增安全员 - POST /guard/
  createSafetyOfficer: async (data: SafetyOfficerForm): Promise<SafetyOfficer> => {
    const requestData = {
      name: data.name, // 必填
      phoneNumber: data.phoneNumber, // 必填
      dept: data.dept || '', // 可选
      officePhone: data.officePhone || '', // 可选
      wechatId: data.wechatId || '', // 可选
    };
    
    const response = await httpClient.post<SafetyOfficer>('/guard/', requestData);
    return response.data;
  },

  // 修改安全员信息 - PUT /guard/
  updateSafetyOfficer: async (guardId: string, data: SafetyOfficerForm): Promise<SafetyOfficer> => {
    const requestData = {
      guardId: parseInt(guardId), // 必填，安全员ID
      name: data.name, // 必填
      phoneNumber: data.phoneNumber, // 必填
      dept: data.dept || '', // 可选
      officePhone: data.officePhone || '', // 可选
      wechatId: data.wechatId || '', // 可选
    };
    
    const response = await httpClient.put<SafetyOfficer>('/guard/', requestData);
    return response.data;
  },

  // 删除安全员信息 - DELETE /guard/{ids} (支持批量删除)
  deleteSafetyOfficer: async (id: string): Promise<void> => {
    await httpClient.delete(`/guard/${id}`);
  },

  // 批量删除安全员 - DELETE /guard/{ids}
  deleteSafetyOfficers: async (ids: string[]): Promise<void> => {
    const idsStr = ids.join(','); // 格式：1,2,3
    await httpClient.delete(`/guard/${idsStr}`);
  },

  // 导出安全员信息列表 - POST /guard/export
  exportSafetyOfficers: async (params?: { name?: string; phoneNumber?: string }): Promise<Blob> => {
    const requestData = {
      name: params?.name || '', // 可选
      phoneNumber: params?.phoneNumber || '', // 可选
    };
    const response = await httpClient.post<Blob>('/guard/export', requestData);
    return response.data;
  },
};

// 点位管理API
export const pointApi = {
  // 点位列表查询 - GET /point/list
  getPoints: async (params?: PointQuery & { pageNum?: number; pageSize?: number }): Promise<{ 
    data: Point[], 
    total: number,
    pageNum: number,
    pageSize: number 
  }> => {
    const queryParams: Record<string, any> = {
      pageNum: params?.pageNum?.toString() || '1', // 必填参数
      pageSize: params?.pageSize?.toString() || '10', // 必填参数
    };
    if (params?.pointName) queryParams.pointName = params.pointName;
    if (params?.college) queryParams.college = params.college;
    if (params?.building) queryParams.building = params.building;
    if (params?.floor) queryParams.floor = params.floor;
    if (params?.areaId) queryParams.areaId = params.areaId;
    if (params?.guardId) queryParams.guardId = params.guardId;
    
    const response = await httpClient.get<Point[]>('/point/list', queryParams);
    
    return {
      data: response.data || [],
      total: response.total || 0,
      pageNum: response.pageNum || 1,
      pageSize: response.pageSize || 10,
    };
  },

  // 查询巡查点位信息 - GET /point/{pointId}
  getPointById: async (pointId: string): Promise<Point> => {
    const response = await httpClient.get<Point>(`/point/${pointId}`);
    return response.data;
  },

  // 新增点位信息 - POST /point/
  createPoint: async (data: PointForm): Promise<Point> => {
    const requestData = {
      pointName: data.pointName, // 必填
      college: data.college, // 必填
      building: data.building, // 必填
      floor: data.floor, // 必填
      areaId: data.areaId, // 必填
      // 新增缺失字段
      code: data.code, // 点位编码
      roomNumber: data.roomNumber, // 房间号
      location: data.location, // 详细名称
      purpose: data.purpose, // 用途
      description: data.description, // 描述
    };
    const response = await httpClient.post<Point>('/point/', requestData);
    return response.data;
  },

  // 修改点位 - PUT /point/
  updatePoint: async (pointId: string, data: PointForm): Promise<Point> => {
    const requestData = {
      pointId: pointId, // 必填 - 点位编号
      pointName: data.pointName, // 必填
      college: data.college, // 必填
      building: data.building, // 必填
      floor: data.floor, // 必填
      areaId: data.areaId ? parseInt(data.areaId) : undefined, // 可选 - 转为integer
      guardId: data.guardId ? parseInt(data.guardId) : undefined, // 可选 - 转为integer
    };
    const response = await httpClient.put<Point>('/point/', requestData);
    return response.data;
  },

  // 删除点位信息 - DELETE /point/{ids} (支持批量删除)
  deletePoint: async (id: string): Promise<void> => {
    await httpClient.delete(`/point/${id}`);
  },

  // 批量删除点位 - DELETE /point/{ids}
  deletePoints: async (ids: string[]): Promise<void> => {
    const idsStr = ids.join(','); // 格式：1,2,3
    await httpClient.delete(`/point/${idsStr}`);
  },

  // 点位信息导出 - POST /point/export
  exportPoints: async (params?: {
    pointName?: string;
    college?: string;
    building?: string;
    floor?: string;
    areaId?: number;
    guardId?: number;
  }): Promise<Blob> => {
    const requestData = {
      pointName: params?.pointName || '',
      college: params?.college || '',
      building: params?.building || '',
      floor: params?.floor || '',
      areaId: params?.areaId || 0,
      guardId: params?.guardId || 0,
    };
    const response = await httpClient.post<Blob>('/point/export', requestData);
    return response.data;
  },

  // 绑定安全员到巡查点位 - POST /point/bind/{pointId}/{guardId}
  bindGuardToPoint: async (pointId: string, guardId: string): Promise<void> => {
    await httpClient.post(`/point/bind/${pointId}/${guardId}`);
  },

  // 解绑巡查点位的安全员 - POST /point/unbind/{pointId}
  unbindGuardFromPoint: async (pointId: string): Promise<void> => {
    await httpClient.post(`/point/unbind/${pointId}`);
  },
};

// 用户管理API
export const userApi = {
  getUsers: async (params?: UserQuery): Promise<{ data: User[], total: number }> => {
    const response = await httpClient.get<User[]>('/user/list', params);
    return {
      data: response.data || [],
      total: response.total || 0,
    };
  },

  createUser: async (data: UserForm): Promise<User> => {
    const response = await httpClient.post<User>('/user/add', data);
    return response.data;
  },

  updateUser: async (id: string, data: UserForm): Promise<User> => {
    const response = await httpClient.put<User>('/user/update', { id, ...data });
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await httpClient.delete(`/user/delete/${id}`);
  },
};

// 获取下拉选项数据
export const getSelectOptions = async () => {
  try {
    const [regionsRes, officersRes] = await Promise.all([
      regionApi.getRegionTreeSelect(), // 使用树形选择接口获取区域数据
      safetyOfficerApi.getSafetyOfficers()
    ]);

    return {
      regions: regionsRes.data.map(item => ({
        value: item.id,
        label: item.name || item.areaName || '',
      })),
      safetyOfficers: officersRes.data.map(item => ({
        value: item.id,
        label: `${item.name}-${item.dept}`,
      })),
    };
  } catch (error) {
    console.error('获取选项数据失败:', error);
    return {
      regions: [],
      safetyOfficers: [],
    };
  }
};

// 通用上传API
export const uploadApi = {
  uploadFile: async (file: File): Promise<{ url: string; name: string }> => {
    const response = await httpClient.upload<{ url: string; name: string }>('/upload/file', file);
    return response.data;
  },

  importSafetyOfficers: async (file: File): Promise<{ successCount: number; failureCount: number }> => {
    const response = await httpClient.upload<{ successCount: number; failureCount: number }>('/guard/import', file);
    return response.data;
  },

  importPoints: async (file: File): Promise<{ successCount: number; failureCount: number }> => {
    const response = await httpClient.upload<{ successCount: number; failureCount: number }>('/point/import', file);
    return response.data;
  },
};

// 部门API
export const departmentApi = {
  // 获取部门列表 - GET /department/list
  getDepartments: async (params?: DepartmentQuery): Promise<{
    data: Department[];
    total: number;
    pageNum: number;
    pageSize: number;
  }> => {
    const queryParams: Record<string, any> = {};
    if (params?.pageNum) queryParams.pageNum = params.pageNum.toString();
    if (params?.pageSize) queryParams.pageSize = params.pageSize.toString();
    if (params?.deptCode) queryParams.deptCode = params.deptCode;
    if (params?.deptName) queryParams.deptName = params.deptName;

    const response = await httpClient.get<{
      data: Department[];
      total: number;
      pageNum: number;
      pageSize: number;
    }>('/department/list', queryParams);
    return response.data;
  },

  // 获取部门树 - GET /department/tree
  getDepartmentTree: async (): Promise<{ data: Department[] }> => {
    const response = await httpClient.get<{ data: Department[] }>('/department/tree');
    return response.data;
  },

  // 创建部门 - POST /department/
  createDepartment: async (data: DepartmentForm): Promise<Department> => {
    const response = await httpClient.post<Department>('/department/', data);
    return response.data;
  },

  // 更新部门 - PUT /department/{id}
  updateDepartment: async (deptId: string, data: DepartmentForm): Promise<Department> => {
    const response = await httpClient.put<Department>(`/department/${deptId}`, { ...data, deptId });
    return response.data;
  },

  // 删除部门 - DELETE /department/{id}
  deleteDepartment: async (deptId: string): Promise<void> => {
    await httpClient.delete(`/department/${deptId}`);
  },

  // 导出部门 - POST /department/export
  exportDepartments: async (params?: any): Promise<Blob> => {
    const blob = await httpClient.download('/department/export', params || {});
    return blob;
  },

  // 获取部门详情 - GET /department/{id}
  getDepartmentById: async (deptId: string): Promise<Department> => {
    const response = await httpClient.get<Department>(`/department/${deptId}`);
    return response.data;
  }
};

// 通用下载API
export const downloadApi = {
  // 文件下载 - GET /common/download
  downloadFile: async (fileName: string, deleteAfterDownload: boolean = false): Promise<Blob> => {
    const blob = await httpClient.downloadFile(fileName, deleteAfterDownload);
    return blob;
  },
}; 