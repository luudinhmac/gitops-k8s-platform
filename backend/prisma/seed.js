"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_client_1 = require("../generated/prisma-client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new prisma_client_1.PrismaClient();
async function main() {
    console.log('--- SEEDING SETTINGS ---');
    const settings = [
        { key: 'maintenance_global', value: 'false', group: 'maintenance', is_public: true },
        { key: 'maintenance_posts', value: 'false', group: 'maintenance', is_public: true },
        { key: 'maintenance_comments', value: 'false', group: 'maintenance', is_public: true },
        { key: 'maintenance_passcode', value: '123456', group: 'maintenance', is_public: false },
        { key: 'stats_total_visits', value: '0', group: 'stats', is_public: true },
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
//# sourceMappingURL=seed.js.map