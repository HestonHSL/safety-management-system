import React, { useState, useEffect } from 'react';
import {
  Tree,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Card,
  Row,
  Col,
  InputNumber,
  TreeSelect,
  Dropdown,
  Typography,
  MenuProps
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  MoreOutlined,
  FolderOutlined
} from '@ant-design/icons';
import { Region, RegionForm, RegionQuery } from '../types';
import { regionApi } from '../services';

const { Text } = Typography;

interface TreeNode {
  key: string;
  title: React.ReactNode;
  children?: TreeNode[];
  icon?: React.ReactNode;
  isLeaf?: boolean;
  data: Region;
}

const RegionManagement: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [allRegions, setAllRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);
  const [treeLoading, setTreeLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);
  const [searchQuery, setSearchQuery] = useState<RegionQuery>({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [parentRegions, setParentRegions] = useState<any[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  // 构建树形数据结构
  const buildTreeData = (regions: Region[], searchValue?: string): TreeNode[] => {
    const map = new Map<string, Region>();
    const roots: TreeNode[] = [];

    // 创建映射
    regions.forEach(region => {
      map.set(region.id, region);
    });

    regions.forEach(region => {
      const isHighlighted = searchValue && 
        (region.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
         region.areaName?.toLowerCase().includes(searchValue.toLowerCase()));

      const nodeTitle = (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          minHeight: '32px',
          padding: '4px 8px',
          backgroundColor: isHighlighted ? '#fff1b8' : 'transparent',
          borderRadius: '4px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Text strong style={{ marginRight: '8px' }}>
              {region.areaName || region.name}
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              (排序: {region.orderNum || 0}, 点位: {region.pointCount || 0})
            </Text>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <Dropdown
              menu={{
                items: getMenuItems(region),
                onClick: ({ key, domEvent }) => {
                  domEvent.stopPropagation();
                  handleMenuClick(key, region);
                }
              }}
              trigger={['click']}
            >
              <Button 
                type="text" 
                size="small" 
                icon={<MoreOutlined />}
                onClick={(e) => e.stopPropagation()}
              />
            </Dropdown>
          </div>
        </div>
      );

      const treeNode: TreeNode = {
        key: region.id,
        title: nodeTitle,
        data: region,
        children: [],
        icon: <FolderOutlined />
      };

      if (!region.parentId || !map.has(region.parentId)) {
        // 根节点
        roots.push(treeNode);
      } else {
        // 子节点
        const parent = map.get(region.parentId);
        if (parent) {
          let parentNode = findNodeInTree(roots, parent.id);
          if (!parentNode) {
            // 如果父节点还没有被创建，先创建父节点
            const parentTreeNode: TreeNode = {
              key: parent.id,
              title: createNodeTitle(parent),
              data: parent,
              children: [treeNode],
              icon: <FolderOutlined />
            };
            roots.push(parentTreeNode);
          } else {
            parentNode.children = parentNode.children || [];
            parentNode.children.push(treeNode);
          }
        }
      }
    });

    // 排序
    const sortTree = (nodes: TreeNode[]): TreeNode[] => {
      return nodes
        .sort((a, b) => (a.data.orderNum || 0) - (b.data.orderNum || 0))
        .map(node => ({
          ...node,
          children: node.children ? sortTree(node.children) : undefined
        }));
    };

    return sortTree(roots);
  };

  // 在树中查找节点
  const findNodeInTree = (nodes: TreeNode[], key: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.key === key) {
        return node;
      }
      if (node.children) {
        const found = findNodeInTree(node.children, key);
        if (found) return found;
      }
    }
    return null;
  };

  // 创建节点标题
  const createNodeTitle = (region: Region) => {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        minHeight: '32px',
        padding: '4px 8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Text strong style={{ marginRight: '8px' }}>
            {region.areaName || region.name}
          </Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            (排序: {region.orderNum || 0}, 点位: {region.pointCount || 0})
          </Text>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <Dropdown
            menu={{
              items: getMenuItems(region),
              onClick: ({ key, domEvent }) => {
                domEvent.stopPropagation();
                handleMenuClick(key, region);
              }
            }}
            trigger={['click']}
          >
            <Button 
              type="text" 
              size="small" 
              icon={<MoreOutlined />}
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        </div>
      </div>
    );
  };

  // 获取菜单项
  const getMenuItems = (region: Region): MenuProps['items'] => [
    {
      key: 'addChild',
      label: '添加子区域',
      icon: <PlusOutlined />
    },
    {
      key: 'edit',
      label: '编辑',
      icon: <EditOutlined />
    },
    {
      type: 'divider'
    },
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
      danger: true
    }
  ];

  // 处理菜单点击
  const handleMenuClick = async (key: string, region: Region) => {
    switch (key) {
      case 'addChild':
        handleAddChild(region);
        break;
      case 'edit':
        handleEdit(region);
        break;
      case 'delete':
        Modal.confirm({
          title: '确定要删除这个区域吗？',
          content: '删除后将无法恢复，且会影响所有子区域。',
          okText: '确定',
          cancelText: '取消',
          onOk: () => handleDelete(region.id)
        });
        break;
    }
  };

  // 获取区域列表（用于表格分页显示）
  const fetchRegions = async (pageNum = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const response = await regionApi.getRegions({
        ...searchQuery,
        pageNum,
        pageSize
      });
      setRegions(response.data);
      setPagination(prev => ({
        ...prev,
        current: response.pageNum,
        pageSize: response.pageSize,
        total: response.total
      }));
    } catch (error) {
      message.error('获取区域列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取所有区域数据（用于构建树形结构）
  const fetchAllRegions = async () => {
    setTreeLoading(true);
    try {
      const response = await regionApi.getRegions({
        pageNum: 1,
        pageSize: 1000 // 获取所有数据
      });
      setAllRegions(response.data);
      const tree = buildTreeData(response.data, searchValue);
      setTreeData(tree);
      
      // 默认展开所有节点
      const allKeys = getAllNodeKeys(tree);
      setExpandedKeys(allKeys);
    } catch (error) {
      console.error('获取树形数据失败');
    } finally {
      setTreeLoading(false);
    }
  };

  // 获取所有节点的key
  const getAllNodeKeys = (nodes: TreeNode[]): string[] => {
    const keys: string[] = [];
    const traverse = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        keys.push(node.key);
        if (node.children) {
          traverse(node.children);
        }
      });
    };
    traverse(nodes);
    return keys;
  };

  // 获取父级区域列表
  const fetchParentRegions = async () => {
    try {
      const response = await regionApi.getRegionTreeSelect();
      setParentRegions(response.data);
    } catch (error) {
      console.error('获取父级区域列表失败');
    }
  };

  useEffect(() => {
    fetchRegions();
    fetchParentRegions();
  }, [searchQuery]);

  useEffect(() => {
    fetchAllRegions();
  }, [searchValue]);

  // 搜索功能
  const handleSearch = (values: RegionQuery) => {
    setSearchQuery(values);
    setSearchValue(values.name || '');
    setPagination(prev => ({ ...prev, current: 1 })); // 重置到第一页
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setSearchQuery({});
    setSearchValue('');
    setPagination(prev => ({ ...prev, current: 1 })); // 重置到第一页
  };

  // 树节点选择
  const handleTreeSelect = (selectedKeys: React.Key[]) => {
    const stringKeys = selectedKeys.map(key => key.toString());
    setSelectedKeys(stringKeys);
    if (stringKeys.length > 0) {
      const selectedId = stringKeys[0];
      const selectedRegion = allRegions.find(r => r.id === selectedId);
      if (selectedRegion) {
        // 可以在这里添加选中树节点后的操作，比如高亮表格中对应的行
        console.log('选中区域:', selectedRegion);
      }
    }
  };

  // 新增区域
  const handleAdd = () => {
    setEditingRegion(null);
    setModalVisible(true);
    form.resetFields();
  };

  // 新增子区域
  const handleAddChild = (parentRegion: Region) => {
    setEditingRegion(null);
    setModalVisible(true);
    form.resetFields();
    form.setFieldsValue({
      parentId: parentRegion.id
    });
  };

  // 编辑区域
  const handleEdit = (record: Region) => {
    setEditingRegion(record);
    setModalVisible(true);
    form.setFieldsValue({
      areaName: record.areaName || record.name,
      parentId: record.parentId || '',
      orderNum: record.orderNum || 0,
      description: record.description || '',
    });
  };

  // 删除区域
  const handleDelete = async (id: string) => {
    try {
      await regionApi.deleteRegion(id);
      message.success('删除成功');
      fetchRegions(); // 刷新表格数据
      fetchAllRegions(); // 刷新树形数据
      fetchParentRegions(); // 刷新父级区域选项
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 提交表单
  const handleSubmit = async (values: RegionForm) => {
    try {
      if (editingRegion) {
        await regionApi.updateRegion(editingRegion.id, values);
        message.success('更新成功');
      } else {
        await regionApi.createRegion(values);
        message.success('新增成功');
      }
      setModalVisible(false);
      fetchRegions(); // 刷新表格数据
      fetchAllRegions(); // 刷新树形数据
      fetchParentRegions(); // 刷新父级区域选项
    } catch (error) {
      message.error(editingRegion ? '更新失败' : '新增失败');
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 80,
      render: (_: any, __: any, index: number) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: '区域名称',
      dataIndex: 'areaName',
      key: 'areaName',
      render: (text: string, record: Region) => text || record.name,
    },
    {
      title: '父级区域',
      dataIndex: 'parentId',
      key: 'parentId',
      render: (parentId: string) => {
        if (!parentId) return '-';
        const parent = parentRegions.find(p => p.id === parentId);
        return parent ? parent.label : parentId;
      },
    },
    {
      title: '排序号',
      dataIndex: 'orderNum',
      key: 'orderNum',
      render: (num: number) => num || 0,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => text || '-',
    },
    {
      title: '点位数量',
      dataIndex: 'pointCount',
      key: 'pointCount',
      render: (count: number) => count || 0,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Region) => (
        <Space size={4}>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个区域吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card title="区域管理" style={{ marginBottom: 20 }}>
        {/* 搜索表单 */}
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: 20 }}
        >
          <Form.Item name="name" label="区域名称">
            <Input placeholder="请输入区域名称" allowClear />
          </Form.Item>
          <Form.Item>
            <Space size="small">
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>

        {/* 操作按钮 */}
        <Row justify="space-between" style={{ marginBottom: 20 }}>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增区域
            </Button>
          </Col>
        </Row>

        {/* 左右分栏布局 */}
        <Row gutter={16}>
          {/* 左侧树形结构 */}
          <Col span={6}>
            <Card title="区域树" size="small" style={{ height: '500px' }}>
              <div style={{ 
                height: '420px',
                overflow: 'auto'
              }}>
                {treeLoading ? (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '200px' 
                  }}>
                    加载中...
                  </div>
                ) : (
                  <Tree
                    showIcon
                    showLine
                    blockNode
                    expandedKeys={expandedKeys}
                    selectedKeys={selectedKeys}
                    onExpand={(keys) => setExpandedKeys(keys as string[])}
                    onSelect={handleTreeSelect}
                    treeData={treeData}
                    style={{ backgroundColor: 'transparent' }}
                  />
                )}
              </div>
            </Card>
          </Col>

          {/* 右侧表格 */}
          <Col span={18}>
            <Card title="区域列表" size="small" style={{ height: '500px' }}>
        <Table
          columns={columns}
          dataSource={regions}
          rowKey="id"
          loading={loading}
                size="small"
                scroll={{ y: 350 }}
          pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
                  onChange: (page, pageSize) => {
                    setPagination(prev => ({ ...prev, current: page, pageSize: pageSize || 10 }));
                    fetchRegions(page, pageSize);
                  },
          }}
                rowClassName={(record) => 
                  selectedKeys.includes(record.id) ? 'ant-table-row-selected' : ''
                }
        />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingRegion ? '编辑区域' : '新增区域'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ areaName: '', parentId: '', orderNum: 0, description: '' }}
        >
          <Form.Item
            name="areaName"
            label="区域名称"
            rules={[{ required: true, message: '请输入区域名称' }]}
          >
            <Input placeholder="请输入区域名称" />
          </Form.Item>
          
          <Form.Item
            name="parentId"
            label="父级区域"
          >
            <TreeSelect
              placeholder="请选择父级区域（可选）"
              allowClear
              treeData={parentRegions}
              fieldNames={{ label: 'label', value: 'id' }}
            />
          </Form.Item>
          
          <Form.Item
            name="orderNum"
            label="排序号"
            rules={[{ required: true, message: '请输入排序号' }]}
          >
            <InputNumber 
              placeholder="请输入排序号" 
              min={0}
              style={{ width: '100%' }}
            />
          </Form.Item>
          
          <Form.Item name="description" label="描述">
            <Input.TextArea
              placeholder="请输入区域描述（可选）"
              rows={4}
            />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space size="small">
              <Button onClick={() => setModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                {editingRegion ? '更新' : '新增'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RegionManagement; 