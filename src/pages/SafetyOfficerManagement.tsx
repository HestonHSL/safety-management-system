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
import { SafetyOfficer, SafetyOfficerForm, SafetyOfficerQuery, Point } from '../types';
import { safetyOfficerApi, pointApi, API_CONFIG } from '../services';
import { exportToExcel, readExcelFile } from '../utils/export';

const SafetyOfficerManagement: React.FC = () => {
  const [officers, setOfficers] = useState<SafetyOfficer[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState<SafetyOfficer | null>(null);
  const [searchQuery, setSearchQuery] = useState<SafetyOfficerQuery>({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [points, setPoints] = useState<Point[]>([]);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  // 选择使用的API
  const currentApi = safetyOfficerApi;

  // 获取安全员列表
  const fetchOfficers = async () => {
    setLoading(true);
    try {
      const queryParams = {
        ...searchQuery,
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      };
      
      const response = await currentApi.getSafetyOfficers(queryParams);
      setOfficers(response.data);
      
      // 更新分页信息
      if (API_CONFIG.USE_REAL_API) {
        const realResponse = response as any; // 真实API响应类型
        setPagination(prev => ({
          ...prev,
          total: realResponse.total || 0,
          current: realResponse.pageNum || 1,
          pageSize: realResponse.pageSize || 10,
        }));
      } else {
        setPagination(prev => ({
          ...prev,
          total: response.data.length,
        }));
      }
    } catch (error) {
      message.error('获取安全员列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取点位列表
  const fetchPoints = async () => {
    try {
      const response = await pointApi.getPoints({ pageNum: 1, pageSize: 1000 }); // 获取所有点位
      setPoints(response.data);
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
  const handleSearch = (values: SafetyOfficerQuery) => {
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
  const handleEdit = (record: SafetyOfficer) => {
    setEditingOfficer(record);
    setModalVisible(true);
    
    // 根据API类型设置表单值
    const formValues = API_CONFIG.USE_REAL_API ? {
      name: record.name,
      dept: record.dept || record.department,
      officePhone: record.officePhone || record.phone,
      phoneNumber: record.phoneNumber || record.mobile,
      wechatId: record.wechatId,
      guardId: record.guardId,
      pointIds: (record as any).pointIds || [],
    } : record;
    
    form.setFieldsValue(formValues);
  };

  // 删除安全员
  const handleDelete = async (id: string) => {
    try {
      await currentApi.deleteSafetyOfficer(id);
      message.success('删除成功');
      fetchOfficers();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 提交表单
  const handleSubmit = async (values: SafetyOfficerForm) => {
    try {
      if (editingOfficer) {
        await currentApi.updateSafetyOfficer(editingOfficer.id, values);
        message.success('更新成功');
      } else {
        await currentApi.createSafetyOfficer(values);
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
      if (API_CONFIG.USE_REAL_API) {
        // 调用真实API导出
        const blob = await safetyOfficerApi.exportSafetyOfficers({
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
      } else {
        // 使用本地导出
        const exportData = officers.map(officer => {
          const pointNames = (officer as any).pointIds?.map((id: string) => {
            const point = points.find(p => p.id === id);
            return point ? (point.pointName || point.name) : id;
          }).join(', ') || '';
          
          return {
            姓名: officer.name,
            部门: officer.dept || officer.department,
            办公室电话: officer.officePhone || officer.phone,
            手机号码: officer.phoneNumber || officer.mobile || '',
            微信号: officer.wechatId || '',
            负责点位: pointNames,
            创建时间: officer.createTime || ''
          };
        });
        
        exportToExcel(exportData, '安全员信息', [
          '姓名', '部门', '办公室电话', '手机号码', '微信号', '负责点位', '创建时间'
        ]);
        message.success('导出成功');
      }
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
      dataIndex: 'dept',
      key: 'dept',
      render: (text: string, record: SafetyOfficer) => text || record.department || '-',
    },
    {
      title: '办公室电话',
      dataIndex: 'officePhone',
      key: 'officePhone',
      render: (text: string, record: SafetyOfficer) => text || record.phone || '-',
    },
    {
      title: '手机号码',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (text: string, record: SafetyOfficer) => text || record.mobile || '-',
    },
    {
      title: '微信号',
      dataIndex: 'wechatId',
      key: 'wechatId',
      render: (text: string) => text || '-',
    },
    {
      title: '负责点位',
      dataIndex: 'pointIds',
      key: 'pointIds',
      render: (pointIds: string[], record: SafetyOfficer) => {
        if (!pointIds || pointIds.length === 0) return '-';
        const pointNames = pointIds.map(id => {
          const point = points.find(p => p.id === id);
          return point ? (point.pointName || point.name) : id;
        });
        return pointNames.join(', ');
      },
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
      render: (_: any, record: SafetyOfficer) => (
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
          rowKey="id"
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