// src/utils/dateUtils.js

/**
 * Formats a JavaScript Date or Firestore Timestamp into a Bengali date string.
 * @param {Date | {toDate: () => Date}} date - The date object.
 * @returns {string} The formatted Bengali date string.
 */
export function formatDateBangla(date) {
  if (!date) return '';
  
  // Handle Firestore Timestamp or standard JS Date
  const d = date.toDate ? date.toDate() : new Date(date);
  
  // Format the date using Bengali locale
  return d.toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}