// HTTP客户端配置
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  total?: number;
  pageNum?: number;
  pageSize?: number;
  success?: boolean;
}

class HttpClient {
  private baseURL: string;
  
  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    console.log(`[HTTP] ${options.method || 'GET'} ${this.baseURL}${url}`, {
      config,
      body: options.body
    });

    try {
      const response = await fetch(`${this.baseURL}${url}`, config);

      if (!response.ok) {
        // 处理HTTP错误状态
        if (response.status === 401) {
          // 未授权，清除本地token并跳转登录
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('登录已过期，请重新登录');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `请求失败: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      console.log(`[HTTP] Response:`, result);

      // 检查业务状态码
      if (result.code && result.code !== 200 && result.code !== 0) {
        throw new Error(result.message || '请求失败');
      }

      return result;
    } catch (error) {
      console.error(`[HTTP] Error:`, error);
      throw error;
    }
  }

  get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<T>(`${url}${queryString}`, { method: 'GET' });
  }

  post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // 带query参数的POST请求（用于登录接口）
  postWithQuery<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<T>(`${url}${queryString}`, { method: 'POST' });
  }

  put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'DELETE' });
  }

  // 文件上传
  upload<T>(url: string, file: File, data?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (data) {
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
    }

    const token = localStorage.getItem('token');
    
    return this.request<T>(url, {
      method: 'POST',
      body: formData,
      headers: {
        // 不设置Content-Type，让浏览器自动设置multipart/form-data
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  }

  // 文件下载（POST方式，用于导出功能）
  async download(url: string, data?: any): Promise<Blob> {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`下载失败: ${response.status}`);
    }

    return response.blob();
  }

  // 通用文件下载（GET方式）
  async downloadFile(fileName: string, deleteAfterDownload: boolean = false): Promise<Blob> {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams({
      fileName,
      delete: deleteAfterDownload.toString()
    });
    
    const response = await fetch(`${this.baseURL}/common/download?${params}`, {
      method: 'GET',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`文件下载失败: ${response.status} ${response.statusText}`);
    }

    return response.blob();
  }
}

export const httpClient = new HttpClient(
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api'
); 