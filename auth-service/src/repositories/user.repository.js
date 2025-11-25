import { prisma } from '../lib/prisma.js';

export const UserRepository = {
  findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }
};