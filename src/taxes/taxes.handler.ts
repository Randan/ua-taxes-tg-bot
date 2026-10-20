import { Command, Ctx, On, Update } from 'nestjs-telegraf';
import type { Context } from 'telegraf';

import { parseAmount } from './amount.util';
import { TaxesService } from './taxes.service';

const ASK_AMOUNT = 'Надішли суму доходу в гривнях, наприклад 25000.';

function messageText(ctx: Context): string {
  const message = ctx.message;
  return message && 'text' in message && typeof message.text === 'string' ? message.text : '';
}

@Update()
export class TaxesHandler {
  constructor(private readonly taxes: TaxesService) {}

  @Command(['start', 'help'])
  async help(@Ctx() ctx: Context): Promise<void> {
    const chatId = ctx.chat?.id;
    if (!chatId) {
      return;
    }
    await ctx.telegram.sendMessage(chatId, this.taxes.getHelpMessage(ctx.from?.first_name));
  }

  /** /esv 25000: the taxes together with ЄСВ. */
  @Command('esv')
  async esv(@Ctx() ctx: Context): Promise<void> {
    const chatId = ctx.chat?.id;
    if (!chatId) {
      return;
    }
    const amount = parseAmount(messageText(ctx).replace(/^\/esv(@\w+)?/i, ''));
    if (amount === null) {
      await ctx.telegram.sendMessage(chatId, 'Напиши суму після команди, наприклад /esv 25000.');
      return;
    }
    await ctx.telegram.sendMessage(chatId, this.taxes.formatResult(this.taxes.calculate(amount, true)));
  }

  /** A plain amount: the taxes without ЄСВ. Other text gets a hint in a private chat and silence in a group. */
  @On('text')
  async text(@Ctx() ctx: Context): Promise<void> {
    const chatId = ctx.chat?.id;
    const text = messageText(ctx);
    if (!chatId || text.startsWith('/')) {
      return;
    }
    const amount = parseAmount(text);
    if (amount === null) {
      if (ctx.chat?.type === 'private') {
        await ctx.telegram.sendMessage(chatId, ASK_AMOUNT);
      }
      return;
    }
    await ctx.telegram.sendMessage(chatId, this.taxes.formatResult(this.taxes.calculate(amount, false)));
  }
}
