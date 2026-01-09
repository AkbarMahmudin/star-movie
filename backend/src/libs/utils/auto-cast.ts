export const autoCastValue = (value: string): any => {
  // 1. Boolean
  if (value === 'true') return true;
  if (value === 'false') return false;

  // 2. Null
  if (value === 'null') return null;

  // 3. Undefined
  if (value === 'undefined') return undefined;

  // 4. Number
  if (!isNaN(Number(value)) && value.trim() !== '') return Number(value);

  // 5. JSON string (Array/Object)
  try {
    const json = JSON.parse(value);
    if (typeof json === 'object') return json;
  } catch (_) {}

  // 6. Default as string
  return value;
};

export const autoCastObject = (
  obj: Record<string, any>,
): Record<string, any> => {
  const result = {};
  for (const key in obj) {
    const val = obj[key];

    if (typeof val === 'object' && val !== null) {
      result[key] = autoCastObject(val);
    } else {
      result[key] = autoCastValue(val);
    }
  }
  return result;
};
