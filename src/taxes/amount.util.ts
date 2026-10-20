/** Above this an amount is surely a typo, not a monthly income. */
const MAX_AMOUNT = 1_000_000_000;

const CURRENCY = /(грн\.?|гривень|гривні|гривня|uah|₴)/gi;

/** "1.234.567" or "1,234,567": a separator between groups of three digits. */
function isGrouped(value: string, separator: string): boolean {
  const escaped = separator === '.' ? '\\.' : separator;
  return new RegExp(`^\\d{1,3}(${escaped}\\d{3})+$`).test(value);
}

/**
 * The amount in a message like "25000", "25 000", "25000.50", "25 000,50 грн"
 * or "1,250,000"; null when there is no single amount. Spaces and apostrophes
 * group thousands; with both "." and "," the last one is the decimal point.
 */
export function parseAmount(text: string): number | null {
  let value = text.replace(CURRENCY, '').replace(/[\s  '’]/g, '');
  if (!/^\d[\d.,]*$/.test(value)) {
    return null;
  }

  const lastDot = value.lastIndexOf('.');
  const lastComma = value.lastIndexOf(',');
  if (lastDot !== -1 && lastComma !== -1) {
    const decimal = lastDot > lastComma ? '.' : ',';
    const grouping = decimal === '.' ? ',' : '.';
    value = value.split(grouping).join('').replace(decimal, '.');
  } else if (lastDot !== -1 || lastComma !== -1) {
    const separator = lastDot !== -1 ? '.' : ',';
    value = isGrouped(value, separator) ? value.split(separator).join('') : value.replace(separator, '.');
  }

  if (!/^\d+(\.\d+)?$/.test(value)) {
    return null;
  }
  const amount = Number(value);
  return amount > 0 && amount <= MAX_AMOUNT ? amount : null;
}
