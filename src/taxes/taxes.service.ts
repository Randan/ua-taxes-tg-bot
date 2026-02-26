import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function formatNumbers(number: number): string {
  return number.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

export interface TaxResult {
  en: number;
  esv: number;
  military: number;
  monthlyTax: number;
  netCompensation: number;
}

@Injectable()
export class TaxesService {
  constructor(private readonly config: ConfigService) {}

  getHelpMessage(firstName?: string): string {
    const name = firstName ? ` ${firstName}` : '';
    return (
      `Вітаю,${name}! Мене звати UA TAX Bot.\n` +
      '\n' +
      'Я можу порахувати скільки тобі треба сплатити податків у цьому місяці.\n' +
      '\n' +
      'Напиши мені повідомлення у вигляді:\n' +
      '"/tax число_зарплатні_за_місяць_у_гривнях"\n' +
      '\n' +
      'Наразі я працюю тільки з 3 групою.\n' +
      '\n' +
      '/help - Допомога\n' +
      '/tax - Розрахунок податків на місяць'
    );
  }

  calculate(compensationUah: number): TaxResult | null {
    if (!compensationUah || compensationUah <= 0) {
      return null;
    }

    const enPercent = Number(this.config.get<string>('TAX_EN_PERCENT'));
    const esv = Number(this.config.get<string>('TAX_ESV'));
    const militaryPercent = Number(this.config.get<string>('TAX_MILITARY_PERCENT'));

    const en = (compensationUah / 100) * enPercent;
    const military = (compensationUah / 100) * militaryPercent;
    const monthlyTax = en + esv + military;
    const netCompensation = compensationUah - monthlyTax;

    return {
      en,
      esv,
      military,
      monthlyTax,
      netCompensation,
    };
  }

  formatResult(result: TaxResult): string {
    const enPercent = this.config.get<string>('TAX_EN_PERCENT');
    const militaryPercent = this.config.get<string>('TAX_MILITARY_PERCENT');

    return (
      `Вітаю!\n\n` +
      `ЄН - ${formatNumbers(result.en)} грн. (${enPercent}%).\n` +
      `ЄСВ - ${formatNumbers(result.esv)} грн.\n` +
      `Військовий збір - ${formatNumbers(result.military)} грн. (${militaryPercent}%).\n\n` +
      `Ваші Податки на місяць - ${formatNumbers(result.monthlyTax)} грн.\n` +
      `Ваша компенсація на місяць - ${formatNumbers(result.netCompensation)} грн.\n\n` +
      `Дякую, звертайтесь ще!`
    );
  }
}
