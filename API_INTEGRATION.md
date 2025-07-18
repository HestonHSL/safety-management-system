# API 集成文档

## 区域管理模块 - 详细接口实现

### 接口映射表

基于提供的OpenAPI规范，区域管理模块包含以下接口：

| 功能 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 查询区域信息列表 | GET | `/area/list` | 分页查询，pageNum和pageSize为必填参数 |
| 查询区域信息 | GET | `/area/{areaId}` | 根据区域ID查询单个区域详情 |
| 新增区域 | POST | `/area/` | 创建新区域，areaName和orderNum为必填字段 |
| 修改区域 | PUT | `/area/` | 更新区域信息，areaId和areaName为必填字段 |
| 删除区域信息 | DELETE | `/area/{ids}` | 支持批量删除，ids格式为"0,1,2" |
| 获取区域下拉树列表 | GET | `/area/treeselect` | 获取树形结构的区域列表 |
| 根据父区域ID查询子区域列表 | GET | `/area/children/{parentId}` | 查询指定父级区域的子区域 |
| 导出区域信息列表 | POST | `/area/export` | 导出区域数据 |

### 请求参数详情

#### 1. 查询区域信息列表 (GET /area/list)
**必填参数：**
- `pageNum` (string): 当前页数
- `pageSize` (string): 每页数量

**可选参数：**
- `areaName` (string): 区域名称（用于搜索）

**响应格式：**
```json
{
  "data": [
    {
      "id": "1",
      "areaName": "计算机科学学院",
      "parentId": "",
      "orderNum": 1,
      "description": "计算机科学学院管辖区域",
      "createTime": "2024-01-01 10:00:00"
    }
  ],
  "total": 10,
  "pageNum": 1,
  "pageSize": 10
}
```

#### 2. 新增区域 (POST /area/)
**必填字段：**
- `areaName` (string): 区域名称
- `orderNum` (integer): 排序号

**可选字段：**
- `parentId` (string): 父级区域ID

**请求示例：**
```json
{
  "areaName": "新区域名称",
  "parentId": "1",
  "orderNum": 5
}
```

#### 3. 修改区域 (PUT /area/)
**必填字段：**
- `areaId` (integer): 区域ID
- `areaName` (string): 区域名称

**可选字段：**
- `parentId` (string): 父级区域ID

**请求示例：**
```json
{
  "areaId": 1,
  "areaName": "更新后的区域名称",
  "parentId": "2"
}
```

#### 4. 删除区域 (DELETE /area/{ids})
**路径参数：**
- `ids` (string): 区域ID列表，格式为"0,1,2"

**请求示例：**
```
DELETE /area/1,2,3
```

### 前端实现要点

#### 1. 分页处理
- 查询接口必须传递 `pageNum` 和 `pageSize` 参数
- 前端维护分页状态，并在搜索时重置到第一页

#### 2. 树形结构支持
- 使用 `/area/treeselect` 接口获取父级区域选项
- 支持父子级关系的显示和选择

#### 3. 表单字段映射
- 前端使用 `areaName` 字段，兼容旧的 `name` 字段
- 新增 `parentId` 和 `orderNum` 字段支持
- 编辑时正确预填充表单数据

#### 4. 批量操作
- 支持批量删除功能
- 删除ID以逗号分隔的字符串格式传递

### 环境配置

#### 开发环境
```env
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_USE_REAL_API=true
REACT_APP_SHOW_DEBUG=true
```

#### 生产环境
```env
REACT_APP_API_BASE_URL=https://your-api-server.com/api
REACT_APP_USE_REAL_API=true
REACT_APP_SHOW_DEBUG=false
```

### 测试建议

1. **分页测试**：验证分页参数传递和响应处理
2. **树形结构测试**：测试父子级关系的正确显示
3. **表单验证**：确保必填字段验证正确
4. **批量操作测试**：验证批量删除功能
5. **搜索功能测试**：验证搜索和重置功能

### 错误处理

- 统一的错误处理机制
- 用户友好的错误提示
- 网络错误的重试机制

---

## 安全员管理模块 - 详细接口实现

### 接口映射表

基于提供的OpenAPI规范，安全员管理模块包含以下接口：

| 功能 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 安全员列表查询 | GET | `/guard/list` | 分页查询，pageNum和pageSize为必填参数 |
| 查询安全员信息 | GET | `/guard/{guardId}` | 根据安全员ID查询单个安全员详情 |
| 新增安全员 | POST | `/guard/` | 创建新安全员，name和phoneNumber为必填字段 |
| 修改安全员信息 | PUT | `/guard/` | 更新安全员信息，guardId、name和phoneNumber为必填字段 |
| 删除安全员信息 | DELETE | `/guard/{ids}` | 支持批量删除，ids格式为"1,2,3" |
| 导出安全员信息列表 | POST | `/guard/export` | 导出安全员数据 |

### 请求参数详情

#### 1. 安全员列表查询 (GET /guard/list)
**必填参数：**
- `pageNum` (integer): 当前页数
- `pageSize` (integer): 每页数量

**可选参数：**
- `name` (string): 安全员姓名（模糊匹配）
- `phoneNumber` (string): 安全员手机号

**响应格式：**
```json
{
  "data": [
    {
      "id": "1",
      "guardId": 1,
      "name": "张三",
      "dept": "安全保卫中心",
      "officePhone": "0755-12345678",
      "phoneNumber": "13800000000",
      "wechatId": "zhang_wechat",
      "createTime": "2024-01-01 10:00:00"
    }
  ],
  "total": 10,
  "pageNum": 1,
  "pageSize": 10
}
```

#### 2. 新增安全员 (POST /guard/)
**必填字段：**
- `name` (string): 姓名
- `phoneNumber` (string): 手机号

**可选字段：**
- `dept` (string): 部门
- `officePhone` (string): 办公室电话
- `wechatId` (string): 微信号

**请求示例：**
```json
{
  "name": "李四",
  "phoneNumber": "13900000000",
  "dept": "安全保卫中心",
  "officePhone": "0755-87654321",
  "wechatId": "lisi_wechat"
}
```

#### 3. 修改安全员信息 (PUT /guard/)
**必填字段：**
- `guardId` (integer): 安全员ID
- `name` (string): 姓名
- `phoneNumber` (string): 手机号

**可选字段：**
- `dept` (string): 部门
- `officePhone` (string): 办公室电话
- `wechatId` (string): 微信号

**请求示例：**
```json
{
  "guardId": 1,
  "name": "张三（更新）",
  "phoneNumber": "13800000001",
  "dept": "安全保卫中心",
  "officePhone": "0755-12345679",
  "wechatId": "zhangsan_new"
}
```

#### 4. 导出安全员信息列表 (POST /guard/export)
**可选字段：**
- `name` (string): 安全员姓名（模糊匹配）
- `phoneNumber` (string): 安全员手机号

**请求示例：**
```json
{
  "name": "张",
  "phoneNumber": "138"
}
```

### 前端实现要点

#### 1. 分页处理
- 查询接口必须传递 `pageNum` 和 `pageSize` 参数
- 前端维护分页状态，并在搜索时重置到第一页

#### 2. 表单字段映射
- 必填字段：`name`、`phoneNumber`
- 可选字段：`dept`、`officePhone`、`wechatId`
- 编辑时使用 `guardId` 作为主键

#### 3. 批量操作
- 支持批量删除功能
- 删除ID以逗号分隔的字符串格式传递

#### 4. 导出功能
- 使用POST请求导出，支持筛选条件
- 返回Blob文件供下载

---

## 其他模块接口

## 点位管理模块 - 详细接口实现

### 接口映射表

基于提供的OpenAPI规范，点位管理模块包含以下接口：

| 功能 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 点位列表查询 | GET | `/point/list` | 分页查询，pageNum和pageSize为必填参数 |
| 查询巡查点位信息 | GET | `/point/{pointId}` | 根据点位ID查询单个点位详情 |
| 新增点位信息 | POST | `/point/` | 创建新点位，pointName、college、building、floor、areaId为必填字段 |
| 修改点位 | PUT | `/point/` | 更新点位信息，pointId、pointName、college、building、floor为必填字段 |
| 删除点位信息 | DELETE | `/point/{ids}` | 支持批量删除，ids格式为"1,2,3" |
| 点位信息导出 | POST | `/point/export` | 导出点位数据 |
| 绑定安全员到巡查点位 | POST | `/point/bind/{pointId}/{guardId}` | 绑定安全员到指定点位 |
| 解绑巡查点位的安全员 | POST | `/point/unbind/{pointId}` | 解绑指定点位的安全员 |

### 请求参数详情

#### 1. 点位列表查询 (GET /point/list)
**必填参数：**
- `pageNum` (integer): 当前页数
- `pageSize` (integer): 每页数量

**可选参数：**
- `pointName` (string): 点位名称（模糊匹配）
- `college` (string): 学院
- `building` (string): 楼栋
- `floor` (string): 楼层
- `areaId` (integer): 区域编号
- `guardId` (string): 安全员编号

**响应格式：**
```json
{
  "data": [
    {
      "id": "1",
      "pointId": "P001",
      "pointName": "A栋1楼消防通道",
      "college": "创意设计学院",
      "building": "A栋",
      "floor": "1楼",
      "areaId": "1",
      "guardId": "1",
      "createTime": "2024-01-01 10:00:00"
    }
  ],
  "total": 10,
  "pageNum": 1,
  "pageSize": 10
}
```

#### 2. 新增点位信息 (POST /point/)
**必填字段：**
- `pointName` (string): 点位名称
- `college` (string): 学院
- `building` (string): 楼栋
- `floor` (string): 楼层
- `areaId` (string): 所属区域ID

**请求示例：**
```json
{
  "pointName": "B栋2楼安全出口",
  "college": "计算机科学学院",
  "building": "B栋",
  "floor": "2楼",
  "areaId": "2"
}
```

#### 3. 修改点位 (PUT /point/)
**必填字段：**
- `pointId` (string): 点位编号
- `pointName` (string): 点位名称
- `college` (string): 学院
- `building` (string): 楼栋
- `floor` (string): 楼层

**可选字段：**
- `areaId` (integer): 所属区域ID
- `guardId` (integer): 绑定安全员ID

**请求示例：**
```json
{
  "pointId": "P001",
  "pointName": "A栋1楼消防通道（更新）",
  "college": "创意设计学院",
  "building": "A栋",
  "floor": "1楼",
  "areaId": 1,
  "guardId": 2
}
```

#### 4. 删除点位信息 (DELETE /point/{ids})
**路径参数：**
- `ids` (string): 点位ID列表，格式为"1,2,3"

**请求示例：**
```
DELETE /point/1,2,3
```

#### 5. 点位信息导出 (POST /point/export)
**可选字段：**
- `pointName` (string): 点位名称
- `college` (string): 学院
- `building` (string): 楼栋
- `floor` (string): 楼层
- `areaId` (integer): 区域编号
- `guardId` (integer): 安全员编号

**请求示例：**
```json
{
  "pointName": "消防",
  "college": "创意设计学院",
  "building": "A栋",
  "floor": "1楼",
  "areaId": 1,
  "guardId": 1
}
```

#### 6. 绑定安全员到巡查点位 (POST /point/bind/{pointId}/{guardId})
**路径参数：**
- `pointId` (string): 点位ID
- `guardId` (string): 安全员ID

**请求示例：**
```
POST /point/bind/1/2
```

#### 7. 解绑巡查点位的安全员 (POST /point/unbind/{pointId})
**路径参数：**
- `pointId` (string): 点位ID

**请求示例：**
```
POST /point/unbind/1
```

### 前端实现要点

#### 1. 分页处理
- 查询接口必须传递 `pageNum` 和 `pageSize` 参数
- 前端维护分页状态，并在搜索时重置到第一页

#### 2. 表单字段映射
- 必填字段：`pointName`、`college`、`building`、`floor`、`areaId`
- 可选字段：`guardId`（用于安全员绑定）
- 编辑时使用 `pointId` 作为主键

#### 3. 批量操作
- 支持批量删除功能
- 删除ID以逗号分隔的字符串格式传递

#### 4. 安全员绑定功能
- 支持独立的绑定/解绑接口
- 可在编辑点位时同时设置安全员

#### 5. 搜索和筛选
- 支持多字段组合搜索
- 包括点位名称、学院、楼栋、楼层等维度

## 通用接口模块 - 详细接口实现

### 接口映射表

基于提供的OpenAPI规范，通用接口模块包含以下接口：

| 功能 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 文件下载 | GET | `/common/download` | 通用文件下载接口，支持删除标志 |
| 用户登录 | POST | `/login` | 用户登录接口，支持query参数传递 |

### 请求参数详情

#### 1. 文件下载 (GET /common/download)
**必填参数：**
- `fileName` (string): 文件名
- `delete` (boolean): 是否删除文件

**请求示例：**
```
GET /common/download?fileName=report.xlsx&delete=false
```

**响应格式：**
- 返回文件流（Blob）
- Content-Type: application/octet-stream

#### 2. 用户登录 (POST /login)
**必填参数：**
- `username` (string): 用户名
- `password` (string): 密码

**可选参数：**
- `rememberMe` (boolean): 是否记住我

**请求示例：**
```
POST /login?username=admin&password=123456&rememberMe=true
```

**响应格式：**
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "user": {
      "id": "1",
      "username": "admin",
      "name": "管理员",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 前端实现要点

#### 1. 文件下载功能
- 使用GET请求，参数通过query传递
- 支持文件删除标志，下载完成后可选择删除
- 返回Blob对象，前端处理文件保存

#### 2. 登录接口适配
- ⚠️ **重要变更**：接口路径从 `/user/login` 改为 `/login`
- ⚠️ **参数传递方式**：从POST body改为query参数
- 新增 `rememberMe` 字段支持
- 前端需要添加"记住我"复选框

### 🚨 发现的问题和缺失字段

#### 1. **登录页面缺失字段**
- **问题**：前端登录表单缺少 `rememberMe` 字段
- **解决**：已在登录页面添加"记住我"复选框
- **影响**：用户可以选择是否记住登录状态

#### 2. **接口设计差异**
- **问题**：现有登录接口使用POST body传参，新规范使用query参数
- **说明**：query参数传递密码存在安全风险，建议后端考虑使用POST body
- **当前实现**：已按照OpenAPI规范实现query参数方式

### 用户管理模块

（待补充用户管理模块的详细接口信息）

### 常见问题

1. **CORS问题**：确保后端配置允许前端域名
2. **认证问题**：检查Token是否正确设置
3. **分页问题**：确保pageNum和pageSize参数正确传递
4. **类型错误**：确保前后端字段类型匹配

### 联调步骤

1. 确认后端接口可访问
2. 验证接口参数和响应格式
3. 测试各个功能模块
4. 进行集成测试
5. 性能优化和错误处理完善 