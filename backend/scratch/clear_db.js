const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- CLEARING DATABASE ---');
  
  // Order matters due to foreign key constraints
  const tablenames = [
    'MaintenanceCode',
    'MediaUsage',
    'Media',
    'Setting',
    'Notification',
    'PostLike',
    'Comment',
    'Post',
    'Tag',
    'Series',
    'Category',
    'User'
  ];

  for (const tablename of tablenames) {
    try {
      await prisma.$executeRawUnsafe(`DELETE FROM "${tablename}";`);
      console.log(`- Cleared table: ${tablename}`);
    } catch (err) {
      console.error(`- Failed to clear table ${tablename}: ${err.message}`);
    }
  }

  console.log('--- DATABASE CLEARED ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
