import { Module } from '@nestjs/common';

import { TaxesHandler } from './taxes.handler';
import { TaxesService } from './taxes.service';

@Module({
  providers: [TaxesService, TaxesHandler],
})
export class TaxesModule {}
