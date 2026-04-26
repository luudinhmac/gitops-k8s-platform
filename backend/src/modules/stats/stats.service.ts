import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StatsService {
  private readonly logger = new Logger(StatsService.name);
  private activeUsers = new Map<string, number>();
  private readonly ONLINE_THRESHOLD = 5 * 60 * 1000;

  constructor(private prisma: PrismaService) {}

  updateUserActivity(identifier: string) {
    this.activeUsers.set(identifier, Date.now());
  }

  async getStats() {
    const now = Date.now();
    let onlineCount = 0;
    this.activeUsers.forEach((lastSeen, id) => {
      if (now - lastSeen < this.ONLINE_THRESHOLD) {
        onlineCount++;
      } else {
        this.activeUsers.delete(id);
      }
    });

    const totalVisitsSetting = await this.prisma.setting.findUnique({
      where: { key: 'stats_total_visits' }
    });

    return {
      onlineCount,
      totalVisits: parseInt(totalVisitsSetting?.value || '0', 10),
    };
  }

  async incrementTotalVisits() {
    try {
      const current = await this.prisma.setting.findUnique({
        where: { key: 'stats_total_visits' }
      });

      const newValue = (parseInt(current?.value || '0', 10) + 1).toString();

      await this.prisma.setting.upsert({
        where: { key: 'stats_total_visits' },
        update: { value: newValue },
        create: {
          key: 'stats_total_visits',
          value: newValue,
          group: 'stats',
          is_public: true
        }
      });
    } catch (error) {
      this.logger.error('Failed to increment total visits', error);
    }
  }
}
