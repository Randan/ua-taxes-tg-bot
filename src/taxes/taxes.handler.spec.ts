import { TaxesHandler } from './taxes.handler';
import { formatUah, TaxesService } from './taxes.service';

const rates: Record<string, string> = { TAX_EN_PERCENT: '5', TAX_MILITARY_PERCENT: '1', TAX_ESV: '1902.34' };

describe('TaxesHandler', () => {
  const handler = new TaxesHandler(
    new TaxesService({ get: (key: string) => rates[key] } as never, { addDiagnostics: jest.fn() } as never),
  );

  function ctx(text: string, type: 'private' | 'group' = 'private') {
    const sent: string[] = [];
    return {
      sent,
      chat: { id: 1, type },
      from: { id: 1, first_name: 'Андрій' },
      message: { text },
      telegram: { sendMessage: jest.fn(async (_chatId: number, message: string) => sent.push(message)) },
    };
  }

  it('answers a plain amount without ЄСВ', async () => {
    const c = ctx('25 000');
    await handler.text(c as never);
    expect(c.sent[0]).toContain(`Разом податків: ${formatUah(1500)}`);
    expect(c.sent[0]).toContain('Без ЄСВ');
  });

  it('answers /esv with ЄСВ, also with the bot name in a group', async () => {
    const c = ctx('/esv@ua_taxes_bot 25000', 'group');
    await handler.esv(c as never);
    expect(c.sent[0]).toContain(`ЄСВ: ${formatUah(1902.34)}`);
  });

  it('asks for the amount after /esv', async () => {
    const c = ctx('/esv');
    await handler.esv(c as never);
    expect(c.sent).toEqual(['Напиши суму після команди, наприклад /esv 25000.']);
  });

  it('hints in a private chat when the text has no amount', async () => {
    const c = ctx('скільки податків?');
    await handler.text(c as never);
    expect(c.sent).toEqual(['Надішли суму доходу в гривнях, наприклад 25000.']);
  });

  it('stays silent in a group when the text has no amount', async () => {
    const c = ctx('всім привіт', 'group');
    await handler.text(c as never);
    expect(c.sent).toEqual([]);
  });

  it('leaves commands to their handlers', async () => {
    const c = ctx('/tax 25000');
    await handler.text(c as never);
    expect(c.sent).toEqual([]);
  });

  it('greets on /start and /help', async () => {
    const c = ctx('/start');
    await handler.help(c as never);
    expect(c.sent[0]).toMatch(/^Вітаю, Андрій!/);
  });

  it('ignores updates without a chat', async () => {
    const c = { ...ctx('25000'), chat: undefined };
    await handler.text(c as never);
    await handler.esv(c as never);
    await handler.help(c as never);
    expect(c.sent).toEqual([]);
  });
});
