/**
 * Document utility functions for handling Cloudinary-hosted files
 */

export type DocumentType = 'image' | 'pdf' | 'unknown';

/**
 * Detect the document type from a URL based on file extension
 */
export function getDocumentType(url: string | null | undefined): DocumentType {
  if (!url) return 'unknown';

  const lowerUrl = url.toLowerCase();

  // Check for image extensions
  if (/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(lowerUrl)) {
    return 'image';
  }

  // Check for PDF extension
  if (/\.pdf(\?.*)?$/i.test(lowerUrl)) {
    return 'pdf';
  }

  // Cloudinary URLs may have format in the path like /image/upload/ or /raw/upload/
  if (lowerUrl.includes('/image/upload/')) {
    return 'image';
  }

  if (lowerUrl.includes('/raw/upload/') && lowerUrl.includes('.pdf')) {
    return 'pdf';
  }

  return 'unknown';
}

/**
 * Get file extension from URL
 */
export function getFileExtension(url: string | null | undefined): string {
  if (!url) return '';

  // Remove query string and get extension
  const cleanUrl = url.split('?')[0];
  const match = cleanUrl.match(/\.([a-zA-Z0-9]+)$/);
  return match ? match[1].toLowerCase() : '';
}

/**
 * Generate optimized Cloudinary image URL with transformations
 * @param url - Original Cloudinary URL
 * @param width - Desired width (optional)
 * @param quality - Quality setting (optional, defaults to 'auto')
 */
export function getOptimizedImageUrl(
  url: string | null | undefined,
  width?: number,
  quality: string = 'auto'
): string {
  if (!url) return '';

  // Only apply transformations to Cloudinary URLs
  if (!url.includes('cloudinary.com')) {
    return url;
  }

  // Build transformation string
  const transforms: string[] = [];
  if (width) transforms.push(`w_${width}`);
  transforms.push(`q_${quality}`);
  transforms.push('f_auto');

  const transformString = transforms.join(',');

  // Insert transformation after /upload/
  return url.replace('/upload/', `/upload/${transformString}/`);
}

/**
 * Check if URL is a valid Cloudinary URL
 */
export function isCloudinaryUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes('res.cloudinary.com');
}

/**
 * Get a download-friendly filename from URL
 */
export function getFilenameFromUrl(url: string | null | undefined): string {
  if (!url) return 'document';

  const cleanUrl = url.split('?')[0];
  const parts = cleanUrl.split('/');
  const filename = parts[parts.length - 1];

  return filename || 'document';
}
