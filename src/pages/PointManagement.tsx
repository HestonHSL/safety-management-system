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
  Upload,
  Image,
  Divider,
  Spin
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  DownloadOutlined,
  UploadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { Department, PatrolPoint, PatrolPointForm, PatrolPointPageQuery, PatrolPointQuery, SecurityGuard } from '../types';
import { departmentApi } from '../services/department';
import { patrolPointApi } from '../services/patrol-point';
import { generateQRCode, generateLabelImage, downloadQRCode, downloadLabelImage } from '../utils/qrcode';
import { exportToExcel, readExcelFile } from '../utils/export';
import { securityGuardApi } from '../services/security-guard';

const PointManagement: React.FC = () => {
  const [points, setPoints] = useState<PatrolPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [editingPoint, setEditingPoint] = useState<PatrolPoint | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<PatrolPoint | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<PatrolPointQuery>({});
  const [departments, setDepartments] = useState<Department[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [options, setOptions] = useState({});

  const [guardMapLoaded, setGuardMapLoaded] = useState(false);
  const [guardMap, setGuardMap] = useState<Map<number, string>>(new Map());

  const [securityGuards, setSecurityGuards] = useState<SecurityGuard[]>([]);

  // 获取安全员列表
  const fetchSecurityGuards = async () => {
    try {
      // 调用接口获取安全员列表
      const response = await securityGuardApi.getBindableSecurityGuards();
      setSecurityGuards(response.data || []);
    } catch (error) {
      message.error('获取安全员列表失败');
    }
  };

  // 获取点位列表
  const fetchPoints = async () => {
    setLoading(true);
    try {
      const queryParams: PatrolPointPageQuery = {
        ...searchQuery,
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      };
      const response = await patrolPointApi.getPatrolPoints(queryParams);
      setPoints(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
      }));

      // 创建新的 Map 实例
      const newGuardMap = new Map<number, string>();

      // 设置 guardMap
      for (let i = 0; i < response.data.length; i++) {
        const guardId = response.data[i].guardId;
        if (!guardId) continue;
        const res = await securityGuardApi.getSecurityGuardById(guardId);
        if (res && res.name) {
          newGuardMap.set(guardId, res.name);
        }
      }

      // 更新 guardMap 状态
      setGuardMap(newGuardMap);
      setGuardMapLoaded(true); // 确保 guardMap 数据加载完成后更新状态

      // console.log("points", response.data);
      // 清空 guardMap
      // guardMap.clear();
      // for (let i = 0; i < response.data.length; i++) {
      //   if (!response.data[i].guardId) continue;
      //   const res = await securityGuardApi.getSecurityGuardById(response.data[i].guardId!);
      //   guardMap.set(response.data[i].guardId!, res.name!);
      //   console.log("map", guardMap);
      //   console.log("loaded", guardMapLoaded);
      //   // console.log("guard", res);

      //   console.log("after loaded", guardMapLoaded);
      // }
      // // 标记 guardMap 加载完成
      // setGuardMapLoaded(true);
      // console.log(guardMap.get(1));
      // const res = await securityGuardApi.getSecurityGuardById(1);
      // console.log("guard", res);
    } catch (error) {
      message.error('获取点位列表失败');
    } finally {
      setLoading(false);

    }
  };

  // 获取部门列表
  // const fetchDepartments = async () => {
  //   try {
  //     const response = await departmentApi.getDepartments({});
  //     setDepartments(response.rows?.map(dept => ({
  //       label: dept.deptName,
  //       value: dept.deptId,
  //     })) || []);
  //   } catch (error) {
  //     console.error('获取部门列表失败:', error);
  //   }
  // };

  // 获取部门列表（用于表格分页显示）
  const fetchDepartments = async () => {
    try {
      // 注意：由于API文档中没有分页的部门列表接口，这里使用树形接口
      const response = await departmentApi.getDepartmentTree();
      setDepartments(response.data || []);
      // setDepartments(response.data?.map(dept => ({
      //   label: dept.deptName!,
      //   value: dept.deptId!,
      // })) || []);
    } catch (error) {
      message.error('获取部门列表失败');
    }
  };

  useEffect(() => {
    fetchPoints();

  }, [searchQuery, pagination.current, pagination.pageSize]);

  useEffect(() => {
    fetchDepartments();
    fetchSecurityGuards();
  }, []);

  // 搜索功能
  const handleSearch = (values: PatrolPointQuery) => {
    values.pointCode = values.pointCode || "";
    values.pointId = values.pointId || "";
    values.pointName = values.pointName || "";
    values.deptId = values.deptId || "";
    // console.log("search666", values);
    setSearchQuery(values);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setSearchQuery({});
    setPagination(prev => ({ ...prev, current: 1 })); // 重置到第一页
  };

  // 新增点位
  const handleAdd = () => {
    setEditingPoint(null);
    setModalVisible(true);
    form.resetFields();
    form.setFieldsValue({
      // pointId: "",
      // pointCode: "",
      // deptId: "",
      building: "",
      floor: "",
      roomNumber: "",
      detailName: "",
      purpose: "",
      remark: "",
    });
  };

  // const handleAdd = () => {
  //   setEditingPoint(null);
  //   setModalVisible(true);
  //   form.resetFields();
  // };

  // 编辑点位
  const handleEdit = (record: PatrolPoint) => {
    setEditingPoint(record);
    setModalVisible(true);
    // form.setFieldsValue({
    //   ...record,
    //   deptId: record.deptId,
    // });
    form.setFieldsValue({
      pointId: record.pointId,
      pointCode: record.pointCode,
      deptId: record.deptId,
      building: record.building,
      floor: record.floor,
      roomNumber: record.roomNumber,
      detailName: record.detailName,
      purpose: record.purpose,
      remark: record.remark,
      guardId: record.guardId,
    });
  };

  // 删除点位
  const handleDelete = async (pointId: number) => {
    try {
      const pointIds = pointId.toString();
      await patrolPointApi.deletePatrolPoints(pointIds);
      message.success('删除成功');
      fetchPoints();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 提交表单
  const handleSubmit = async (values: PatrolPointForm) => {
    try {
      if (editingPoint) {
        await patrolPointApi.updatePatrolPoint(editingPoint.pointId!, values);
        message.success('更新成功');
      } else {
        console.log("add", values);
        await patrolPointApi.createPatrolPoint(values);
        message.success('新增成功');
      }
      setModalVisible(false);
      fetchPoints();
    } catch (error) {
      message.error(editingPoint ? '更新失败' : '新增失败');
    }
  };

  // 预览二维码
  const handlePreviewQR = async (record: PatrolPoint) => {
    try {
      setSelectedPoint(record);

      // 生成H5页面链接（这里使用模拟链接）
      const h5Url = `${window.location.origin}/h5/point/${record.id}`;
      const labelImage = await generateLabelImage(h5Url);
      setQrCodeUrl(labelImage);
      setQrModalVisible(true);
    } catch (error) {
      message.error('生成标签图片失败');
    }
  };

  // 下载标签图片
  const handleDownloadQR = () => {
    if (qrCodeUrl && selectedPoint) {
      const pointName = selectedPoint.pointName || selectedPoint.name || '点位';
      const filename = `${pointName}_安全员信息码`;
      downloadLabelImage(qrCodeUrl, filename);
      message.success('标签图片下载成功');
    }
  };

  // 批量下载标签图片
  const handleBatchDownloadQR = async () => {
    if (points.length === 0) {
      message.warning('暂无点位数据');
      return;
    }

    setLoading(true);
    try {
      for (const point of points) {
        const h5Url = `${window.location.origin}/h5/point/${point.id}`;
        const labelImage = await generateLabelImage(h5Url);
        const name = point.pointName || point.name || '点位';
        downloadLabelImage(labelImage, `${name}_安全员信息码`);
        // 添加小延迟避免浏览器阻止多个下载
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      message.success(`成功下载 ${points.length} 个标签图片`);
    } catch (error) {
      message.error('批量下载标签图片失败');
    } finally {
      setLoading(false);
    }
  };

  // 导出数据
  const handleExport = () => {
    const exportData = points.map(point => {
      // const officer = options.safetyOfficers.find(o => o.value === (point.guardId || point.safetyOfficerId));
      return {
        点位编码: point.pointId || point.code || point.id,
        // 点位名称: point.pointName || point.name || '',
        学院: point.college || '',
        楼栋: point.building || '',
        楼层: point.floor || '',
        所属区域: point.regionName || '',
        房间号: point.roomNumber || '',
        详细名称: point.location || '',
        用途: point.purpose || '',
        // 负责安全员: officer ? officer.label : (point.safetyOfficerName || ''),
        描述: point.description || '',
        创建时间: point.createTime || ''
      };
    });

    exportToExcel(exportData, '点位信息', [
      '点位编码', '学院', '楼栋', '楼层', '所属区域', '房间号', '详细名称', '用途', '负责安全员', '描述', '创建时间'
    ]);
    message.success('导出成功');
  };

  // 批量导入
  const handleImport = async (file: File) => {
    try {
      const data = await readExcelFile(file);

      console.log('导入的数据:', data);
      message.success(`成功导入 ${data.length} 条记录`);
      fetchPoints();
    } catch (error) {
      message.error('导入失败，请检查文件格式');
    }
    return false;
  };

  // const columns = [
  //   {
  //     title: '序号',
  //     dataIndex: 'index',
  //     key: 'index',
  //     width: 80,
  //     render: (_: any, __: any, index: number) => index + 1,
  //   },
  //   {
  //     title: '点位编码',
  //     dataIndex: 'pointCode',
  //     key: 'pointCode',
  //     width: 120,
  //     render: (text: string, record: PatrolPoint) => {
  //       return record.pointCode;
  //     },
  //   },
  //   // {
  //   //   title: '点位名称',
  //   //   dataIndex: 'pointName',
  //   //   key: 'pointName',
  //   //   width: 150,
  //   // },
  //   {
  //     title: '所属部门',
  //     dataIndex: 'deptName',
  //     key: 'deptName',
  //     width: 150,
  //   },
  //   {
  //     title: '楼层',
  //     dataIndex: 'floor',
  //     key: 'floor',
  //     width: 80,
  //   },
  //   {
  //     title: '房间号',
  //     dataIndex: 'roomNumber',
  //     key: 'roomNumber',
  //     width: 100,
  //   },
  //   {
  //     title: '详细名称',
  //     dataIndex: 'detailName',
  //     key: 'detailName',
  //     width: 200,
  //   },
  //   {
  //     title: '用途',
  //     dataIndex: 'purpose',
  //     key: 'purpose',
  //     width: 120,
  //   },
  //   {
  //     title: '创建时间',
  //     dataIndex: 'createTime',
  //     key: 'createTime',
  //     width: 150,
  //     render: (text: string | Date) => {
  //       if (!text) return '-';
  //       if (text instanceof Date) {
  //         return text.toLocaleString();
  //       }
  //       return text;
  //     },
  //   },
  //   {
  //     title: '操作',
  //     key: 'action',
  //     width: 280,
  //     fixed: 'right' as const,
  //     render: (_: any, record: PatrolPoint) => (
  //       <Space size={4}>
  //         <Button
  //           type="link"
  //           icon={<EditOutlined />}
  //           onClick={() => handleEdit(record)}
  //         >
  //           编辑
  //         </Button>
  //         <Button
  //           type="link"
  //           icon={<EyeOutlined />}
  //           onClick={() => handlePreviewQR(record)}
  //         >
  //           预览标签
  //         </Button>
  //         <Popconfirm
  //           title="确定要删除这个点位吗？"
  //           onConfirm={() => handleDelete(record.pointId)}
  //           okText="确定"
  //           cancelText="取消"
  //         >
  //           <Button type="link" danger icon={<DeleteOutlined />}>
  //             删除
  //           </Button>
  //         </Popconfirm>
  //       </Space>
  //     ),
  //   },
  // ];

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 80,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '点位编码',
      dataIndex: 'pointCode',
      key: 'pointCode',
      width: 120,
      render: (text: string, record: PatrolPoint) => {
        return record.pointCode;
      },
    },
    {
      title: '所属部门',
      dataIndex: 'deptName',
      key: 'deptName',
      width: 150,
    },
    {
      title: '楼栋', // 新增楼栋列
      dataIndex: 'building',
      key: 'building',
      width: 120,
    },
    {
      title: '楼层',
      dataIndex: 'floor',
      key: 'floor',
      width: 80,
    },
    {
      title: '房间号',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
      width: 100,
    },
    {
      title: '详细名称',
      dataIndex: 'detailName',
      key: 'detailName',
      width: 200,
    },
    {
      title: '用途',
      dataIndex: 'purpose',
      key: 'purpose',
      width: 120,
    },
    {
      title: '安全员', // 新增安全员列
      dataIndex: 'guardId',
      key: 'guardId',
      width: 120,
      render: (guardId: number) => {
        console.log("guardMap", guardMap);
        console.log("loaded", guardMapLoaded);
        return guardMap.get(guardId) || '暂无' // 使用 guardMap 显示安全员名称
      },
    },
    {
      title: '备注', // 新增备注列
      dataIndex: 'remark',
      key: 'remark',
      width: 150,
      render: (text: string) => text || '暂无', // 如果没有备注则显示“暂无”
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
      render: (text: string | Date) => {
        if (!text) return '-';
        if (text instanceof Date) {
          return text.toLocaleString();
        }
        return text;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right' as const,
      render: (_: any, record: PatrolPoint) => (
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
            icon={<EyeOutlined />}
            onClick={() => handlePreviewQR(record)}
          >
            预览标签
          </Button>
          <Popconfirm
            title="确定要删除这个点位吗？"
            onConfirm={() => handleDelete(record.pointId!)}
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
      <Card title="点位管理" style={{ marginBottom: 20 }}>
        {/* 搜索表单 */}
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: 20 }}
        >
          {/* <Form.Item name="pointName" label="点位名称">
            <Input placeholder="请输入点位名称" allowClear />
          </Form.Item> */}
          <Form.Item name="pointCode" label="点位编码">
            <Input placeholder="请输入点位编码" allowClear />
          </Form.Item>
          <Form.Item name="deptId" label="所属部门">
            <Select
              placeholder="请选择部门"
              allowClear
              style={{ width: 180 }}
              // options={departments}
              options={departments.map(dept => ({
                label: dept.deptName,
                value: dept.deptId,
              }))}
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
            <Space size="small">
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                新增点位
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
            <Space size="small">
              <Button icon={<DownloadOutlined />} onClick={handleBatchDownloadQR}>
                批量下载标签
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>
                导出数据
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 表格 */}
        {/* {guardMapLoaded ? ( */}
        <Table
          columns={columns}
          dataSource={points}
          rowKey="pointId"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            onChange: (page, pageSize) => {
              setPagination(prev => ({ ...prev, current: page, pageSize: pageSize || 10 }));
              fetchPoints();
            },
          }}
          scroll={{ x: 1400 }}
        />
        {/* ) : (
          <Spin tip="加载中..." />
        )} */}
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingPoint ? '编辑点位' : '新增点位'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="pointCode"
                label="点位编码"
                rules={[{ required: true, message: '请输入点位编码' }]}
              >
                <Input placeholder="请输入点位编码" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="deptId"
                label="所属部门"
                rules={[{ required: true, message: '请选择所属部门' }]}
              >
                <Select
                  placeholder="请选择部门"
                  allowClear
                  // showSearch
                  // options={departments}
                  options={departments.map(dept => ({
                    label: dept.deptName,
                    value: dept.deptId,
                  }))}
                />
              </Form.Item>
              {/* <Form.Item name="deptId" label="所属部门">
                <Select
                  placeholder="请选择部门"
                  allowClear
                  style={{ width: 180 }}
                  // options={departments}
                  options={departments.map(dept => ({
                    label: dept.deptName,
                    value: dept.deptId,
                  }))}
                />
              </Form.Item> */}
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="building"
                label="楼栋"
              >
                <Input placeholder="请输入楼栋（可选）" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="floor"
                label="楼层"
              >
                <Input placeholder="请输入楼层（可选）" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="roomNumber"
                label="房间号"
              >
                <Input placeholder="请输入房间号（可选）" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="detailName"
                label="详细名称"
              >
                <Input placeholder="请输入详细名称（可选）" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="purpose"
                label="用途"
              >
                <Input placeholder="请输入用途（可选）" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="guardId"
                label="安全员"
                rules={[{ required: true, message: '请选择安全员' }]}
              >
                <Select
                  placeholder="请选择安全员"
                  allowClear
                  options={securityGuards.map(guard => ({
                    label: guard.name,
                    value: guard.guardId,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="remark"
                label="备注"
              >
                <Input placeholder="请输入备注（可选）" />
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space size="small">
              <Button onClick={() => setModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                {editingPoint ? '更新' : '新增'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
        {/* <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="点位名称"
                rules={[{ required: true, message: '请输入点位名称' }]}
              >
                <Input placeholder="请输入点位名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="点位编码"
                rules={editingPoint ? [] : []}
              >
                <Input
                  placeholder={editingPoint ? "点位编码（后端自动生成）" : "点位编码（后端自动生成）"}
                  disabled={!editingPoint}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="regionId"
                label="所属学院/部门"
                rules={[{ required: true, message: '请选择所属学院/部门' }]}
              >
                <Select
                  placeholder="请选择学院/部门"
                  options={options.regions}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="safetyOfficerId"
                label="负责安全员"
                rules={[{ required: true, message: '请选择负责安全员' }]}
              >
                <Select
                  placeholder="请选择安全员"
                  options={options.safetyOfficers}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="floor"
                label="楼层"
                rules={[{ required: true, message: '请输入楼层' }]}
              >
                <Input placeholder="请输入楼层（如：3楼）" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="roomNumber"
                label="房间号"
                rules={[{ required: true, message: '请输入房间号' }]}
              >
                <Input placeholder="请输入房间号" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="location"
                label="详细名称"
                rules={[{ required: true, message: '请输入详细名称' }]}
              >
                <Input placeholder="请输入详细位置名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="purpose"
                label="用途"
              >
                <Input placeholder="请输入点位用途（可选）" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="描述">
            <Input.TextArea
              placeholder="请输入描述（可选）"
              rows={3}
            />
          </Form.Item>
          <Divider />
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space size="small">
              <Button onClick={() => setModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                {editingPoint ? '更新' : '新增'}
              </Button>
            </Space>
          </Form.Item>
        </Form> */}
      </Modal>

      {/* 标签预览弹窗 */}
      <Modal
        title="安全员信息码标签预览"
        open={qrModalVisible}
        onCancel={() => setQrModalVisible(false)}
        footer={[
          <Button key="download" type="primary" onClick={handleDownloadQR}>
            下载标签
          </Button>,
          <Button key="close" onClick={() => setQrModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={500}
      >
        {selectedPoint && (
          <div className="qr-code-preview" style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#1890ff' }}>
                {selectedPoint.pointName || selectedPoint.name}
              </h4>
              <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                {selectedPoint.college || selectedPoint.regionName} - {selectedPoint.building} - {selectedPoint.floor}楼
              </p>
            </div>

            {qrCodeUrl && (
              <div style={{ margin: '20px 0' }}>
                <Image
                  src={qrCodeUrl}
                  alt="安全员信息码标签"
                  style={{
                    maxWidth: '300px',
                    border: '1px solid #e8e8e8',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </div>
            )}

            {/* <Divider />
            
            <div style={{ 
              background: '#f0f8ff', 
              padding: '16px', 
              borderRadius: '8px', 
              margin: '16px 0',
              border: '1px solid #d6e4ff'
            }}>
              <h5 style={{ 
                margin: '0 0 12px 0', 
                color: '#1890ff',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                📄 3寸标签打印说明
              </h5>
              <div style={{ textAlign: 'left', fontSize: '14px', color: '#333' }}>
                <p style={{ margin: '4px 0' }}>• 标签尺寸：3寸 (76mm × 102mm)</p>
                <p style={{ margin: '4px 0' }}>• 图片分辨率：300 × 400 像素</p>
                <p style={{ margin: '4px 0' }}>• 适用于热敏打印机和喷墨打印机</p>
                <p style={{ margin: '4px 0' }}>• 建议使用不干胶标签纸打印</p>
              </div>
            </div> */}

            <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '6px', marginTop: '16px' }}>
              <h5 style={{ margin: '0 0 8px 0', color: '#1890ff' }}>🔗 H5页面预览</h5>
              <p style={{
                fontSize: '14px',
                color: '#333',
                wordBreak: 'break-all',
                background: '#fff',
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                margin: '8px 0'
              }}>
                <a
                  href={`${window.location.origin}/h5/point/${selectedPoint.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#1890ff', textDecoration: 'none' }}
                >
                  {`${window.location.origin}/h5/point/${selectedPoint.id}`}
                </a>
              </p>
              <p style={{ fontSize: '12px', color: '#666', margin: '8px 0 0 0' }}>
                💡 点击上方链接可预览扫码后的H5页面效果，或扫描标签上的二维码查看点位详细信息
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PointManagement; 