// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Tree,
//   Table,
//   Button,
//   Space,
//   Modal,
//   Form,
//   Input,
//   message,
//   Popconfirm,
//   Card,
//   Row,
//   Col,
//   InputNumber,
//   TreeSelect,
//   Typography
// } from 'antd';

// import { 
//   PlusOutlined, 
//   EditOutlined, 
//   DeleteOutlined, 
//   SearchOutlined,
//   FolderOutlined,
//   ExportOutlined,
//   ReloadOutlined
// } from '@ant-design/icons';
// import { Department, DepartmentForm, DepartmentQuery } from '../types';
// import { departmentApi } from '../services/';

// const { Text } = Typography;

// interface TreeNode {
//   key: string;
//   title: React.ReactNode;
//   children?: TreeNode[];
//   icon?: React.ReactNode;
//   isLeaf?: boolean;
//   data: Department;
// }



// const DepartmentManagement: React.FC = () => {
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [treeData, setTreeData] = useState<TreeNode[]>([]);
//   const [allDepartments, setAllDepartments] = useState<Department[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
//   const [searchQuery, setSearchQuery] = useState<DepartmentQuery>({});
//   const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
//   const [parentDepartments, setParentDepartments] = useState<any[]>([]);
//   const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
//   const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
//   const [searchValue, setSearchValue] = useState('');
//   const [form] = Form.useForm();
//   const [searchForm] = Form.useForm();

//   // 构建TreeSelect选项
//   const buildTreeSelectOptions = useCallback((departments: Department[]): any[] => {
//     return departments.map((dept: Department) => ({
//       value: dept.deptId,
//       label: `${dept.deptName} (${dept.deptCode})`,
//       children: buildTreeSelectOptions(dept.children || [])
//     }));
//   }, []);

//   // 构建树形数据
//   const buildTreeData = useCallback((data: Department[], filterValue: string = ''): TreeNode[] => {
//     return data.filter(item => 
//       !filterValue || (item.deptName ?? '').toLowerCase().includes(filterValue.toLowerCase())
//     ).map(item => ({
//       key: item.deptId?.toString()!,
//       title: (
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <div>
//             <FolderOutlined style={{ marginRight: 8, color: '#1890ff' }} />
//             <Text strong>{item.deptName}</Text>
//             <Text type="secondary" style={{ marginLeft: 8 }}>({item.deptCode})</Text>
//           </div>
//         </div>
//       ),
//       icon: <FolderOutlined />,
//       isLeaf: !item.children || item.children.length === 0,
//       data: item,
//       children: item.children ? buildTreeData(item.children, filterValue) : undefined
//     }));
//   }, []);

//   // 加载父部门选项
//   const loadParentDepartments = useCallback(async () => {
//     try {
//       const response = await departmentApi.getDepartmentTree();
//       const options = response.data.map((dept: Department) => ({
//         value: dept.deptId,
//         label: `${dept.deptName} (${dept.deptCode})`,
//         children: buildTreeSelectOptions(dept.children || [])
//       }));
//       setParentDepartments([
//         { value: '0', label: '顶级部门' },
//         ...options
//       ]);
//     } catch (error) {
//       console.error('加载父部门选项失败:', error);
//       message.error('加载父部门选项失败');
//     }
//   }, [buildTreeSelectOptions]);

//   // 加载部门列表
//   const loadDepartments = useCallback(async () => {
//     try {
//       setLoading(true);
//       const params = {
//         ...searchQuery,
//         pageNum: pagination.current,
//         pageSize: pagination.pageSize,
//       };
      
//       const response = await departmentApi.getDepartments(params);
//       setDepartments(response.data);
//       setPagination(prev => ({
//         ...prev,
//         total: response.total,
//         current: response.pageNum,
//         pageSize: response.pageSize,
//       }));
//     } catch (error: any) {
//       console.error('加载部门列表失败:', error);
//       message.error(`加载部门列表失败: ${error.message || '未知错误'}`);
//     } finally {
//       setLoading(false);
//     }
//   }, [searchQuery, pagination.current, pagination.pageSize]);

//   // 加载部门树
//   const loadDepartmentTree = useCallback(async () => {
//     try {
//       const response = await departmentApi.getDepartmentTree();
//       setAllDepartments(response.data);
//       const tree = buildTreeData(response.data, searchValue);
//       setTreeData(tree);
//     } catch (error: any) {
//       console.error('加载部门树失败:', error);
//       message.error(`加载部门树失败: ${error.message || '未知错误'}`);
//     }
//   }, [searchValue, buildTreeData]);

//   // 初始化数据加载
//   const initData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const params = {
//         pageNum: 1,
//         pageSize: 10,
//       };
      
//       const [deptResponse] = await Promise.all([
//         departmentApi.getDepartments(params),
//         loadDepartmentTree(),
//         loadParentDepartments()
//       ]);
      
//       setDepartments(deptResponse.data);
//       setPagination({
//         current: deptResponse.pageNum,
//         pageSize: deptResponse.pageSize,
//         total: deptResponse.total
//       });
//     } catch (error: any) {
//       console.error('初始化数据失败:', error);
//       message.error('初始化数据失败');
//     } finally {
//       setLoading(false);
//     }
//   }, [loadDepartmentTree, loadParentDepartments]);

//   // 新增部门
//   const handleAdd = (parentId?: string) => {
//     setEditingDepartment(null);
//     form.resetFields();
//     if (parentId) {
//       form.setFieldsValue({ parentId: parseInt(parentId) });
//     }
//     setModalVisible(true);
//   };

//   // 编辑部门
//   const handleEdit = (dept: Department) => {
//     setEditingDepartment(dept);
//     form.setFieldsValue({
//       deptCode: dept.deptCode,
//       deptName: dept.deptName,
//       orderNum: dept.orderNum,
//       parentId: dept.parentId || 0,
//       remark: dept.remark,
//     });
//     setModalVisible(true);
//   };

//   // 删除部门
//   const handleDelete = async (deptId: string) => {
//     try {
//       await departmentApi.deleteDepartment(deptId);
//       message.success('删除成功');
      
//       // 等待数据刷新完成
//       await Promise.all([
//         loadDepartments(),
//         loadDepartmentTree(),
//         loadParentDepartments()
//       ]);
//     } catch (error: any) {
//       message.error('删除失败');
//       console.error('删除失败:', error);
//     }
//   };

//   // 保存部门
//   const handleSave = async (values: DepartmentForm) => {
//     try {
//       if (editingDepartment) {
//         await departmentApi.updateDepartment(editingDepartment.deptId, values);
//         message.success('更新成功');
//       } else {
//         await departmentApi.createDepartment(values);
//         message.success('创建成功');
//       }
      
//       setModalVisible(false);
      
//       // 等待数据刷新完成
//       await Promise.all([
//         loadDepartments(),
//         loadDepartmentTree(),
//         loadParentDepartments()
//       ]);
      
//     } catch (error: any) {
//       const errorMsg = editingDepartment ? '更新失败' : '创建失败';
//       message.error(`${errorMsg}: ${error.message}`);
//       console.error('保存失败:', error);
//     }
//   };

//   // 搜索部门
//   const handleSearch = async (values: DepartmentQuery) => {
//     setSearchQuery(values);
//     setPagination(prev => ({ ...prev, current: 1 }));
    
//     // 立即触发数据加载
//     try {
//       setLoading(true);
//       const params = {
//         ...values,
//         pageNum: 1,
//         pageSize: pagination.pageSize,
//       };
      
//       const response = await departmentApi.getDepartments(params);
//       setDepartments(response.data);
//       setPagination(prev => ({
//         ...prev,
//         current: 1,
//         total: response.total,
//       }));
//     } catch (error: any) {
//       console.error('搜索部门失败:', error);
//       message.error('搜索失败');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 重置搜索
//   const handleReset = async () => {
//     searchForm.resetFields();
//     setSearchQuery({});
//     setSearchValue('');
//     setPagination(prev => ({ ...prev, current: 1 }));
    
//     // 立即重新加载数据
//     try {
//       setLoading(true);
//       const params = {
//         pageNum: 1,
//         pageSize: pagination.pageSize,
//       };
      
//       const response = await departmentApi.getDepartments(params);
//       setDepartments(response.data);
//       setPagination(prev => ({
//         ...prev,
//         current: 1,
//         total: response.total,
//       }));
//     } catch (error: any) {
//       console.error('重置搜索失败:', error);
//       message.error('重置失败');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 导出部门信息
//   const handleExport = async () => {
//     try {
//       const blob = await departmentApi.exportDepartments();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `部门信息_${new Date().toISOString().slice(0, 10)}.xlsx`;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);
//       message.success('导出成功');
//     } catch (error) {
//       message.error('导出失败');
//       console.error('导出失败:', error);
//     }
//   };

//   // 树搜索
//   const handleTreeSearch = (value: string) => {
//     setSearchValue(value);
//     if (value) {
//       const tree = buildTreeData(allDepartments, value);
//       setTreeData(tree);
//       // 展开所有匹配的节点
//       const allKeys = getAllTreeKeys(tree);
//       setExpandedKeys(allKeys);
//     } else {
//       const tree = buildTreeData(allDepartments);
//       setTreeData(tree);
//       setExpandedKeys([]);
//     }
//   };

//   // 获取所有树节点key
//   const getAllTreeKeys = (nodes: TreeNode[]): string[] => {
//     const keys: string[] = [];
//     const traverse = (nodes: TreeNode[]) => {
//       nodes.forEach(node => {
//         keys.push(node.key);
//         if (node.children) {
//           traverse(node.children);
//         }
//       });
//     };
//     traverse(nodes);
//     return keys;
//   };

//   // Tree事件处理器
//   const handleTreeExpand = (expandedKeys: React.Key[]) => {
//     setExpandedKeys(expandedKeys.map(key => String(key)));
//   };

//   const handleTreeSelect = (selectedKeys: React.Key[]) => {
//     setSelectedKeys(selectedKeys.map(key => String(key)));
//   };

//   // 表格列定义
//   const columns = [
//     {
//       title: '部门编码',
//       dataIndex: 'deptCode',
//       key: 'deptCode',
//       width: 120,
//     },
//     {
//       title: '部门名称',
//       dataIndex: 'deptName',
//       key: 'deptName',
//       width: 200,
//     },
//     {
//       title: '显示顺序',
//       dataIndex: 'orderNum',
//       key: 'orderNum',
//       width: 100,
//     },
//     {
//       title: '上级部门ID',
//       dataIndex: 'parentId',
//       key: 'parentId',
//       width: 120,
//       render: (parentId: number) => parentId || '顶级部门',
//     },
//     {
//       title: '点位数量',
//       dataIndex: 'pointCount',
//       key: 'pointCount',
//       width: 100,
//       render: (count: number) => count || 0,
//     },
//     {
//       title: '备注',
//       dataIndex: 'remark',
//       key: 'remark',
//       ellipsis: true,
//     },
//     {
//       title: '创建时间',
//       dataIndex: 'createTime',
//       key: 'createTime',
//       width: 180,
//     },
//     {
//       title: '操作',
//       key: 'action',
//       width: 120,
//       fixed: 'right' as const,
//       render: (_: unknown, record: Department) => (
//         <Space size={4}>
//           <Button
//             type="link"
//             size="small"
//             icon={<EditOutlined />}
//             onClick={() => handleEdit(record)}
//           >
//             编辑
//           </Button>
//           <Popconfirm
//             title="确定删除这个部门吗？"
//             onConfirm={() => handleDelete(record.deptId)}
//             okText="确定"
//             cancelText="取消"
//           >
//             <Button
//               type="link"
//               size="small"
//               danger
//               icon={<DeleteOutlined />}
//             >
//               删除
//             </Button>
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   useEffect(() => {
//     initData();
//   }, []);

//   return (
//     <div style={{ padding: '24px' }}>
//       <Row gutter={[16, 16]}>
//         {/* 左侧树形结构 */}
//         <Col xs={24} md={8}>
//           <Card 
//             title="部门结构" 
//             size="small"
//             extra={
//               <Button 
//                 size="small" 
//                 icon={<ReloadOutlined />}
//                 onClick={loadDepartmentTree}
//               >
//                 刷新
//               </Button>
//             }
//           >
//             <Input.Search
//               placeholder="搜索部门"
//               onSearch={handleTreeSearch}
//               style={{ marginBottom: 16 }}
//               allowClear
//             />
//             <Tree
//               showIcon
//               treeData={treeData}
//               expandedKeys={expandedKeys}
//               selectedKeys={selectedKeys}
//               onExpand={handleTreeExpand}
//               onSelect={handleTreeSelect}
//               height={600}
//               style={{ overflow: 'auto' }}
//             />
//           </Card>
//         </Col>

//         {/* 右侧列表 */}
//         <Col xs={24} md={16}>
//           <Card title="部门管理" size="small">
//             {/* 搜索区域 */}
//             <Form
//               form={searchForm}
//               layout="inline"
//               onFinish={handleSearch}
//               style={{ marginBottom: 16 }}
//             >
//               <Form.Item name="deptCode" label="部门编码">
//                 <Input placeholder="请输入部门编码" />
//               </Form.Item>
//               <Form.Item name="deptName" label="部门名称">
//                 <Input placeholder="请输入部门名称" />
//               </Form.Item>
//               <Form.Item>
//                 <Space>
//                   <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
//                     搜索
//                   </Button>
//                   <Button onClick={handleReset}>重置</Button>
//                 </Space>
//               </Form.Item>
//             </Form>

//             {/* 操作按钮 */}
//             <Space style={{ marginBottom: 16 }}>
//               <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd()}>
//                 新增部门
//               </Button>
//               <Button icon={<ExportOutlined />} onClick={handleExport}>
//                 导出
//               </Button>
//               <Button 
//                 icon={<ReloadOutlined />} 
//                 onClick={async () => {
//                   try {
//                     setLoading(true);
//                     const params = {
//                       ...searchQuery,
//                       pageNum: pagination.current,
//                       pageSize: pagination.pageSize,
//                     };
                    
//                     const [deptResponse] = await Promise.all([
//                       departmentApi.getDepartments(params),
//                       loadDepartmentTree(),
//                       loadParentDepartments()
//                     ]);
                    
//                     setDepartments(deptResponse.data);
//                     setPagination(prev => ({
//                       ...prev,
//                       total: deptResponse.total
//                     }));
//                     message.success('刷新成功');
//                   } catch (error: any) {
//                     console.error('刷新失败:', error);
//                     message.error('刷新失败');
//                   } finally {
//                     setLoading(false);
//                   }
//                 }}
//               >
//                 刷新
//               </Button>
//             </Space>

//             {/* 部门表格 */}
//             <Table
//               columns={columns}
//               dataSource={departments}
//               rowKey="deptId"
//               loading={loading}
//               pagination={{
//                 current: pagination.current,
//                 pageSize: pagination.pageSize,
//                 total: pagination.total,
//                 showSizeChanger: true,
//                 showQuickJumper: true,
//                 showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
//                 onChange: async (page, size) => {
//                   try {
//                     setLoading(true);
//                     const params = {
//                       ...searchQuery,
//                       pageNum: page,
//                       pageSize: size || 10,
//                     };
                    
//                     const response = await departmentApi.getDepartments(params);
//                     setDepartments(response.data);
//                     setPagination({
//                       current: response.pageNum,
//                       pageSize: response.pageSize,
//                       total: response.total
//                     });
//                   } catch (error: any) {
//                     console.error('分页加载失败:', error);
//                     message.error('分页加载失败');
//                   } finally {
//                     setLoading(false);
//                   }
//                 },
//               }}
//               scroll={{ x: 1000 }}
//               size="middle"
//             />
//           </Card>
//         </Col>
//       </Row>

//       {/* 部门编辑弹窗 */}
//       <Modal
//         title={editingDepartment ? '编辑部门' : '新增部门'}
//         open={modalVisible}
//         onCancel={() => setModalVisible(false)}
//         footer={null}
//         width={600}
//       >
//         <Form
//           form={form}
//           layout="vertical"
//           onFinish={handleSave}
//         >
//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item
//                 name="deptCode"
//                 label="部门编码"
//                 rules={[{ required: true, message: '请输入部门编码' }]}
//               >
//                 <Input placeholder="请输入部门编码" />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 name="deptName"
//                 label="部门名称"
//                 rules={[{ required: true, message: '请输入部门名称' }]}
//               >
//                 <Input placeholder="请输入部门名称" />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item
//                 name="orderNum"
//                 label="显示顺序"
//                 rules={[{ required: true, message: '请输入显示顺序' }]}
//               >
//                 <InputNumber 
//                   placeholder="请输入显示顺序" 
//                   min={0} 
//                   style={{ width: '100%' }}
//                 />
//               </Form.Item>
//             </Col>
//             <Col span={12}>
//               <Form.Item
//                 name="parentId"
//                 label="上级部门"
//               >
//                 <TreeSelect
//                   placeholder="请选择上级部门"
//                   allowClear
//                   treeData={parentDepartments}
//                   style={{ width: '100%' }}
//                 />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Form.Item
//             name="remark"
//             label="备注"
//           >
//             <Input.TextArea 
//               placeholder="请输入备注" 
//               rows={3}
//             />
//           </Form.Item>

//           <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
//             <Space>
//               <Button onClick={() => setModalVisible(false)}>取消</Button>
//               <Button type="primary" htmlType="submit">
//                 {editingDepartment ? '更新' : '创建'}
//               </Button>
//             </Space>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default DepartmentManagement; 