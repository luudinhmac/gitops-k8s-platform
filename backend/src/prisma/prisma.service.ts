import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // Explicitly declare models that might have typing delays in the IDE
  maintenanceCode: any; 

  async onModuleInit() {
    await this.$connect();
    const dbUrl = process.env.DATABASE_URL;
    const dbName = dbUrl?.split('/').pop()?.split('?')[0];
    console.log(`[Database] Successfully connected to: ${dbName}`);
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
