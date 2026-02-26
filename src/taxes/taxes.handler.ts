import { Command, Ctx, Update } from 'nestjs-telegraf';
import type { Context } from 'telegraf';

import { TaxesService } from './taxes.service';

@Update()
export class TaxesHandler {
  constructor(private readonly taxes: TaxesService) {}

  @Command('help')
  async help(@Ctx() ctx: Context): Promise<void> {
    const from = ctx.from;
    const firstName = from?.first_name;
    const chatId = ctx.chat?.id;
    if (!chatId) {
      return;
    }

    const text = this.taxes.getHelpMessage(firstName);
    await ctx.telegram.sendMessage(chatId, text);
  }

  @Command('tax')
  async tax(@Ctx() ctx: Context): Promise<void> {
    const chatId = ctx.chat?.id;
    if (!chatId) {
      return;
    }

    const messageText = 'message' in ctx && ctx.message && 'text' in ctx.message ? ctx.message.text : '';
    const compensation = Number(messageText?.replace(/\D/g, '') || '');

    if (!compensation) {
      await ctx.telegram.sendMessage(chatId, 'Вибачте, введіть будь ласка суму компенсації в гривнях.');
      return;
    }

    const result = this.taxes.calculate(compensation);
    if (!result) {
      await ctx.telegram.sendMessage(chatId, 'Вибачте, введіть будь ласка суму компенсації в гривнях.');
      return;
    }

    const text = this.taxes.formatResult(result);
    await ctx.telegram.sendMessage(chatId, text);
  }
}
