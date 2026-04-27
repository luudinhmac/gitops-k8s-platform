"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_client_1 = require("../generated/prisma-client");
const prisma = new prisma_client_1.PrismaClient();
async function test() {
    try {
        console.log('Testing Post.findMany...');
        const posts = await prisma.post.findMany({
            take: 1,
            include: {
                Category: true,
                Author: { select: { id: true, fullname: true, avatar: true } },
                Series: true,
                Tag: true,
                _count: { select: { Comment: true, PostLike: true } },
            }
        });
        console.log('Post.findMany success:', posts.length);
        console.log('Testing Series.findMany...');
        const series = await prisma.series.findMany({
            include: {
                _count: {
                    select: { Post: true }
                }
            }
        });
        console.log('Series.findMany success:', series.length);
    }
    catch (err) {
        console.error('Test failed:', err);
    }
    finally {
        await prisma.$disconnect();
    }
}
test();
//# sourceMappingURL=test-prisma.js.map