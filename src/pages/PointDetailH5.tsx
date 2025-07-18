import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, message, Spin } from 'antd';
import { 
  EnvironmentOutlined, 
  UserOutlined, 
  MobileOutlined,
  CopyOutlined
} from '@ant-design/icons';
import { Point, SafetyOfficer } from '../types';
import { pointApi, safetyOfficerApi } from '../services/api';
import './PointDetailH5.css';

const PointDetailH5: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [point, setPoint] = useState<Point | null>(null);
  const [officer, setOfficer] = useState<SafetyOfficer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const pointsResponse = await pointApi.getPoints();
        const currentPoint = pointsResponse.data.find(p => p.id === id);
        
        if (currentPoint) {
          setPoint(currentPoint);
          
          const officersResponse = await safetyOfficerApi.getSafetyOfficers();
          const currentOfficer = officersResponse.data.find(o => o.id === currentPoint.safetyOfficerId);
          setOfficer(currentOfficer || null);
        }
      } catch (error) {
        message.error('获取信息失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const copyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        message.success(`${label}已复制到剪贴板`);
      }).catch(() => {
        message.error('复制失败');
      });
    } else {
      // 兼容旧浏览器
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        message.success(`${label}已复制到剪贴板`);
      } catch (err) {
        message.error('复制失败');
      }
      document.body.removeChild(textArea);
    }
  };

  if (loading) {
    return (
      <div className="h5-loading">
        <Spin size="large" />
        <p>加载中...</p>
      </div>
    );
  }

  if (!point || !officer) {
    return (
      <div className="h5-error">
        <p>未找到相关信息</p>
      </div>
    );
  }

  return (
    <div className="point-detail-h5">
      <div className="h5-header">
        <h1>点位安全员信息</h1>
      </div>

      <div className="h5-content">
        {/* 点位信息部分 */}
        <div className="info-section">
          <div className="section-title">
            <EnvironmentOutlined className="section-icon" />
            <span>点位信息</span>
          </div>
          
          <div className="info-grid">
            <div className="info-item">
              <span className="label">点位编号</span>
              <span className="value">{point.code}</span>
            </div>
            <div className="info-item">
              <span className="label">所属学院/部门</span>
              <span className="value">{point.regionName}</span>
            </div>
            <div className="info-item">
              <span className="label">楼层</span>
              <span className="value">{point.floor}</span>
            </div>
            <div className="info-item">
              <span className="label">房间号</span>
              <span className="value">{point.roomNumber}</span>
            </div>
            <div className="info-item">
              <span className="label">详细名称</span>
              <span className="value">{point.location}</span>
            </div>
            <div className="info-item">
              <span className="label">用途</span>
              <span className="value">{point.purpose}</span>
            </div>
          </div>
        </div>

        {/* 安全员信息部分 */}
        <div className="info-section">
          <div className="section-title">
            <UserOutlined className="section-icon" />
            <span>安全员信息</span>
          </div>

          <div className="officer-info">
            <div className="officer-name">
              <UserOutlined className="name-icon" />
              <span>{officer.name}</span>
            </div>

            <div className="contact-list">
              {/* 手机号码 - 支持新旧字段 */}
              {(officer.phoneNumber || officer.mobile) && (
                <div className="contact-item">
                  <div className="contact-info">
                    <MobileOutlined className="contact-icon" />
                    <span>{officer.phoneNumber || officer.mobile}</span>
                  </div>
                  <Button 
                    type="text" 
                    icon={<CopyOutlined />}
                    onClick={() => {
                      const phone = officer.phoneNumber || officer.mobile;
                      phone && copyToClipboard(phone, '手机号码');
                    }}
                    className="copy-btn"
                  />
                </div>
              )}

              {/* 部门信息 - 支持新旧字段 */}
              <div className="contact-item">
                <div className="contact-info">
                  <span className="contact-icon">📧</span>
                  <span>部门：{officer.dept || officer.department}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointDetailH5; 