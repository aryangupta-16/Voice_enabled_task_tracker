/**
 * Generic validators for common patterns
 */

export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidDateString(dateString: string): boolean {
  try {
    const date = new Date(dateString);
    return !Number.isNaN(date.getTime());
  } catch {
    return false;
  }
}

export function isFutureDate(dateString: string): boolean {
  if (!isValidDateString(dateString)) return false;
  return new Date(dateString) > new Date();
}
