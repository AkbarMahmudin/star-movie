export function toCamelCase(str: string) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
}

export function shouldTreatSearchAsString(searchBy: string | string[], numericFields: string[]): boolean {
  const fields = new Set(numericFields);
  return Array.isArray(searchBy)
    ? searchBy.some((f) => fields.has(f))
    : fields.has(searchBy);
}

export function truncateByWord(str: string, wordLimit: number, ellipsis = '...') {
  // Handle empty or invalid input
  if (!str || typeof str !== 'string' || wordLimit <= 0) {
    return '';
  }

  // Split the string into an array of words
  const words = str.split(' ');

  // If the number of words is less than or equal to the limit, return the original string
  if (words.length <= wordLimit) {
    return str;
  }

  // Take the specified number of words
  const truncatedWords = words.slice(0, wordLimit);

  // Join the truncated words back into a string and append the ellipsis
  return truncatedWords.join(' ') + ellipsis;
}


