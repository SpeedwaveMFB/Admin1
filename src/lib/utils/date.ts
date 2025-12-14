import { format, formatDistance, formatRelative, parseISO, isValid } from 'date-fns';

function parseDate(date: string | Date | null | undefined): Date | null {
  if (!date) return null;
  
  let dateObj: Date;
  if (typeof date === 'string') {
    dateObj = parseISO(date);
  } else {
    dateObj = date;
  }
  
  return isValid(dateObj) ? dateObj : null;
}

export function formatDate(date: string | Date | null | undefined, formatStr: string = 'MMM dd, yyyy'): string {
  const dateObj = parseDate(date);
  if (!dateObj) return 'N/A';
  return format(dateObj, formatStr);
}

export function formatDateTime(date: string | Date | null | undefined): string {
  const dateObj = parseDate(date);
  if (!dateObj) return 'N/A';
  return format(dateObj, 'MMM dd, yyyy hh:mm a');
}

export function formatTimeAgo(date: string | Date | null | undefined): string {
  const dateObj = parseDate(date);
  if (!dateObj) return 'N/A';
  return formatDistance(dateObj, new Date(), { addSuffix: true });
}

export function formatRelativeTime(date: string | Date | null | undefined): string {
  const dateObj = parseDate(date);
  if (!dateObj) return 'N/A';
  return formatRelative(dateObj, new Date());
}

