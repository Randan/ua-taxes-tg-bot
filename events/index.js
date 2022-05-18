import { bot } from '../utils/index.js';
import { addUser, help, removeUser, sendCompliment } from '../controllers/index.js';

const events = {
  help: /\/help/,
  start: /\/start/,
  stop: /\/stop/,
  compliment: /\/compliment/
};

bot.onText(events.help, msg => help(msg));

bot.onText(events.start, msg => addUser(msg));

bot.onText(events.stop, msg => removeUser(msg));

bot.onText(events.compliment, msg => sendCompliment(msg));
