import bot from '../bot/index.js';
import { addUser, help, removeUser, sendCompliment, sendComplimentToAllUsers } from '../controllers/index.js';

const events = {
  help: /\/help/,
  start: /\/start/,
  stop: /\/stop/,
  compliment: /\/compliment/,
  complimentToAll: /\/to-all/
};

bot.onText(events.help, msg => help(msg));

bot.onText(events.start, msg => addUser(msg));

bot.onText(events.stop, msg => removeUser(msg));

bot.onText(events.compliment, msg => sendCompliment(msg));

bot.onText(events.compliment, () => sendComplimentToAllUsers());
