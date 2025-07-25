import React, { useState } from 'react';
import { Button, Card, message, Input, Space, Typography } from 'antd';
import { authApi } from '../services';

const { Title, Text } = Typography;

const ApiTester: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');

  const testLogin = async () => {
    setLoading(true);
    try {
      console.log('测试登录接口...');
      const response = await authApi.login({
        username,
        password,
        rememberMe: false
      });
      console.log('登录成功:', response);
      message.success('登录测试成功');
    } catch (error: any) {
      console.error('登录失败:', error);
      message.error(`登录测试失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="API 接口测试" style={{ margin: '20px' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={4}>登录接口测试</Title>
        <Space>
          <Text>用户名:</Text>
          <Input 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            placeholder="用户名"
            style={{ width: 120 }}
          />
        </Space>
        <Space>
          <Text>密码:</Text>
          <Input.Password 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密码"
            style={{ width: 120 }}
          />
        </Space>
        <Button 
          type="primary" 
          onClick={testLogin} 
          loading={loading}
        >
          测试登录接口
        </Button>
      </Space>
    </Card>
  );
};

export default ApiTester;