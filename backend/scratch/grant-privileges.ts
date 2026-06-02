import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Granting privileges...');
  await prisma.$executeRawUnsafe(`GRANT ALL PRIVILEGES ON SCHEMA public TO portfolio_user`);
  await prisma.$executeRawUnsafe(`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO portfolio_user`);
  await prisma.$executeRawUnsafe(`GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO portfolio_user`);
  console.log('Successfully granted all privileges to portfolio_user!');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
