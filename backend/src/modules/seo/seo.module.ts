import { Module } from '@nestjs/common';
import { SeoService } from './services/seo.service';
import { SeoController } from './controllers/seo.controller';

@Module({
  controllers: [SeoController],
  providers: [SeoService],
  exports: [SeoService],
})
export class SeoModule {}
