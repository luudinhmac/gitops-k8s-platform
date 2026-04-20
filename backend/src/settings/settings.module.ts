import { Module, forwardRef } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { PrismaModule } from './../prisma/prisma.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [PrismaModule, forwardRef(() => TelegramModule)],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
