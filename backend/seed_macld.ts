import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- SEEDING SUPERADMIN (macld) ---');
  
  const username = 'macld';
  const password = process.env.ADMIN_PASSWORD || 'macld@2026';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.upsert({
    where: { username },
    update: {
      role: 'admin',
      is_active: true,
    },
    create: {
      username,
      email: 'macld@portfolio.com',
      password: hashedPassword,
      role: 'admin',
      fullname: 'Super Admin',
      is_active: true,
      profession: 'Superadmin',
    },
  });

  console.log(`Successfully created/updated superadmin user: ${user.username}`);
  console.log(`Default password is the one from .env or 'macld@2026'`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
