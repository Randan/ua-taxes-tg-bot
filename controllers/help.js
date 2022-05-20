import bot from '../bot/index.js';
import { notifyAdmin } from '../utils/index.js';

const help = msg => {
  const { id, first_name, username } = msg.from;

  bot.sendMessage(
    id,
    `Вітаю, ${first_name}! Мене звати ComplimentBot.\n` +
    '\n' +
    'Якщо хочеш - я буду відправляти тобі компліменти.\n' +
    '\n' +
    '/help - Допомога.\n' +
    '/start - Дозволь мені говорити тобі приємне.\n' +
    '/stop - Скажи мені "Па-па".\n' +
    '/compliment - Якщо хочешь комплімент прямо тут і зараз.'
  );

  notifyAdmin(`${first_name} (@${username}) попросив(-ла) про допомогу`);
};

export default help;
