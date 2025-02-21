import { PrismaClient } from '@prisma/client';

// Export prisma client to access the connected db throughout the backend
export const prisma = new PrismaClient();
