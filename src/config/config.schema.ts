import type { RawEnv } from '@randan/tg-bot-kit';
import { envPort, envString, requireEnv } from '@randan/tg-bot-kit';

export interface EnvConfig {
  BOT_TOKEN: string;
  PORT: number;
  NODE_ENV: string;
  ADMIN_TELEGRAM_ID?: string;
  TAX_EN_PERCENT: string;
  TAX_ESV: string;
  TAX_MILITARY_PERCENT: string;
  LOG_LEVEL?: string;
}

/** A non-negative number, kept as the string the env had ("5", "1902.34"). */
function requireRate(env: RawEnv, key: string): string {
  const value = requireEnv(env, key);
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    throw new Error(`${key} must be a non-negative number, got "${value}"`);
  }
  return value;
}

export function configValidationSchema(env: RawEnv): EnvConfig {
  return {
    BOT_TOKEN: requireEnv(env, 'BOT_TOKEN'),
    PORT: envPort(env),
    NODE_ENV: envString(env, 'NODE_ENV') || 'production',
    ADMIN_TELEGRAM_ID: envString(env, 'ADMIN_TELEGRAM_ID'),
    TAX_EN_PERCENT: requireRate(env, 'TAX_EN_PERCENT'),
    TAX_ESV: requireRate(env, 'TAX_ESV'),
    TAX_MILITARY_PERCENT: requireRate(env, 'TAX_MILITARY_PERCENT'),
    LOG_LEVEL: envString(env, 'LOG_LEVEL'),
  };
}
