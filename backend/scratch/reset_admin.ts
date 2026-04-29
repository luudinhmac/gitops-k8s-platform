import { PrismaClient } from '../generated/prisma-client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin@2026', 10);
  const user = await prisma.user.update({
    where: { username: 'admin' },
    data: { password: hash }
  });
  console.log('Password reset for admin successful');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
