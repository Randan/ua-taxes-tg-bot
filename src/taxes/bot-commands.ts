import type { BotCommand } from '@randan/tg-bot-kit';

/** The public commands, in menu order; the kit writes them to Telegram on startup. */
export const BOT_COMMANDS: BotCommand[] = [
  { command: 'esv', description: 'Податки разом з ЄСВ: /esv 25000' },
  { command: 'help', description: 'Як користуватися' },
];
