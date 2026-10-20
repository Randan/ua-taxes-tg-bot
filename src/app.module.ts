import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BotKitModule } from '@randan/tg-bot-kit';
import { LoggerModule, NotifyAdminModule } from '@randan/tg-logger';

import { configValidationSchema } from './config/config.schema';
import { BOT_COMMANDS } from './taxes/bot-commands';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: configValidationSchema,
    }),
    LoggerModule,
    NotifyAdminModule,
    // GET /health, the admin /diag and the command menu
    BotKitModule.forRoot({ name: 'ua-taxes-tg-bot', commands: BOT_COMMANDS }),
    TelegramModule,
  ],
})
export class AppModule {}
