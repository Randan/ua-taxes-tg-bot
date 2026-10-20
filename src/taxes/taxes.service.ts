import type { OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BotKitRegistry } from '@randan/tg-bot-kit';

/** "25 000,5" with Ukrainian grouping and decimal comma. */
export function formatUah(amount: number): string {
  return `${amount.toLocaleString('uk-UA', { maximumFractionDigits: 2 })} грн`;
}

export interface TaxResult {
  income: number;
  en: number;
  military: number;
  /** The fixed monthly ЄСВ, or 0 when it is not counted. */
  esv: number;
  total: number;
  net: number;
}

export interface TaxRates {
  enPercent: number;
  militaryPercent: number;
  esv: number;
}

/** Monthly taxes of a 3rd-group ФОП: ЄН and військовий збір on the income, ЄСВ fixed. */
@Injectable()
export class TaxesService implements OnModuleInit {
  constructor(
    private readonly config: ConfigService,
    private readonly registry: BotKitRegistry,
  ) {}

  onModuleInit(): void {
    this.registry.addDiagnostics('Ставки (з .env)', () => {
      const rates = this.getRates();
      return [`ЄН: ${rates.enPercent}%`, `військовий збір: ${rates.militaryPercent}%`, `ЄСВ: ${formatUah(rates.esv)}`];
    });
  }

  getRates(): TaxRates {
    return {
      enPercent: Number(this.config.get<string>('TAX_EN_PERCENT')),
      militaryPercent: Number(this.config.get<string>('TAX_MILITARY_PERCENT')),
      esv: Number(this.config.get<string>('TAX_ESV')),
    };
  }

  calculate(income: number, withEsv: boolean): TaxResult {
    const rates = this.getRates();
    const en = (income * rates.enPercent) / 100;
    const military = (income * rates.militaryPercent) / 100;
    const esv = withEsv ? rates.esv : 0;
    const total = en + military + esv;
    return { income, en, military, esv, total, net: income - total };
  }

  formatResult(result: TaxResult): string {
    const rates = this.getRates();
    const lines = [
      `Дохід: ${formatUah(result.income)}`,
      '',
      `ЄН (${rates.enPercent}%): ${formatUah(result.en)}`,
      `Військовий збір (${rates.militaryPercent}%): ${formatUah(result.military)}`,
    ];
    if (result.esv) {
      lines.push(`ЄСВ: ${formatUah(result.esv)}`);
    }
    lines.push('', `Разом податків: ${formatUah(result.total)}`, `Залишиться: ${formatUah(result.net)}`);
    if (!result.esv) {
      lines.push('', `Без ЄСВ. Разом з ЄСВ (${formatUah(rates.esv)}): /esv ${result.income}`);
    }
    return lines.join('\n');
  }

  getHelpMessage(firstName?: string): string {
    const name = firstName ? `, ${firstName}` : '';
    return [
      `Вітаю${name}! Я рахую податки ФОП 3 групи за місяць.`,
      '',
      'Надішли суму доходу в гривнях, наприклад 25000 — порахую ЄН і військовий збір.',
      '/esv 25000 — те саме разом з ЄСВ.',
      '',
      '/help — ця довідка',
    ].join('\n');
  }
}
