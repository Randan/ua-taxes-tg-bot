import bot from '../bot/index.js';
import { notifyAdmin } from '../utils/index.js';

const help = msg => {
  const { id, first_name } = msg.from;

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

  notifyAdmin(`${id} ${first_name} попросив(-ла) про допомогу`);
};

export default help;
