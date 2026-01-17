'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Alert,
  Paper,
} from '@mui/material';
import { Download, Image as ImageIcon, PictureAsPdf, BrokenImage } from '@mui/icons-material';
import { getDocumentType, getFilenameFromUrl, getOptimizedImageUrl } from '@/lib/utils/document';

interface DocumentViewerProps {
  documentUrl: string | null | undefined;
  maxWidth?: number;
  pdfHeight?: number;
}

export default function DocumentViewer({
  documentUrl,
  maxWidth = 600,
  pdfHeight = 500,
}: DocumentViewerProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(true);

  const documentType = getDocumentType(documentUrl);
  const filename = getFilenameFromUrl(documentUrl);

  const handleDownload = () => {
    if (!documentUrl) return;
    window.open(documentUrl, '_blank');
  };

  if (!documentUrl) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No document uploaded yet.
      </Alert>
    );
  }

  if (documentType === 'unknown') {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Unable to preview this document type. Click below to download.
        </Alert>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleDownload}
          sx={{
            borderRadius: 999,
            px: 3,
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Download Document
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {/* Document Type Indicator */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        {documentType === 'image' ? (
          <ImageIcon fontSize="small" color="primary" />
        ) : (
          <PictureAsPdf fontSize="small" color="error" />
        )}
        <Typography variant="body2" color="text.secondary">
          {documentType === 'image' ? 'Image Document' : 'PDF Document'} - {filename}
        </Typography>
      </Box>

      {/* Document Preview */}
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          backgroundColor: 'background.default',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {documentType === 'image' && (
          <Box sx={{ position: 'relative' }}>
            {imageLoading && !imageError && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 200,
                }}
              >
                <CircularProgress size={32} />
              </Box>
            )}
            {imageError ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 200,
                  color: 'text.secondary',
                }}
              >
                <BrokenImage sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="body2">Failed to load image</Typography>
              </Box>
            ) : (
              <Box
                component="img"
                src={getOptimizedImageUrl(documentUrl, maxWidth)}
                alt="KYC Document"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false);
                  setImageError(true);
                }}
                sx={{
                  maxWidth: '100%',
                  height: 'auto',
                  display: imageLoading ? 'none' : 'block',
                  borderRadius: 1,
                }}
              />
            )}
          </Box>
        )}

        {documentType === 'pdf' && (
          <Box sx={{ position: 'relative' }}>
            {pdfLoading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'background.paper',
                  zIndex: 1,
                }}
              >
                <CircularProgress size={32} />
              </Box>
            )}
            <Box
              component="iframe"
              src={documentUrl}
              title="KYC Document PDF"
              onLoad={() => setPdfLoading(false)}
              sx={{
                width: '100%',
                height: pdfHeight,
                border: 'none',
                borderRadius: 1,
              }}
            />
          </Box>
        )}
      </Paper>

      {/* Download Button */}
      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleDownload}
          sx={{
            borderRadius: 999,
            px: 3,
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Download Original
        </Button>
      </Box>
    </Box>
  );
}
