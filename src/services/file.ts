import { httpClient } from './httpClient';
import { FileDownloadParams } from '../types/file';

// 文件管理API - 根据API文档
export const fileApi = {
  // 文件下载 - GET /common/download
  downloadFile: async (fileName: string, deleteAfterDownload: boolean = false): Promise<Blob> => {
    return await httpClient.downloadFile(fileName, deleteAfterDownload);
  },
};