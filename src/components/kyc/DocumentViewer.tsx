'use client';

import { useState } from 'react';
import { Download, ImageIcon, FileText, ImageOff, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
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
      <Alert className="mt-2 bg-slate-50 border-slate-200 text-slate-600">
        <AlertDescription>No document uploaded yet.</AlertDescription>
      </Alert>
    );
  }

  if (documentType === 'unknown') {
    return (
      <div className="mt-2">
        <Alert className="mb-2 bg-amber-50 border-amber-200 text-amber-800">
          <AlertDescription>Unable to preview this document type. Click below to download.</AlertDescription>
        </Alert>
        <Button
          variant="outline"
          onClick={handleDownload}
          className="rounded-full px-6"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Document
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* Document Type Indicator */}
      <div className="flex items-center gap-2 mb-3">
        {documentType === 'image' ? (
          <ImageIcon className="h-4 w-4 text-purple-600" />
        ) : (
          <FileText className="h-4 w-4 text-red-600" />
        )}
        <p className="text-sm text-slate-500">
          {documentType === 'image' ? 'Image Document' : 'PDF Document'} - {filename}
        </p>
      </div>

      {/* Document Preview */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {documentType === 'image' && (
          <div className="relative flex justify-center bg-slate-50 min-h-[200px] rounded-lg border border-slate-100 p-2">
            {imageLoading && !imageError && (
              <div className="absolute inset-0 flex justify-center items-center bg-transparent">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            )}
            {imageError ? (
              <div className="flex flex-col items-center justify-center min-h-[200px] text-slate-400">
                <ImageOff className="h-12 w-12 mb-2" />
                <p className="text-sm">Failed to load image</p>
              </div>
            ) : (
              <img
                src={getOptimizedImageUrl(documentUrl, maxWidth)}
                alt="KYC Document"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false);
                  setImageError(true);
                }}
                className={`max-w-full h-auto rounded-md object-contain ${imageLoading ? 'hidden' : 'block'}`}
              />
            )}
          </div>
        )}

        {documentType === 'pdf' && (
          <div className="relative rounded-lg border border-slate-100 overflow-hidden bg-slate-50">
            {pdfLoading && (
              <div className="absolute inset-0 flex justify-center items-center bg-white z-10">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            )}
            <iframe
              src={documentUrl}
              title="KYC Document PDF"
              onLoad={() => setPdfLoading(false)}
              className="w-full border-none rounded-md"
              style={{ height: pdfHeight }}
            />
          </div>
        )}
      </div>

      {/* Download Button */}
      <div className="mt-4">
        <Button
          variant="outline"
          onClick={handleDownload}
          className="rounded-full px-6 bg-white hover:bg-slate-50"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Original
        </Button>
      </div>
    </div>
  );
}
