import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const notifications = await prisma.notification.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        Recipient: { select: { username: true } },
        Sender: { select: { username: true } },
      }
    });
    console.log(JSON.stringify(notifications, null, 2));
  } catch (error) {
    console.error('Query failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
