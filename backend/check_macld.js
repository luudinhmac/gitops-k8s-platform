"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_client_1 = require("./generated/prisma-client");
const prisma = new prisma_client_1.PrismaClient();
async function main() {
    const user = await prisma.user.findUnique({
        where: { username: 'macld' }
    });
    if (user) {
        console.log('--- USER FOUND ---');
        console.log('ID:', user.id);
        console.log('Username:', user.username);
        console.log('Role:', user.role);
        console.log('Status:', user.is_active ? 'Active' : 'Inactive');
        console.log('------------------');
    }
    else {
        console.log('--- USER NOT FOUND: macld ---');
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=check_macld.js.map