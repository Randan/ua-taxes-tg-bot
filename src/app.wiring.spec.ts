import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { BotKitModule, BotKitRegistry } from '@randan/tg-bot-kit';
import { LoggerModule, NotifyAdminModule } from '@randan/tg-logger';
import { getBotToken } from 'nestjs-telegraf';

import { configValidationSchema } from './config/config.schema';
import { BOT_COMMANDS } from './taxes/bot-commands';
import { TaxesHandler } from './taxes/taxes.handler';
import { TaxesModule } from './taxes/taxes.module';

/** Stands in for TelegrafModule: global, like the real one. */
@Global()
@Module({
  providers: [{ provide: getBotToken(), useValue: { telegram: { setMyCommands: jest.fn() } } }],
  exports: [getBotToken()],
})
class FakeTelegrafModule {}

/** The real module graph without network: catches a provider Nest cannot resolve before it crashes on the Pi. */
describe('application wiring', () => {
  it('resolves every provider of the bot', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          validate: () =>
            configValidationSchema({
              BOT_TOKEN: 't',
              TAX_EN_PERCENT: '5',
              TAX_ESV: '1902.34',
              TAX_MILITARY_PERCENT: '1',
              LOG_LEVEL: 'silent',
            }),
        }),
        FakeTelegrafModule,
        LoggerModule,
        NotifyAdminModule,
        BotKitModule.forRoot({ name: 'ua-taxes-tg-bot', commands: BOT_COMMANDS }),
        TaxesModule,
      ],
    }).compile();

    expect(moduleRef.get(TaxesHandler)).toBeInstanceOf(TaxesHandler);
    expect(moduleRef.get(BotKitRegistry)).toBeInstanceOf(BotKitRegistry);
    await moduleRef.close();
  });
});
