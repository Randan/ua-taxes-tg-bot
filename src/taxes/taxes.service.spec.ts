import { formatUah, TaxesService } from './taxes.service';

const rates: Record<string, string> = { TAX_EN_PERCENT: '5', TAX_MILITARY_PERCENT: '1', TAX_ESV: '1902.34' };

describe('TaxesService', () => {
  const registry = { addDiagnostics: jest.fn() };
  const service = new TaxesService({ get: (key: string) => rates[key] } as never, registry as never);

  it('counts ЄН and військовий збір on the income, without ЄСВ by default', () => {
    expect(service.calculate(25000, false)).toEqual({
      income: 25000,
      en: 1250,
      military: 250,
      esv: 0,
      total: 1500,
      net: 23500,
    });
  });

  it('adds the fixed ЄСВ on request', () => {
    const result = service.calculate(25000, true);
    expect(result.esv).toBe(1902.34);
    expect(result.total).toBeCloseTo(3402.34);
    expect(result.net).toBeCloseTo(21597.66);
  });

  it('formats a result without ЄСВ with a hint to /esv', () => {
    expect(service.formatResult(service.calculate(25000, false))).toBe(
      [
        `Дохід: ${formatUah(25000)}`,
        '',
        `ЄН (5%): ${formatUah(1250)}`,
        `Військовий збір (1%): ${formatUah(250)}`,
        '',
        `Разом податків: ${formatUah(1500)}`,
        `Залишиться: ${formatUah(23500)}`,
        '',
        `Без ЄСВ. Разом з ЄСВ (${formatUah(1902.34)}): /esv 25000`,
      ].join('\n'),
    );
  });

  it('formats a result with ЄСВ without the hint', () => {
    const text = service.formatResult(service.calculate(25000, true));
    expect(text).toContain(`ЄСВ: ${formatUah(1902.34)}`);
    expect(text).not.toContain('/esv');
  });

  it('formats hryvnias the Ukrainian way', () => {
    expect(formatUah(25000.5)).toMatch(/^25\s000,5 грн$/);
  });

  it('greets by name in the help', () => {
    expect(service.getHelpMessage('Андрій')).toMatch(/^Вітаю, Андрій!/);
    expect(service.getHelpMessage()).toMatch(/^Вітаю!/);
    expect(service.getHelpMessage()).toContain('/esv 25000');
  });

  it('shows the rates in /diag', () => {
    service.onModuleInit();
    const [title, section] = registry.addDiagnostics.mock.calls[0];
    expect(title).toBe('Ставки (з .env)');
    expect(section()).toEqual(['ЄН: 5%', 'військовий збір: 1%', `ЄСВ: ${formatUah(1902.34)}`]);
  });
});
