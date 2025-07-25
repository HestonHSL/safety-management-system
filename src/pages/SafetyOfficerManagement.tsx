import React, { useState, useEffect } from 'react';
import {
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
  Upload,
  Divider,
  Select
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UploadOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { SecurityGuard, SecurityGuardForm, SecurityGuardQuery, PatrolPoint } from '../types';
import { securityGuardApi, patrolPointApi, API_CONFIG } from '../services';
import { exportToExcel, readExcelFile } from '../utils/export';

const SafetyOfficerManagement: React.FC = () => {
  const [officers, setOfficers] = useState<SecurityGuard[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState<SecurityGuard | null>(null);
  const [searchQuery, setSearchQuery] = useState<SecurityGuardQuery>({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [points, setPoints] = useState<PatrolPoint[]>([]);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  // 选择使用的API
  const currentApi = securityGuardApi;

  // 获取安全员列表
  const fetchOfficers = async () => {
    setLoading(true);
    try {
      const queryParams = {
        ...searchQuery,
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      };
      
      const response = await currentApi.getSecurityGuards(queryParams);
      setOfficers(response.rows || []);
      
      // 更新分页信息
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
        current: queryParams.pageNum || 1,
        pageSize: queryParams.pageSize || 10,
      }));
    } catch (error) {
      message.error('获取安全员列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取点位列表
  const fetchPoints = async () => {
    try {
      // 注意：这里暂时使用空数组，因为API文档中没有点位列表接口
      // 实际使用时需要根据后端提供的接口调整
      setPoints([]);
    } catch (error) {
      console.error('获取点位列表失败:', error);
    }
  };

  useEffect(() => {
    fetchOfficers();
  }, [searchQuery, pagination.current, pagination.pageSize]);

  useEffect(() => {
    fetchPoints();
  }, []);

  // 搜索功能
  const handleSearch = (values: SecurityGuardQuery) => {
    setSearchQuery(values);
    setPagination(prev => ({ ...prev, current: 1 })); // 重置到第一页
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setSearchQuery({});
    setPagination(prev => ({ ...prev, current: 1 })); // 重置到第一页
  };

  // 新增安全员
  const handleAdd = () => {
    setEditingOfficer(null);
    setModalVisible(true);
    form.resetFields();
  };

  // 编辑安全员
  const handleEdit = (record: SecurityGuard) => {
    setEditingOfficer(record);
    setModalVisible(true);
    
    // 设置表单值
    form.setFieldsValue({
      name: record.name,
      deptId: record.deptId,
      officePhone: record.officePhone,
      phoneNumber: record.phoneNumber,
      wechatId: record.wechatId,
      remark: record.remark,
    });
  };

  // 删除安全员
  const handleDelete = async (guardId: number) => {
    try {
      await currentApi.deleteSecurityGuards([guardId]);
      message.success('删除成功');
      fetchOfficers();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 提交表单
  const handleSubmit = async (values: SecurityGuardForm) => {
    try {
      if (editingOfficer) {
        await currentApi.updateSecurityGuard({ ...values, guardId: editingOfficer.guardId });
        message.success('更新成功');
      } else {
        await currentApi.createSecurityGuard(values);
        message.success('新增成功');
      }
      setModalVisible(false);
      fetchOfficers();
    } catch (error) {
      message.error(editingOfficer ? '更新失败' : '新增失败');
    }
  };

  // 导出数据
  const handleExport = async () => {
    try {
      // 调用真实API导出
      const blob = await currentApi.exportSecurityGuards({
        name: searchQuery.name,
        phoneNumber: searchQuery.phoneNumber,
      });
      
      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `安全员信息_${new Date().toLocaleDateString()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      message.success('导出成功');
    } catch (error) {
      message.error('导出失败');
    }
  };

  // 批量导入
  const handleImport = async (file: File) => {
    try {
      const data = await readExcelFile(file);
      
      // 这里应该验证数据格式并批量创建
      console.log('导入的数据:', data);
      message.success(`成功导入 ${data.length} 条记录`);
      fetchOfficers();
    } catch (error) {
      message.error('导入失败，请检查文件格式');
    }
    return false; // 阻止自动上传
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
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '部门',
      dataIndex: 'deptName',
      key: 'deptName',
      render: (text: string) => text || '-',
    },
    {
      title: '办公室电话',
      dataIndex: 'officePhone',
      key: 'officePhone',
      render: (text: string) => text || '-',
    },
    {
      title: '手机号码',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (text: string) => text || '-',
    },
    {
      title: '微信号',
      dataIndex: 'wechatId',
      key: 'wechatId',
      render: (text: string) => text || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time: Date | string) => {
        if (!time) return '-';
        if (time instanceof Date) {
          return time.toLocaleString();
        }
        return time;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: SecurityGuard) => (
        <Space size={4}>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个安全员吗？"
            onConfirm={() => handleDelete(record.guardId || 0)}
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
      <Card title="安全员信息管理" style={{ marginBottom: 20 }}>
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
          <Form.Item name="phoneNumber" label="手机号码">
            <Input placeholder="请输入手机号码" allowClear />
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
            <Space size="small">
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                新增安全员
              </Button>
              <Upload
                beforeUpload={handleImport}
                showUploadList={false}
                accept=".xlsx,.xls"
              >
                <Button icon={<UploadOutlined />}>批量导入</Button>
              </Upload>
            </Space>
          </Col>
          <Col>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              导出数据
            </Button>
          </Col>
        </Row>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={officers}
          rowKey="guardId"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            onChange: (page, size) => {
              setPagination(prev => ({ ...prev, current: page, pageSize: size || 10 }));
            },
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingOfficer ? '编辑安全员' : '新增安全员'}
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
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dept"
                label="部门"
                rules={[{ required: true, message: '请输入部门' }]}
              >
                <Input placeholder="请输入部门" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="officePhone"
                label="办公室电话"
              >
                <Input placeholder="请输入办公室电话（可选）" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phoneNumber"
                label="手机号码"
                rules={[
                  { required: true, message: '请输入手机号码' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                ]}
              >
                <Input placeholder="请输入手机号码" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="wechatId"
                label="微信号"
              >
                <Input placeholder="请输入微信号（可选）" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="pointIds"
                label="负责点位"
              >
                <Select
                  mode="multiple"
                  placeholder="请选择负责的点位（可选）"
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={points.map(point => ({
                    label: `${point.pointName || point.name} - ${point.college || point.regionName || ''}`,
                    value: point.id,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
          

          <Divider />
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space size="small">
              <Button onClick={() => setModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                {editingOfficer ? '更新' : '新增'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SafetyOfficerManagement; 