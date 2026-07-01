export const convertToCSV = async (data: object[]) => {
  if (!Array.isArray(data) || data.length === 0) return '';

  const headers = Object.keys(data[0]);

  const escapeField = (val: any) => {
    if (val === undefined || val === null) return '';
    if (val instanceof Date) return val.toISOString();

    let s: string;
    if (typeof val === 'object') {
      try {
        s = JSON.stringify(val);
      } catch (e) {
        s = String(val);
      }
    } else {
      s = String(val);
    }

    // Unescape common backslash-escaped quotes and slashes
    s = s.replace(/\\"/g, '"').replace(/\\\\/g, '\\');

    // Escape double quotes for CSV by doubling them
    s = s.replace(/"/g, '""');

    // Always wrap fields in double quotes to be safe
    return `"${s}"`;
  };

  const lines = [];
  lines.push(headers.join(','));

  for (const row of data) {
    const cells = headers.map((h) => escapeField((row as any)[h]));
    lines.push(cells.join(','));
  }

  return lines.join('\n');
};
