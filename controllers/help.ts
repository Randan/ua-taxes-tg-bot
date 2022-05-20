import { Message } from 'node-telegram-bot-api';
import bot from '../bot';
import { lib, notifyAdmin } from '../utils';

const help = (msg: Message): void => {
  if (!msg.from) return;
  const { id } = msg.from;

  bot.sendMessage(
    id,
    lib.help(msg)
  );

  notifyAdmin(
    lib.helpNotify(msg)
  );
};

export default help;
