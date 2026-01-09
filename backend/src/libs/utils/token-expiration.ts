import { addMonths, addDays, addSeconds } from 'date-fns';

/**
 * Parse environment variable REFRESH_TOKEN_TTL
 * Mendukung format seperti:
 * - "1m" (1 bulan)
 * - "30d" (30 hari)
 * - "3600s" (3600 detik)
 * - "1m 15d 3600s" (gabungan)
 */
export function getDynamicTTL(now = new Date()): Date {
  const ttlString = process.env.REFRESH_TOKEN_TTL ?? '30d'; // default 30 hari

  // Pisahkan berdasarkan spasi
  const parts = ttlString.trim().split(/\s+/);

  // Simpan hasil konversi total waktu
  let result = new Date(now);

  for (const part of parts) {
    const match = part.match(/^(\d+)([mds])$/i);
    if (!match) continue;

    const value = Number(match[1]);
    const unit = match[2].toLowerCase();

    switch (unit) {
      case 'm': // months
        result = addMonths(result, value);
        break;
      case 'd': // days
        result = addDays(result, value);
        break;
      case 's': // seconds
        result = addSeconds(result, value);
        break;
      default:
        break;
    }
  }

  return result;
}
