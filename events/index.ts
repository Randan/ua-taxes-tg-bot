import { Message } from 'node-telegram-bot-api';
import bot from '../bot';
import {
  addCompliment,
  addUser,
  help,
  removeUser,
  sendCompliment,
  sendComplimentToAllUsers,
} from '../controllers';

const events: Record<string, RegExp> = {
  help: /\/help/,
  start: /\/start/,
  stop: /\/stop/,
  compliment: /\/compliment/,
  complimentToAll: /\/toAll/,
  addCompliment: /\/add/,
};

bot.onText(events.help, (msg: Message): void => help(msg));

bot.onText(events.start, (msg: Message): void => addUser(msg));

bot.onText(events.stop, (msg: Message): void => removeUser(msg));

bot.onText(events.compliment, (msg: Message): void => sendCompliment(msg));

bot.onText(events.complimentToAll, () => sendComplimentToAllUsers());

bot.onText(events.addCompliment, (msg: Message): void => addCompliment(msg));
