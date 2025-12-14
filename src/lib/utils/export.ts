import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

export function exportToCSV(data: any[], filename: string): void {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToExcel(data: any[], filename: string, sheetName: string = 'Sheet1'): void {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function exportToPDF(
  data: any[],
  filename: string,
  title: string,
  columns: { header: string; dataKey: string }[]
): void {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 25);
  
  // Add table (simple implementation)
  let yPos = 35;
  const lineHeight = 7;
  
  // Headers
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  columns.forEach((col, i) => {
    doc.text(col.header, 14 + (i * 40), yPos);
  });
  
  // Data rows
  doc.setFont('helvetica', 'normal');
  yPos += lineHeight;
  
  data.forEach((row) => {
    columns.forEach((col, i) => {
      const value = String(row[col.dataKey] || '');
      doc.text(value.substring(0, 20), 14 + (i * 40), yPos);
    });
    yPos += lineHeight;
    
    // Add new page if needed
    if (yPos > 280) {
      doc.addPage();
      yPos = 20;
    }
  });
  
  doc.save(`${filename}.pdf`);
}

