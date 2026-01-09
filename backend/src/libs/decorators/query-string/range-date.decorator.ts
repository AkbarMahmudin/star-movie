import { Transform } from 'class-transformer';
import { parseDate } from '../../utils';

// Transformer
export const TransformRangeDate = () =>
  Transform(({ value }) => {
    if (typeof value !== 'string') return null;

    // eslint-disable-next-line prefer-const
    let [partStart, partEnd] = value.split(',').map((p) => p.trim());
    // Jika end date tidak ada
    if (!partEnd) {
      partEnd = partStart;
    }

    // Jika format end date MM-YYYY
    if (partEnd.split('-').length === 2) {
      const parts = partEnd.split('-');
      parts[0] = String(+parts[0] + 1);
      partEnd = parts.join('-');
    }

    // Parsing ke [Date, Date]
    const dates = [partStart, partEnd].map(parseDate);
    if (dates.some((d) => d === null)) return null;

    const [start, end] = dates;
    end?.setHours(23, 59, 59, 999);

    return [start, end] as [Date, Date];
  });
