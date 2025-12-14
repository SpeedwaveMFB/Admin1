import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  FileDownload,
  TableChart,
  PictureAsPdf,
  Description,
} from '@mui/icons-material';
import { useState } from 'react';
import { exportToCSV, exportToExcel, exportToPDF } from '@/lib/utils/export';

interface ExportButtonProps {
  data: any[];
  filename: string;
  columns?: { header: string; dataKey: string }[];
}

export default function ExportButton({ data, filename, columns }: ExportButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExportCSV = () => {
    exportToCSV(data, filename);
    handleClose();
  };

  const handleExportExcel = () => {
    exportToExcel(data, filename);
    handleClose();
  };

  const handleExportPDF = () => {
    if (columns) {
      exportToPDF(data, filename, filename, columns);
    }
    handleClose();
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<FileDownload />}
        onClick={handleClick}
      >
        Export
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleExportCSV}>
          <ListItemIcon>
            <Description fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as CSV</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleExportExcel}>
          <ListItemIcon>
            <TableChart fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as Excel</ListItemText>
        </MenuItem>
        {columns && (
          <MenuItem onClick={handleExportPDF}>
            <ListItemIcon>
              <PictureAsPdf fontSize="small" />
            </ListItemIcon>
            <ListItemText>Export as PDF</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
}

