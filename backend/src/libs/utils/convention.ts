export function toSnakeCase(str: string): string {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}

export function toSnakeCaseDeep(input: any): any {
  if (input === null || input === undefined) return input;

  if (Array.isArray(input)) {
    return input.map((v) => toSnakeCaseDeep(v));
  }

  if (typeof input === "object") {
    const result: Record<string, any> = {};
    for (const key in input) {
      if (!input.hasOwnProperty(key)) continue;
      const newKey = toSnakeCase(key);
      result[newKey] = toSnakeCaseDeep(input[key]);
    }
    return result;
  }

  return input;
}
