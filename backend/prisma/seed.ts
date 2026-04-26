import { PrismaClient } from '../generated/prisma-client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- SEEDING SETTINGS ---');

  const settings = [
    { key: 'maintenance_global', value: 'false', group: 'maintenance', is_public: true },
    { key: 'maintenance_posts', value: 'false', group: 'maintenance', is_public: true },
    { key: 'maintenance_comments', value: 'false', group: 'maintenance', is_public: true },
    { key: 'maintenance_passcode', value: '123456', group: 'maintenance', is_public: false },
  ];

  for (const item of settings) {
    await prisma.setting.upsert({
      where: { key: item.key },
      update: {},
      create: item,
    });
    console.log(`- Upserted setting: ${item.key}`);
  }

  console.log('--- SEEDING USERS ---');
  const adminPassword = process.env.ADMIN_PASSWORD || 'macld@2026';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // 1. Seed 'macld' superuser
  const macldUser = await prisma.user.upsert({
    where: { username: 'macld' },
    update: {
      role: 'superadmin',
      is_active: true,
    },
    create: {
      username: 'macld',
      email: 'macld@portfolio.com',
      password: hashedPassword,
      role: 'superadmin',
      fullname: 'Super Admin',
      is_active: true,
      profession: 'Superadmin',
    },
  });
  console.log(`- Upserted superuser: ${macldUser.username}`);

  console.log('--- SEEDING COMPLETE ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
