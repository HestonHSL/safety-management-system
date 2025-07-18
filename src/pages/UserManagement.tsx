import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Card,
  Row,
  Col,
  Tag,
  Divider
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  KeyOutlined,
  UserOutlined
} from '@ant-design/icons';
import { User, UserForm, UserQuery, UserRole } from '../types';
import { userApi } from '../services/api';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState<UserQuery>({});
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(UserRole.SUPER_ADMIN);
  
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // 获取当前用户角色
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setCurrentUserRole(userData.role);
    }
  }, []);

  // 获取用户列表
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userApi.getUsers(searchQuery);
      setUsers(response.data);
    } catch (error) {
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);

  // 搜索功能
  const handleSearch = (values: UserQuery) => {
    setSearchQuery(values);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setSearchQuery({});
  };

  // 新增用户
  const handleAdd = () => {
    setEditingUser(null);
    setModalVisible(true);
    form.resetFields();
    form.setFieldsValue({ status: 'active', role: UserRole.ADMIN });
  };

  // 编辑用户
  const handleEdit = (record: User) => {
    setEditingUser(record);
    setModalVisible(true);
    const { password, ...formData } = record as any;
    form.setFieldsValue(formData);
  };

  // 删除用户
  const handleDelete = async (id: string) => {
    try {
      await userApi.deleteUser(id);
      message.success('删除成功');
      fetchUsers();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 提交表单
  const handleSubmit = async (values: UserForm) => {
    try {
      if (editingUser) {
        await userApi.updateUser(editingUser.id, values);
        message.success('更新成功');
      } else {
        await userApi.createUser(values);
        message.success('新增成功');
      }
      setModalVisible(false);
      fetchUsers();
    } catch (error: any) {
      message.error(error.message || (editingUser ? '更新失败' : '新增失败'));
    }
  };

  // 重置密码
  const handleResetPassword = (record: User) => {
    setResetPasswordUser(record);
    setPasswordModalVisible(true);
    passwordForm.resetFields();
  };

  // 提交重置密码
  const handlePasswordSubmit = async (values: { password: string; confirmPassword: string }) => {
    if (!resetPasswordUser) return;
    
    try {
      await userApi.resetPassword(resetPasswordUser.id, values.password);
      message.success('密码重置成功');
      setPasswordModalVisible(false);
    } catch (error) {
      message.error('密码重置失败');
    }
  };

  const roleOptions = [
    { label: '超级管理员', value: UserRole.SUPER_ADMIN },
    { label: '管理员', value: UserRole.ADMIN }
  ];

  const statusOptions = [
    { label: '启用', value: 'active' },
    { label: '禁用', value: 'inactive' }
  ];

  const getRoleTag = (role: UserRole) => {
    return role === UserRole.SUPER_ADMIN ? 
      <Tag color="red">超级管理员</Tag> : 
      <Tag color="blue">管理员</Tag>;
  };

  const getStatusTag = (status: string) => {
    return status === 'active' ? 
      <Tag color="green">启用</Tag> : 
      <Tag color="red">禁用</Tag>;
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 80,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: UserRole) => getRoleTag(role),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (text: string) => text || '-',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      render: (text: string) => text || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLoginTime',
      key: 'lastLoginTime',
      render: (text: string) => text || '从未登录',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      render: (_: any, record: User) => (
        <Space size={4}>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={<KeyOutlined />}
            onClick={() => handleResetPassword(record)}
          >
            重置密码
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
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

  // 如果当前用户不是超级管理员，不显示此页面
  if (currentUserRole !== UserRole.SUPER_ADMIN) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <UserOutlined style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
          <h3>权限不足</h3>
          <p>只有超级管理员才能访问用户管理功能</p>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <Card title="用户管理" style={{ marginBottom: 20 }}>
        {/* 搜索表单 */}
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: 20 }}
        >
          <Form.Item name="name" label="姓名">
            <Input placeholder="请输入姓名" allowClear />
          </Form.Item>
          <Form.Item name="username" label="用户名">
            <Input placeholder="请输入用户名" allowClear />
          </Form.Item>
          <Form.Item name="role" label="角色">
            <Select
              placeholder="请选择角色"
              allowClear
              style={{ width: 120 }}
              options={roleOptions}
            />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select
              placeholder="请选择状态"
              allowClear
              style={{ width: 100 }}
              options={statusOptions}
            />
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
              新增用户
            </Button>
          </Col>
        </Row>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
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
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Col>
          </Row>
          
          {!editingUser && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label="密码"
                  rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码至少6位' }
                  ]}
                >
                  <Input.Password placeholder="请输入密码" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="confirmPassword"
                  label="确认密码"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: '请确认密码' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('两次输入的密码不一致'));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="请确认密码" />
                </Form.Item>
              </Col>
            </Row>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="role"
                label="角色"
                rules={[{ required: true, message: '请选择角色' }]}
              >
                <Select placeholder="请选择角色" options={roleOptions} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态" options={statusOptions} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { type: 'email', message: '请输入正确的邮箱格式' }
                ]}
              >
                <Input placeholder="请输入邮箱（可选）" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="手机号"
                rules={[
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                ]}
              >
                <Input placeholder="请输入手机号（可选）" />
              </Form.Item>
            </Col>
          </Row>

          <Divider />
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space size="small">
              <Button onClick={() => setModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                {editingUser ? '更新' : '新增'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 重置密码弹窗 */}
      <Modal
        title="重置密码"
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        footer={null}
        destroyOnClose
        width={400}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordSubmit}
        >
          <div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
            <strong>用户：</strong>{resetPasswordUser?.name} ({resetPasswordUser?.username})
          </div>
          
          <Form.Item
            name="password"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少6位' }
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请确认新密码" />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space size="small">
              <Button onClick={() => setPasswordModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                确认重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;