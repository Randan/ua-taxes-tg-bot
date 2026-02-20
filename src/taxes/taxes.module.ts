import { Module } from '@nestjs/common';
import { TaxesService } from './taxes.service';
import { TaxesHandler } from './taxes.handler';

@Module({
  providers: [TaxesService, TaxesHandler],
})
export class TaxesModule {}
