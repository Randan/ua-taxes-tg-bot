import { Message } from 'node-telegram-bot-api';
import bot from '../bot';
import { getTaxesCalculations, help } from '../controllers';

const events: Record<string, RegExp> = {
  help: /\/help/,
  tax: /\/tax/,
};

bot.onText(events.help, (msg: Message): void => help(msg));

bot.onText(events.tax, (msg: Message): void => getTaxesCalculations(msg));
