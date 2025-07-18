import React, { useState } from 'react';
import { Card, Button, Select, Input, Space, Alert, Typography, Row, Col, message } from 'antd';
import { PlayCircleOutlined, BugOutlined } from '@ant-design/icons';
import { httpClient } from '../services/httpClient';
import { API_CONFIG } from '../services/index';

const { Text } = Typography;
const { TextArea } = Input;

interface ApiTest {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  description: string;
  requestBody?: any;
}

const ApiDebugger: React.FC = () => {
  const [selectedApi, setSelectedApi] = useState<string>('');
  const [requestBody, setRequestBody] = useState<string>('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // 预定义的API测试用例
  const apiTests: ApiTest[] = [
    {
      name: '用户登录',
      method: 'POST',
      url: '/user/login',
      description: '测试用户登录接口',
      requestBody: {
        username: 'admin',
        password: '123456'
      }
    },
    {
      name: '获取区域列表',
      method: 'GET',
      url: '/area/list',
      description: '获取所有区域列表'
    },
    {
      name: '新增区域',
      method: 'POST',
      url: '/area/',
      description: '新增区域信息',
      requestBody: {
        areaName: '测试区域',
        parentId: '',
        orderNum: 1,
        description: '这是一个测试区域'
      }
    },
    {
      name: '获取安全员列表',
      method: 'GET',
      url: '/guard/list',
      description: '获取安全员列表（需要pageNum和pageSize参数）'
    },
    {
      name: '查询安全员信息',
      method: 'GET',
      url: '/guard/1',
      description: '根据guardId查询安全员信息'
    },
    {
      name: '新增安全员',
      method: 'POST',
      url: '/guard/',
      description: '新增安全员信息',
      requestBody: {
        name: '测试安全员',
        phoneNumber: '13800000000',
        dept: '安全保卫中心',
        officePhone: '0755-12345678',
        wechatId: 'test_wechat'
      }
    },
    {
      name: '修改安全员信息',
      method: 'PUT',
      url: '/guard/',
      description: '修改安全员信息',
      requestBody: {
        guardId: 1,
        name: '更新后的安全员',
        phoneNumber: '13800000001',
        dept: '更新后的部门',
        officePhone: '0755-12345679',
        wechatId: 'updated_wechat'
      }
    },
    {
      name: '删除安全员',
      method: 'DELETE',
      url: '/guard/1',
      description: '删除安全员信息'
    },
    {
      name: '导出安全员列表',
      method: 'POST',
      url: '/guard/export',
      description: '导出安全员信息列表',
      requestBody: {
        name: '张三',
        phoneNumber: '138'
      }
    },
    {
      name: '获取点位列表',
      method: 'GET',
      url: '/point/list?pageNum=1&pageSize=10',
      description: '获取点位列表（需要pageNum和pageSize参数）'
    },
    {
      name: '查询点位信息',
      method: 'GET',
      url: '/point/1',
      description: '根据pointId查询点位信息'
    },
    {
      name: '新增点位',
      method: 'POST',
      url: '/point/',
      description: '新增点位信息',
      requestBody: {
        pointName: '测试点位',
        college: '创意设计学院',
        building: 'A栋',
        floor: '1楼',
        areaId: '1'
      }
    },
    {
      name: '修改点位',
      method: 'PUT',
      url: '/point/',
      description: '修改点位信息',
      requestBody: {
        pointId: '1',
        pointName: '更新后的点位',
        college: '计算机科学学院',
        building: 'B栋',
        floor: '2楼',
        areaId: 2,
        guardId: 1
      }
    },
    {
      name: '删除点位',
      method: 'DELETE',
      url: '/point/1',
      description: '删除点位信息'
    },
    {
      name: '导出点位列表',
      method: 'POST',
      url: '/point/export',
      description: '导出点位信息列表',
      requestBody: {
        pointName: '测试',
        college: '创意设计学院',
        building: 'A栋',
        floor: '1楼',
        areaId: 1,
        guardId: 1
      }
    },
    {
      name: '绑定安全员到点位',
      method: 'POST',
      url: '/point/bind/1/1',
      description: '绑定安全员ID为1到点位ID为1'
    },
    {
      name: '解绑点位的安全员',
      method: 'POST',
      url: '/point/unbind/1',
      description: '解绑点位ID为1的安全员'
    },
    {
      name: '用户登录（新）',
      method: 'POST',
      url: '/login?username=admin&password=123456&rememberMe=true',
      description: '用户登录接口（使用query参数）'
    },
    {
      name: '文件下载',
      method: 'GET',
      url: '/common/download?fileName=test.xlsx&delete=false',
      description: '通用文件下载接口'
    }
  ];

  const handleApiSelect = (value: string) => {
    setSelectedApi(value);
    const selectedTest = apiTests.find(test => test.name === value);
    if (selectedTest && selectedTest.requestBody) {
      setRequestBody(JSON.stringify(selectedTest.requestBody, null, 2));
    } else {
      setRequestBody('');
    }
    setResponse(null);
    setError('');
  };

  const handleTest = async () => {
    if (!selectedApi) {
      message.warning('请选择要测试的API');
      return;
    }

    const selectedTest = apiTests.find(test => test.name === selectedApi);
    if (!selectedTest) return;

    setLoading(true);
    setError('');
    setResponse(null);

    try {
      let result;
      const body = requestBody ? JSON.parse(requestBody) : undefined;

      switch (selectedTest.method) {
        case 'GET':
          result = await httpClient.get(selectedTest.url, body);
          break;
        case 'POST':
          result = await httpClient.post(selectedTest.url, body);
          break;
        case 'PUT':
          result = await httpClient.put(selectedTest.url, body);
          break;
        case 'DELETE':
          result = await httpClient.delete(selectedTest.url);
          break;
        default:
          throw new Error('不支持的请求方法');
      }

      setResponse(result);
      message.success('接口调用成功');
    } catch (err: any) {
      setError(err.message || '接口调用失败');
      message.error('接口调用失败');
    } finally {
      setLoading(false);
    }
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(requestBody);
      setRequestBody(JSON.stringify(parsed, null, 2));
    } catch (err) {
      message.error('JSON格式错误');
    }
  };

  return (
    <Card 
      title={
        <Space>
          <BugOutlined />
          API接口调试工具
        </Space>
      }
      extra={
        <Space>
          <Text type="secondary">
            当前环境: {API_CONFIG.ENV}
          </Text>
          <Text type="secondary">
            API地址: {API_CONFIG.BASE_URL}
          </Text>
          <Text type="secondary">
            使用真实API: {API_CONFIG.USE_REAL_API ? '是' : '否'}
          </Text>
        </Space>
      }
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 配置信息 */}
        <Alert
          message="接口调试说明"
          description={
            <div>
              <p>1. 确保后端服务已启动并运行在配置的地址上</p>
              <p>2. 检查网络连接和跨域配置</p>
              <p>3. 查看浏览器控制台获取详细错误信息</p>
              <p>4. 如需切换到真实API，请设置环境变量 REACT_APP_USE_REAL_API=true</p>
            </div>
          }
          type="info"
          showIcon
        />

        {/* API选择 */}
        <Row gutter={16}>
          <Col span={12}>
            <Space>
              <Text strong>选择API:</Text>
              <Select
                style={{ width: 300 }}
                placeholder="请选择要测试的API"
                value={selectedApi}
                onChange={handleApiSelect}
                options={apiTests.map(test => ({
                  value: test.name,
                  label: `${test.method} ${test.name}`,
                }))}
              />
              <Button 
                type="primary" 
                icon={<PlayCircleOutlined />} 
                onClick={handleTest}
                loading={loading}
                disabled={!selectedApi}
              >
                测试接口
              </Button>
            </Space>
          </Col>
        </Row>

        {/* API详情 */}
        {selectedApi && (
          <Card size="small" title="接口详情">
            {(() => {
              const test = apiTests.find(t => t.name === selectedApi);
              return test ? (
                <div>
                  <p><Text strong>方法:</Text> <Text code>{test.method}</Text></p>
                  <p><Text strong>地址:</Text> <Text code>{API_CONFIG.BASE_URL}{test.url}</Text></p>
                  <p><Text strong>描述:</Text> {test.description}</p>
                </div>
              ) : null;
            })()}
          </Card>
        )}

        {/* 请求体编辑 */}
        {selectedApi && (
          <Card size="small" title="请求参数" extra={
            <Button size="small" onClick={handleFormatJson}>
              格式化JSON
            </Button>
          }>
            <TextArea
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              placeholder="请输入请求参数（JSON格式）"
              rows={8}
              style={{ fontFamily: 'monospace' }}
            />
          </Card>
        )}

        {/* 响应结果 */}
        {(response || error) && (
          <Card size="small" title="响应结果">
            {error ? (
              <Alert message="错误信息" description={error} type="error" showIcon />
            ) : (
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '16px', 
                borderRadius: '4px',
                overflow: 'auto',
                maxHeight: '400px'
              }}>
                {JSON.stringify(response, null, 2)}
              </pre>
            )}
          </Card>
        )}

        {/* 常见问题 */}
        <Card size="small" title="常见问题排查">
          <Space direction="vertical">
            <Text strong>1. 连接超时或无法连接</Text>
            <Text>• 检查后端服务是否启动</Text>
            <Text>• 检查API地址是否正确</Text>
            <Text>• 检查网络连接</Text>
            
            <Text strong>2. CORS跨域错误</Text>
            <Text>• 确保后端配置了正确的CORS设置</Text>
            <Text>• 检查请求头配置</Text>
            
            <Text strong>3. 401未授权错误</Text>
            <Text>• 检查是否需要登录</Text>
            <Text>• 检查token是否有效</Text>
            
            <Text strong>4. 数据格式错误</Text>
            <Text>• 检查请求参数格式</Text>
            <Text>• 确认字段名称是否正确</Text>
          </Space>
        </Card>
      </Space>
    </Card>
  );
};

export default ApiDebugger; 