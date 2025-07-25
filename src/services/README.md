# 服务模块说明

本目录包含所有API服务模块，严格按照API文档进行实现。

## 文件结构

```
src/services/
├── index.ts              # 统一导出入口
├── httpClient.ts         # HTTP客户端基础类
├── auth.ts              # 认证服务 (登录)
├── department.ts        # 部门信息管理
├── security-guard.ts    # 安全员信息管理
├── patrol-point.ts      # 巡查点位信息管理
├── file.ts              # 文件管理 (下载)
├── api.ts               # 模拟API (开发用)
└── README.md            # 说明文档
```

## API 对应关系

### 根据API文档实现的接口：

1. **认证相关** (`auth.ts`)
   - POST /login - 用户登录

2. **部门信息管理** (`department.ts`)
   - GET /tree - 查询部门树形结构列表
   - GET /children/{parentId} - 根据父部门ID查询子部门列表
   - GET /{deptId} - 查询部门信息
   - GET /pointCount/{deptId} - 获取部门点位数量统计
   - DELETE /campus/department/{ids} - 删除部门信息

3. **安全员信息管理** (`security-guard.ts`)
   - GET /list - 查询安全员信息列表
   - GET /{guardId} - 获取安全员信息
   - POST / - 新增保存安全员信息
   - PUT / - 修改保存安全员信息
   - DELETE /{ids} - 删除安全员信息
   - POST /export - 导出安全员信息列表
   - POST /importData - 导入安全员信息
   - POST /importTemplate - 下载安全员导入模板
   - GET /bindableList - 获取可绑定的安全员列表
   - GET /points/{guardId} - 根据安全员ID查询绑定的点位列表

4. **巡查点位信息管理** (`patrol-point.ts`)
   - GET /{pointId} - 查询巡查点位信息
   - POST /bind/{pointId}/{guardId} - 绑定安全员到巡查点位
   - POST /unbind/{pointId} - 解绑巡查点位的安全员
   - GET /checkPointCodeUnique - 校验点位编码唯一性
   - GET /getByQrCode - 根据二维码code查询点位信息
   - GET /qrCodeBase64/{pointId} - 获取点位二维码base64
   - GET /qrcode/{pointId} - 获取巡查点位二维码
   - POST /campus/point/batchDownloadQrCode - 批量下载二维码

5. **文件管理** (`file.ts`)
   - GET /common/download - 文件下载

## 使用方式

```typescript
import { 
  authApi, 
  departmentApi, 
  securityGuardApi, 
  patrolPointApi, 
  fileApi 
} from '../services';

// 登录
const loginResult = await authApi.login({ username: 'admin', password: 'admin123' });

// 获取部门树
const departments = await departmentApi.getDepartmentTree();

// 获取安全员列表
const guards = await securityGuardApi.getSecurityGuards({ pageNum: 1, pageSize: 10 });
```

## 注意事项

1. 所有接口严格按照API文档实现
2. 删除了API文档中不存在的接口
3. 保持向后兼容性，通过别名支持旧的接口名称
4. 类型定义已模块化到 `src/types/` 目录