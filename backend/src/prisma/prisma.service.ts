import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // Explicitly declare models that might have typing delays in the IDE
  // Note: maintenanceCode is handled by PrismaClient accessor

  async onModuleInit() {
    let retries = 5;
    while (retries > 0) {
      try {
        await this.$connect();
        const dbUrl = process.env.DATABASE_URL;
        const dbName = dbUrl?.split('/').pop()?.split('?')[0];
        console.log(`[Database] Successfully connected to: ${dbName}`);
        break;
      } catch (err: any) {
        retries--;
        console.error(
          `[Database] Connection failed. Retries left: ${retries}. Error: ${err.message}`,
        );
        if (retries === 0) throw err;
        await new Promise((res) => setTimeout(res, 3000)); // Wait 3s before retry
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async reconnect(newUrl: string) {
    console.log(`[Database] Attempting to reconnect to new database...`);
    try {
      await this.$disconnect();

      // Update the internal datasource URL
      // In Prisma v5+, this is the way to override the URL at runtime
      (this as any)._activeDatasources = undefined; // Force internal reset
      (this as any)._engineConfig.datasources = [
        {
          name: 'db',
          url: newUrl,
        },
      ];

      await this.$connect();
      console.log(`[Database] Reconnected successfully to new database.`);
    } catch (err: any) {
      console.error(`[Database] Reconnect failed: ${err.message}`);
      throw err;
    }
  }
}
