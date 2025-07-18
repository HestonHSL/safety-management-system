import * as XLSX from 'xlsx';

// 导出Excel
export const exportToExcel = (data: any[], filename: string, headers?: string[]) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  if (headers) {
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });
  }
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

// 读取Excel文件
export const readExcelFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}; 