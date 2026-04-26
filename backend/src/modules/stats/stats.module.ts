import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
<<<<<<< HEAD:backend/src/stats/stats.module.ts
import { PrismaModule } from '../prisma/prisma.module';
import { SettingsModule } from '../modules/settings/settings.module';
=======
import { PrismaModule } from '../../prisma/prisma.module';
import { SettingsModule } from '../settings/settings.module';
>>>>>>> feature/arch-refactor:backend/src/modules/stats/stats.module.ts
import { AdminAlertModule } from '../admin-alert/admin-alert.module';

@Module({
  imports: [PrismaModule, SettingsModule, AdminAlertModule],
  providers: [StatsService],
  controllers: [StatsController],
  exports: [StatsService],
})
export class StatsModule {}
