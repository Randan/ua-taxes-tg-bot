import { Message } from 'node-telegram-bot-api';

export const webGreetings = () =>
  `<style>body { min-height: 100vh; display: flex; justify-content: center; align-items: center; flex-direction: column; margin: 0; background-color: #40a5ed; font-family: sans-serif; color: #252324; }</style>
  <h1>Вітаю, я <a href='https://t.me/ua_tax_bot' style='color: #252324;'>UA Tax Bot</a>!</h1>
  <h2>Заходь!</h2>
  <p>Наразі я роблю розрахунки тільки 3 групи</p>`;

export const botWokeUp = () => 'Вітаю, я прокинувся =)';

export const help = (msg: Message): string => {
  if (!msg.from) return '';

  const { first_name } = msg.from;

  return (
    `Вітаю, ${first_name}! Мене звати UA TAX Bot.\n` +
    '\n' +
    'Я можу порахувати скільки тобі треба сплатити налогів у цьому місяці.\n' +
    '\n' +
    'Напиши мені повідомлення у вигляді:\n' +
    '"/tax число_зарплатні_за_місяць_у_гривнях"\n' +
    '\n' +
    'Наразі я працюю тільки з 3 групою.\n' +
    '\n' +
    '/help - Допомога\n' +
    '/tax - Розрахунок налогів на місяць'
  );
};
