import { useState } from 'react';
import { exportToCSV, exportToExcel, exportToPDF } from '@/lib/utils/export';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileSpreadsheet, FileText, FileDown } from 'lucide-react';

interface ExportButtonProps {
  data: any[];
  filename: string;
  columns?: { header: string; dataKey: string }[];
}

export default function ExportButton({ data, filename, columns }: ExportButtonProps) {
  const [open, setOpen] = useState(false);

  const handleExportCSV = () => {
    exportToCSV(data, filename);
    setOpen(false);
  };

  const handleExportExcel = () => {
    exportToExcel(data, filename);
    setOpen(false);
  };

  const handleExportPDF = () => {
    if (columns) {
      exportToPDF(data, filename, filename, columns);
    }
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={handleExportCSV} className="cursor-pointer">
          <FileText className="mr-2 h-4 w-4 text-slate-500" />
          <span>Export as CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportExcel} className="cursor-pointer">
          <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
          <span>Export as Excel</span>
        </DropdownMenuItem>
        {columns && (
          <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer">
            <FileDown className="mr-2 h-4 w-4 text-red-500" />
            <span>Export as PDF</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
