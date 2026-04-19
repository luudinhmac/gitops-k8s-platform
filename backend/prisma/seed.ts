import { PrismaClient } from '@prisma/client';

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
