import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
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
