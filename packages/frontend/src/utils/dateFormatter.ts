/**
 * Format a date to YYYY-MM-DD format required by the backend
 */
export const formatDateToYYYYMMDD = (date: string | Date): string => {
  if (typeof date === 'string') {
    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date
    }
    // If it contains a T (ISO string) or any other format, convert to YYYY-MM-DD
    return new Date(date).toISOString().split('T')[0]
  }
  return date.toISOString().split('T')[0]
}
