export interface EnvConfig {
  BOT_TOKEN: string;
  PORT: number;
  NODE_ENV: string;
  ADMIN_TELEGRAM_ID?: string;
  TAX_EN_PERCENT: string;
  TAX_ESV: string;
  TAX_MILITARY_PERCENT: string;
}

function get(config: Record<string, unknown>, key: string): string | undefined {
  const v = config[key];
  return v === undefined ? undefined : String(v).trim() || undefined;
}

function requireKey(config: Record<string, unknown>, key: string): string {
  const value = get(config, key);
  if (value === undefined || value === '') {
    throw new Error(`Missing required env: ${key}`);
  }
  return value;
}

export function configValidationSchema(
  config: Record<string, unknown>,
): EnvConfig {
  const port = Number(get(config, 'PORT'));
  const portFinal = Number.isNaN(port) || port <= 0 ? 3000 : port;

  return {
    BOT_TOKEN: requireKey(config, 'BOT_TOKEN'),
    PORT: portFinal,
    NODE_ENV: get(config, 'NODE_ENV') || 'production',
    ADMIN_TELEGRAM_ID: get(config, 'ADMIN_TELEGRAM_ID'),
    TAX_EN_PERCENT: requireKey(config, 'TAX_EN_PERCENT'),
    TAX_ESV: requireKey(config, 'TAX_ESV'),
    TAX_MILITARY_PERCENT: requireKey(config, 'TAX_MILITARY_PERCENT'),
  };
}
