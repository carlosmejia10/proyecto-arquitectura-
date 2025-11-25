import { prisma } from '../lib/prisma.js';

export const PaqueteRepository = {
  create(data) {
    return prisma.paquete.create({ data });
  },

  findAll() {
    return prisma.paquete.findMany();
  },

  findById(id) {
    return prisma.paquete.findUnique({
      where: { id: Number(id) }
    });
  }
};