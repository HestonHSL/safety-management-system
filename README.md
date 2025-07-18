# 消防安全管理责任人系统

基于React + TypeScript + Antd开发的消防安全管理系统，用于管理区域、点位和安全员信息。

## 功能特性

### 🏢 区域管理
- ✅ 新增、编辑、删除区域信息
- ✅ 区域搜索功能
- ✅ 区域与点位关联管理

### 📍 点位管理
- ✅ 新增、编辑、删除点位信息
- ✅ 支持手动新增和Excel批量导入
- ✅ 点位与区域、安全员关联
- ✅ 生成点位二维码并支持预览、下载
- ✅ 数据导出功能

### 👨‍🚒 安全员信息管理
- ✅ 新增、编辑、删除安全员信息
- ✅ 支持批量导入导出
- ✅ 安全员与点位关联管理
- ✅ 完整的个人信息管理（姓名、电话、邮箱、部门、职位、工号）

### 📱 扫码查看功能
- 🔄 H5页面扫码查看点位信息（待开发）
- 🔄 展示点位详情和负责安全员信息（待开发）

## 技术栈

- **前端框架**: React 18 + TypeScript
- **UI组件库**: Ant Design 5.x
- **路由管理**: React Router 6
- **状态管理**: React Hooks
- **工具库**:
  - axios: HTTP请求
  - qrcode: 二维码生成
  - xlsx: Excel文件处理

## 项目结构

```
src/
├── pages/                    # 页面组件
│   ├── RegionManagement.tsx     # 区域管理页面
│   ├── PointManagement.tsx      # 点位管理页面
│   └── SafetyOfficerManagement.tsx # 安全员管理页面
├── services/                 # API服务
│   └── api.ts                   # 模拟API接口
├── types/                    # 类型定义
│   └── index.ts                 # 主要数据类型
├── utils/                    # 工具函数
│   ├── export.ts               # Excel导入导出
│   └── qrcode.ts               # 二维码生成
├── App.tsx                   # 主应用组件
├── App.css                   # 应用样式
├── index.tsx                 # 应用入口
└── index.css                 # 全局样式
```

## 安装依赖

```bash
npm install
```

## 启动开发服务器

```bash
npm start
```

应用将在 [http://localhost:3000](http://localhost:3000) 启动

## 构建生产版本

```bash
npm run build
```

## 页面导航

系统包含3个主要管理页面：

1. **区域管理** (`/regions`) - 管理安全区域信息
2. **点位管理** (`/points`) - 管理安全点位和二维码
3. **安全员管理** (`/officers`) - 管理安全员信息

## 主要功能说明

### 区域管理
- 支持区域的增删改查
- 显示每个区域关联的点位数量
- 提供按名称搜索功能

### 点位管理
- 完整的点位信息管理（名称、编码、位置、描述）
- 必须关联区域和负责安全员
- 自动生成二维码，支持预览和下载
- 支持Excel格式的批量导入导出

### 安全员管理
- 详细的安全员信息管理
- 包含联系方式、部门职位等信息
- 支持Excel格式的批量导入导出
- 提供按姓名和部门搜索

### 数据导入导出
- 支持Excel格式的数据导入
- 支持将当前数据导出为Excel文件
- 自动生成标准格式的Excel模板

## 数据模型

### 区域 (Region)
```typescript
{
  id: string;
  name: string;           // 区域名称
  description?: string;   // 区域描述
  createTime: string;
  updateTime: string;
  pointCount?: number;    // 关联点位数量
}
```

### 安全员 (SafetyOfficer)
```typescript
{
  id: string;
  name: string;           // 姓名
  phone: string;          // 手机号码
  email?: string;         // 邮箱
  department: string;     // 部门
  position: string;       // 职位
  employeeNumber: string; // 工号
  createTime: string;
  updateTime: string;
}
```

### 点位 (Point)
```typescript
{
  id: string;
  name: string;           // 点位名称
  code: string;           // 点位编码
  location: string;       // 位置
  description?: string;   // 描述
  regionId: string;       // 所属区域ID
  regionName?: string;    // 所属区域名称
  safetyOfficerId: string;// 负责安全员ID
  safetyOfficerName?: string; // 负责安全员姓名
  qrCode?: string;        // 二维码
  createTime: string;
  updateTime: string;
}
```

## 待开发功能

- [ ] H5扫码查看页面
- [ ] 用户权限管理
- [ ] 数据统计看板
- [ ] 消息通知功能
- [ ] 移动端适配优化

## 注意事项

1. 当前使用模拟数据，实际使用时需要替换为真实的后端API
2. 二维码生成的H5链接需要根据实际部署地址调整
3. 文件上传功能需要后端支持
4. 建议在生产环境中添加用户认证和权限控制

## 开发说明

本项目基于Create React App创建，遵循React和TypeScript最佳实践。所有组件都采用函数式组件和Hooks，确保代码的现代化和可维护性。 