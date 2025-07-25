// 文件下载参数
export interface FileDownloadParams {
  fileName: string;
  delete: boolean;
}

// 文件上传响应
export interface FileUploadResponse {
  fileName: string;
  originalName: string;
  url: string;
  size: number;
}