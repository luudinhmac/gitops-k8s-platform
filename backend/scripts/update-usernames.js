"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Starting to sync null/empty fullnames with usernames...');
    const users = await prisma.user.findMany({
        where: {
            OR: [
                { fullname: null },
                { fullname: '' }
            ]
        }
    });
    console.log(`Found ${users.length} users to update.`);
    for (const user of users) {
        await prisma.user.update({
            where: { id: user.id },
            data: { fullname: user.username }
        });
        console.log(`Updated user ${user.username} with fullname: ${user.username}`);
    }
    console.log('Sync completed successfully.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=update-usernames.js.map