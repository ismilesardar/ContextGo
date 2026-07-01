import { DIRECT_URL, NODE_ENV } from '@/config/url.config';
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: DIRECT_URL!
});

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter
  });

if (NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
