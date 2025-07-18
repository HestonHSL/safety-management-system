import { Region, SafetyOfficer, Point, RegionForm, SafetyOfficerForm, PointForm, User, UserForm, LoginForm, LoginResponse, UserRole, UserQuery, Department, DepartmentForm, DepartmentQuery } from '../types';

// 模拟数据 - 简化的区域数据
let regions: Region[] = [
  // 一级区域
  {
    id: '1',
    name: '创意设计学院',
    areaName: '创意设计学院',
    description: '创意设计学院管辖区域',
    orderNum: 1,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00',
    pointCount: 15
  },
  {
    id: '2', 
    name: '计算机科学学院',
    areaName: '计算机科学学院',
    description: '计算机科学学院管辖区域',
    orderNum: 2,
    createTime: '2024-01-02 10:00:00',
    updateTime: '2024-01-02 10:00:00',
    pointCount: 25
  },
  // 创意设计学院下的子区域
  {
    id: '11',
    name: '工业设计教研室',
    areaName: '工业设计教研室',
    parentId: '1',
    description: '工业设计教研室',
    orderNum: 1,
    createTime: '2024-01-03 10:00:00',
    updateTime: '2024-01-03 10:00:00',
    pointCount: 8
  }
];

let safetyOfficers: SafetyOfficer[] = [
  {
    id: '1',
    guardId: 1,
    name: '张建国',
    dept: '安全保卫中心',
    officePhone: '0571-88888888',
    phoneNumber: '13912345678',
    wechatId: 'zhangjg_sztu',
    // 兼容字段
    phone: '0571-88888888',
    mobile: '13912345678',
    department: '安全保卫中心',
    position: '安全员',
    employeeNumber: 'SE001',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: '2',
    guardId: 2,
    name: '李明华',
    dept: '安全保卫中心',
    officePhone: '0571-87654321',
    phoneNumber: '13987654321',
    wechatId: 'limh_sztu',
    // 兼容字段
    phone: '0571-87654321',
    mobile: '13987654321',
    department: '安全保卫中心',
    position: '高级安全员',
    employeeNumber: 'SE002',
    createTime: '2024-01-02 10:00:00',
    updateTime: '2024-01-02 10:00:00'
  }
];

let points: Point[] = [
  {
    id: '1',
    pointId: 'P001',
    pointName: 'A栋1楼消防通道',
    college: '创意设计学院',
    building: 'A栋',
    floor: '1楼',
    areaId: '1',
    guardId: '1',
    // 兼容旧字段
    name: 'A栋1楼消防通道',
    code: 'P001',
    regionId: '1',
    regionName: '创意设计学院',
    roomNumber: '消防通道',
    location: '创意设计学院A栋1楼消防通道',
    purpose: '消防安全检查',
    safetyOfficerId: '1',
    safetyOfficerName: '张建国',
    description: '教学楼消防通道巡查点',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: '2',
    pointId: 'P002',
    pointName: 'B栋2楼安全出口',
    college: '计算机科学学院',
    building: 'B栋',
    floor: '2楼',
    areaId: '2',
    guardId: '2',
    // 兼容旧字段
    name: 'B栋2楼安全出口',
    code: 'P002',
    regionId: '2',
    regionName: '计算机科学学院',
    roomNumber: '安全出口',
    location: '计算机科学学院B栋2楼安全出口',
    purpose: '安全出口检查',
    safetyOfficerId: '2',
    safetyOfficerName: '李明华',
    description: '负责B栋安全出口巡查',
    createTime: '2024-01-02 10:00:00',
    updateTime: '2024-01-02 10:00:00'
  },
  {
    id: '3',
    pointId: 'P003',
    pointName: 'A栋3楼实验室',
    college: '创意设计学院',
    building: 'A栋',
    floor: '3楼',
    areaId: '11',
    guardId: '1',
    // 兼容旧字段
    name: 'A栋3楼实验室',
    code: 'P003',
    regionId: '11',
    regionName: '工业设计教研室',
    roomNumber: '301',
    location: '工业设计教研室A栋3楼301实验室',
    purpose: '实验室安全检查',
    safetyOfficerId: '1',
    safetyOfficerName: '张建国',
    description: '设计实验室安全巡查点',
    createTime: '2024-01-03 10:00:00',
    updateTime: '2024-01-03 10:00:00'
  }
];

// 区域管理API
export const regionApi = {
  // 获取区域列表（增强版本，支持分页）
  getRegions: async (params?: any): Promise<{ 
    data: Region[], 
    total: number,
    pageNum: number,
    pageSize: number 
  }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    let filteredRegions = regions;
    if (params?.name || params?.areaName) {
      filteredRegions = regions.filter(region => 
        region.name.includes(params.name || params.areaName)
      );
    }
    
    const pageNum = params?.pageNum || 1;
    const pageSize = params?.pageSize || 10;
    const startIndex = (pageNum - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return {
      data: filteredRegions.slice(startIndex, endIndex),
      total: filteredRegions.length,
      pageNum,
      pageSize
    };
  },

  // 根据ID获取区域
  getRegionById: async (areaId: string): Promise<Region> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const region = regions.find(r => r.id === areaId);
    if (!region) {
      throw new Error('区域不存在');
    }
    return region;
  },

  // 创建区域
  createRegion: async (data: RegionForm): Promise<Region> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newRegion: Region = {
      id: Date.now().toString(),
      name: data.areaName || data.name || '',
      areaName: data.areaName || data.name || '',
      parentId: data.parentId || '',
      orderNum: data.orderNum || 0,
      description: data.description || '',
      createTime: new Date().toLocaleString(),
      updateTime: new Date().toLocaleString(),
      pointCount: 0
    };
    regions.push(newRegion);
    return newRegion;
  },

  // 更新区域
  updateRegion: async (id: string, data: RegionForm): Promise<Region> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = regions.findIndex(region => region.id === id);
    if (index !== -1) {
      regions[index] = {
        ...regions[index],
        name: data.areaName || data.name || '',
        areaName: data.areaName || data.name || '',
        parentId: data.parentId || '',
        updateTime: new Date().toLocaleString()
      };
      return regions[index];
    }
    throw new Error('区域不存在');
  },

  // 删除区域
  deleteRegion: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = regions.findIndex(region => region.id === id);
    if (index !== -1) {
      regions.splice(index, 1);
    }
  },

  // 批量删除区域
  deleteRegions: async (ids: string[]): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    ids.forEach(id => {
      const index = regions.findIndex(region => region.id === id);
      if (index !== -1) {
        regions.splice(index, 1);
      }
    });
  },

  // 获取区域树形选择列表
  getRegionTreeSelect: async (): Promise<{ data: any[] }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const treeData = regions.map(region => ({
      id: region.id,
      value: region.id,
      title: region.name,
      label: region.name,
      areaName: region.areaName || region.name,
      parentId: region.parentId,
    }));
    return {
      data: treeData
    };
  },

  // 根据父ID获取子区域
  getChildrenRegions: async (parentId: string): Promise<{ data: Region[] }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const children = regions.filter(region => region.parentId === parentId);
    return {
      data: children
    };
  },

  // 导出区域列表
  exportRegions: async (params?: any): Promise<Blob> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const csvContent = regions.map(region => 
      `${region.id},${region.name},${region.description || ''},${region.createTime}`
    ).join('\n');
    return new Blob([csvContent], { type: 'text/csv' });
  },
};

// 安全员管理API
export const safetyOfficerApi = {
  // 获取安全员列表
  getSafetyOfficers: async (params?: any): Promise<{ data: SafetyOfficer[], total: number }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    let filteredOfficers = safetyOfficers;
    if (params?.name) {
      filteredOfficers = safetyOfficers.filter(officer => 
        officer.name.includes(params.name)
      );
    }
    if (params?.department) {
      filteredOfficers = filteredOfficers.filter(officer =>
        (officer.dept || officer.department || '').includes(params.department)
      );
    }
    return {
      data: filteredOfficers,
      total: filteredOfficers.length
    };
  },

  // 创建安全员
  createSafetyOfficer: async (data: SafetyOfficerForm): Promise<SafetyOfficer> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newOfficer: SafetyOfficer = {
      id: Date.now().toString(),
      guardId: parseInt(Date.now().toString().slice(-6)),
      name: data.name,
      dept: data.dept,
      officePhone: data.officePhone,
      phoneNumber: data.phoneNumber,
      wechatId: data.wechatId,
      // 兼容字段
      phone: data.officePhone,
      mobile: data.phoneNumber,
      department: data.dept,
      createTime: new Date().toLocaleString(),
      updateTime: new Date().toLocaleString()
    };
    safetyOfficers.push(newOfficer);
    return newOfficer;
  },

  // 更新安全员
  updateSafetyOfficer: async (id: string, data: SafetyOfficerForm): Promise<SafetyOfficer> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = safetyOfficers.findIndex(officer => officer.id === id);
    if (index !== -1) {
      safetyOfficers[index] = {
        ...safetyOfficers[index],
        name: data.name,
        dept: data.dept,
        officePhone: data.officePhone,
        phoneNumber: data.phoneNumber,
        wechatId: data.wechatId,
        guardId: data.guardId || safetyOfficers[index].guardId,
        // 更新兼容字段
        phone: data.officePhone,
        mobile: data.phoneNumber,
        department: data.dept,
        updateTime: new Date().toLocaleString()
      };
      return safetyOfficers[index];
    }
    throw new Error('安全员不存在');
  },

  // 删除安全员
  deleteSafetyOfficer: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = safetyOfficers.findIndex(officer => officer.id === id);
    if (index !== -1) {
      safetyOfficers.splice(index, 1);
    }
  },

  // 导出安全员
  exportSafetyOfficers: async (params?: { name?: string; phoneNumber?: string }): Promise<Blob> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    let filteredOfficers = safetyOfficers;
    if (params?.name) {
      filteredOfficers = safetyOfficers.filter(officer => 
        officer.name.includes(params.name || '')
      );
    }
    if (params?.phoneNumber) {
      filteredOfficers = filteredOfficers.filter(officer =>
        (officer.phoneNumber || officer.mobile || '').includes(params.phoneNumber || '')
      );
    }
    
    const csvContent = filteredOfficers.map(officer => 
      `${officer.id},${officer.name},${officer.dept || officer.department || ''},${officer.officePhone || officer.phone || ''},${officer.phoneNumber || officer.mobile || ''},${officer.wechatId || ''},${officer.createTime || ''}`
    ).join('\n');
    
    const csvHeader = 'ID,姓名,部门,办公电话,手机号码,微信号,创建时间\n';
    return new Blob([csvHeader + csvContent], { type: 'text/csv;charset=utf-8;' });
  }
};

// 点位管理API
export const pointApi = {
  // 获取点位列表
  getPoints: async (params?: any): Promise<{ 
    data: Point[], 
    total: number,
    pageNum: number,
    pageSize: number 
  }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    let filteredPoints = points.map(point => ({
      ...point,
      regionName: regions.find(r => r.id === (point.areaId || point.regionId))?.name,
      safetyOfficerName: safetyOfficers.find(o => o.id === (point.guardId || point.safetyOfficerId))?.name
    }));
    
    // 支持新的搜索参数
    if (params?.pointName) {
      filteredPoints = filteredPoints.filter(point => 
        (point.pointName || point.name || '').includes(params.pointName)
      );
    }
    if (params?.college) {
      filteredPoints = filteredPoints.filter(point =>
        (point.college || '').includes(params.college)
      );
    }
    if (params?.building) {
      filteredPoints = filteredPoints.filter(point =>
        (point.building || '').includes(params.building)
      );
    }
    if (params?.floor) {
      filteredPoints = filteredPoints.filter(point =>
        (point.floor || '').includes(params.floor)
      );
    }
    if (params?.areaId) {
      filteredPoints = filteredPoints.filter(point =>
        (point.areaId || point.regionId) === params.areaId
      );
    }
    if (params?.guardId) {
      filteredPoints = filteredPoints.filter(point =>
        (point.guardId || point.safetyOfficerId) === params.guardId
      );
    }
    
    // 兼容旧参数
    if (params?.name) {
      filteredPoints = filteredPoints.filter(point => 
        (point.pointName || point.name || '').includes(params.name)
      );
    }
    if (params?.code) {
      filteredPoints = filteredPoints.filter(point =>
        (point.pointId || point.code || '').includes(params.code)
      );
    }
    if (params?.regionId) {
      filteredPoints = filteredPoints.filter(point =>
        (point.areaId || point.regionId) === params.regionId
      );
    }
    
    const pageNum = params?.pageNum || 1;
    const pageSize = params?.pageSize || 10;
    const startIndex = (pageNum - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return {
      data: filteredPoints.slice(startIndex, endIndex),
      total: filteredPoints.length,
      pageNum,
      pageSize
    };
  },

  // 根据ID获取点位
  getPointById: async (pointId: string): Promise<Point> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const point = points.find(p => p.id === pointId || p.pointId === pointId);
    if (!point) {
      throw new Error('点位不存在');
    }
    return point;
  },

  // 创建点位
  createPoint: async (data: PointForm): Promise<Point> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newPoint: Point = {
      id: Date.now().toString(),
      pointId: `P${Date.now().toString().slice(-3)}`,
      pointName: data.pointName,
      college: data.college,
      building: data.building,
      floor: data.floor,
      areaId: data.areaId,
      guardId: data.guardId,
      // 设置兼容字段
      name: data.pointName,
      code: `P${Date.now().toString().slice(-3)}`,
      regionId: data.areaId,
      safetyOfficerId: data.guardId,
      createTime: new Date().toLocaleString(),
      updateTime: new Date().toLocaleString()
    };
    points.push(newPoint);
    return newPoint;
  },

  // 更新点位
  updatePoint: async (pointId: string, data: PointForm): Promise<Point> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = points.findIndex(point => point.id === pointId || point.pointId === pointId);
    if (index !== -1) {
      points[index] = {
        ...points[index],
        pointName: data.pointName,
        college: data.college,
        building: data.building,
        floor: data.floor,
        areaId: data.areaId,
        guardId: data.guardId,
        // 更新兼容字段
        name: data.pointName,
        regionId: data.areaId,
        safetyOfficerId: data.guardId,
        updateTime: new Date().toLocaleString()
      };
      return points[index];
    }
    throw new Error('点位不存在');
  },

  // 删除点位
  deletePoint: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = points.findIndex(point => point.id === id);
    if (index !== -1) {
      points.splice(index, 1);
    }
  },

  // 批量删除点位
  deletePoints: async (ids: string[]): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    ids.forEach(id => {
      const index = points.findIndex(point => point.id === id);
      if (index !== -1) {
        points.splice(index, 1);
      }
    });
  },

  // 导出点位列表
  exportPoints: async (params?: any): Promise<Blob> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const csvContent = points.map(point => 
      `${point.id},${point.pointName || point.name},${point.college || ''},${point.building || ''},${point.floor || ''},${point.areaId || point.regionId},${point.guardId || point.safetyOfficerId || ''},${point.createTime || ''}`
    ).join('\n');
    const csvHeader = 'ID,点位名称,学院,楼栋,楼层,区域ID,安全员ID,创建时间\n';
    return new Blob([csvHeader + csvContent], { type: 'text/csv;charset=utf-8;' });
  },

  // 绑定安全员到点位
  bindGuardToPoint: async (pointId: string, guardId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = points.findIndex(point => point.id === pointId || point.pointId === pointId);
    if (index !== -1) {
      points[index].guardId = guardId;
      points[index].safetyOfficerId = guardId; // 兼容字段
      points[index].updateTime = new Date().toLocaleString();
    } else {
      throw new Error('点位不存在');
    }
  },

  // 解绑点位的安全员
  unbindGuardFromPoint: async (pointId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = points.findIndex(point => point.id === pointId || point.pointId === pointId);
    if (index !== -1) {
      points[index].guardId = undefined;
      points[index].safetyOfficerId = undefined; // 兼容字段
      points[index].updateTime = new Date().toLocaleString();
    } else {
      throw new Error('点位不存在');
    }
  }
};

// 模拟用户数据
let users: User[] = [
  {
    id: '1',
    username: 'superadmin',
    name: '超级管理员',
    role: UserRole.SUPER_ADMIN,
    email: 'superadmin@sztu.edu.cn',
    phone: '13800000001',
    status: 'active',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00',
    lastLoginTime: '2024-01-15 09:30:00'
  },
  {
    id: '2',
    username: 'admin001',
    name: '张管理员',
    role: UserRole.ADMIN,
    email: 'admin001@sztu.edu.cn',
    phone: '13800000002',
    status: 'active',
    createTime: '2024-01-02 10:00:00',
    updateTime: '2024-01-02 10:00:00',
    lastLoginTime: '2024-01-14 14:20:00'
  }
];

// 当前登录用户
let currentUser: User | null = null;

// 认证相关API
export const authApi = {
  // 登录（支持rememberMe字段）
  login: async (data: LoginForm): Promise<LoginResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟密码验证
    const passwordMap: Record<string, string> = {
      'superadmin': 'admin123',
      'admin001': 'admin123'
    };
    
    if (passwordMap[data.username] !== data.password) {
      throw new Error('用户名或密码错误');
    }
    
    const user = users.find(u => u.username === data.username);
    if (!user || user.status !== 'active') {
      throw new Error('用户不存在或已被禁用');
    }
    
    // 更新最后登录时间
    user.lastLoginTime = new Date().toLocaleString();
    currentUser = user;
    
    // 处理记住我功能（模拟）
    if (data.rememberMe) {
      localStorage.setItem('rememberMe', 'true');
      console.log('用户选择了记住我');
    } else {
      localStorage.removeItem('rememberMe');
    }
    
    return {
      user,
      token: `mock_token_${user.id}_${Date.now()}`
    };
  },

  // 登出
  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    currentUser = null;
    localStorage.removeItem('rememberMe');
  },

  // 获取当前用户信息
  getCurrentUser: async (): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return currentUser;
  }
};

// 用户管理API
export const userApi = {
  // 获取用户列表
  getUsers: async (params?: UserQuery): Promise<{ data: User[], total: number }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    let filteredUsers = users;
    
    if (params?.name) {
      filteredUsers = filteredUsers.filter(user => 
        user.name.includes(params.name!)
      );
    }
    if (params?.username) {
      filteredUsers = filteredUsers.filter(user =>
        user.username.includes(params.username!)
      );
    }
    if (params?.role) {
      filteredUsers = filteredUsers.filter(user =>
        user.role === params.role
      );
    }
    if (params?.status) {
      filteredUsers = filteredUsers.filter(user =>
        user.status === params.status
      );
    }
    
    return {
      data: filteredUsers,
      total: filteredUsers.length
    };
  },

  // 创建用户
  createUser: async (data: UserForm): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 检查用户名是否已存在
    if (users.find(u => u.username === data.username)) {
      throw new Error('用户名已存在');
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      ...data,
      createTime: new Date().toLocaleString(),
      updateTime: new Date().toLocaleString()
    };
    users.push(newUser);
    return newUser;
  },

  // 更新用户
  updateUser: async (id: string, data: Partial<UserForm>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      // 如果修改用户名，检查是否已存在
      if (data.username && data.username !== users[index].username) {
        if (users.find(u => u.username === data.username && u.id !== id)) {
          throw new Error('用户名已存在');
        }
      }
      
      users[index] = {
        ...users[index],
        ...data,
        updateTime: new Date().toLocaleString()
      };
      return users[index];
    }
    throw new Error('用户不存在');
  },

  // 删除用户
  deleteUser: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users.splice(index, 1);
    }
  },

  // 重置密码
  resetPassword: async (id: string, newPassword: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    // 在实际应用中，这里会更新密码
    console.log(`重置用户 ${id} 的密码为: ${newPassword}`);
  }
};

// 获取选项数据
export const getSelectOptions = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return {
    regions: regions.map(r => ({ label: r.name, value: r.id })),
    safetyOfficers: safetyOfficers.map(o => ({ label: `${o.name}-${o.dept}`, value: o.id })),
    userRoles: [
      { label: '超级管理员', value: UserRole.SUPER_ADMIN },
      { label: '管理员', value: UserRole.ADMIN }
    ]
  };
};

// 通用下载API（模拟）
export const downloadApi = {
  // 文件下载
  downloadFile: async (fileName: string, deleteAfterDownload: boolean = false): Promise<Blob> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 模拟文件内容
    let content = '';
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    
    switch (fileExtension) {
      case 'xlsx':
      case 'xls':
        content = '这是一个模拟的Excel文件内容';
        break;
      case 'pdf':
        content = '这是一个模拟的PDF文件内容';
        break;
      case 'txt':
        content = '这是一个模拟的文本文件内容\n包含多行数据\n用于测试下载功能';
        break;
      default:
        content = `这是模拟的${fileName}文件内容`;
    }
    
    // 如果设置了删除标志，模拟删除操作
    if (deleteAfterDownload) {
      console.log(`模拟删除文件: ${fileName}`);
    }
    
    return new Blob([content], { type: 'application/octet-stream' });
  },
};

// 部门模拟数据
let departments: Department[] = [
  {
    deptId: '1',
    deptCode: 'CS001',
    deptName: '计算机科学学院',
    orderNum: 1,
    parentId: 0,
    pointCount: 15,
    createTime: '2024-01-01 10:00:00',
    remark: '负责计算机相关专业教学和研究'
  },
  {
    deptId: '2',
    deptCode: 'ART001',
    deptName: '创意设计学院',
    orderNum: 2,
    parentId: 0,
    pointCount: 12,
    createTime: '2024-01-02 10:00:00',
    remark: '负责艺术设计相关专业教学'
  },
  {
    deptId: '3',
    deptCode: 'CS002',
    deptName: '软件工程系',
    orderNum: 1,
    parentId: 1,
    pointCount: 8,
    createTime: '2024-01-03 10:00:00',
    remark: '隶属于计算机科学学院'
  }
];

// 部门API
export const departmentApi = {
  // 获取部门列表
  getDepartments: async (params?: DepartmentQuery): Promise<{
    data: Department[];
    total: number;
    pageNum: number;
    pageSize: number;
  }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredData = [...departments];
    
    if (params?.deptName) {
      filteredData = filteredData.filter(dept => 
        dept.deptName.includes(params.deptName!)
      );
    }
    
    if (params?.deptCode) {
      filteredData = filteredData.filter(dept => 
        dept.deptCode.includes(params.deptCode!)
      );
    }
    
    const pageSize = params?.pageSize || 10;
    const pageNum = params?.pageNum || 1;
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    
    return {
      data: filteredData.slice(start, end),
      total: filteredData.length,
      pageNum,
      pageSize
    };
  },

  // 获取部门树
  getDepartmentTree: async (): Promise<{ data: Department[] }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: departments };
  },

  // 创建部门
  createDepartment: async (data: DepartmentForm): Promise<Department> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newDept: Department = {
      deptId: Date.now().toString(),
      ...data,
      createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      pointCount: 0
    };
    departments.push(newDept);
    return newDept;
  },

  // 更新部门
  updateDepartment: async (deptId: string, data: DepartmentForm): Promise<Department> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const index = departments.findIndex(dept => dept.deptId === deptId);
    if (index >= 0) {
      departments[index] = { ...departments[index], ...data };
      return departments[index];
    }
    throw new Error('部门不存在');
  },

  // 删除部门
  deleteDepartment: async (deptId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const index = departments.findIndex(dept => dept.deptId === deptId);
    if (index >= 0) {
      departments.splice(index, 1);
    }
  },

  // 导出部门
  exportDepartments: async (): Promise<Blob> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const csvContent = departments.map(dept => 
      `${dept.deptCode},${dept.deptName},${dept.orderNum},${dept.pointCount || 0}`
    ).join('\n');
    return new Blob([csvContent], { type: 'text/csv' });
  }
}; 