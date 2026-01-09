export function parseDate(str: string): Date | null {
  const parts = str.split('-').map((p) => p.trim());

  if (parts.length === 2) {
    // MM-YYYY
    const [month, year] = parts.map(Number);
    if (isNaN(month) || isNaN(year)) return null;
    return new Date(year, month - 1, 1);
  }

  if (parts.length === 3) {
    // DD-MM-YYYY
    const [day, month, year] = parts.map(Number);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    return new Date(year, month - 1, day);
  }

  return null;
}
