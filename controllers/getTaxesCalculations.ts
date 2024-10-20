import { Message } from 'node-telegram-bot-api';
import bot from '../bot';
import { enPercent, esv, formatNumbers } from '../utils';

const getTaxesCalculations = (msg: Message): void => {
  if (!msg.from) return;

  const compensation: number = Number(msg.text?.replace(/\D/g, '') || '');

  const { id } = msg.from;

  if (!compensation) {
    bot.sendMessage(
      id,
      'Вибачте, введіть будь ласка суму компенсації в гривнях.'
    );

    return;
  }

  const enCalc = (compensation / 100) * Number(enPercent);
  const militaryTaxCalc = (compensation / 100) * Number(militaryPercent);
  const monthlyTax = enCalc + Number(esv) + militaryTaxCalc;
  const whiteCompensation = compensation - monthlyTax;

  bot.sendMessage(
    id,
    `Вітаю!

ЄН - ${formatNumbers(esvCalc)} грн. (${enPercent}%).
ЄСВ - ${formatNumbers(Number(esv))} грн.

Ваші Податки на місяць - ${formatNumbers(monthlyTax)} грн.
Ваша компенсація на місяць - ${formatNumbers(whiteCompensation)} грн.

Дякую, звертайтесь ще!`
  );
};

export default getTaxesCalculations;
