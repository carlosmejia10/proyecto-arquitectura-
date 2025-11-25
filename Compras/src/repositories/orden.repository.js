import { prisma } from '../lib/prisma.js';

export const OrdenRepository = {
  create(data) {
    return prisma.ordenCompra.create({ data });
  },

  update(id, data) {
    return prisma.ordenCompra.update({
      where: { id },
      data
    });
  },

  findById(id) {
    return prisma.ordenCompra.findUnique({
      where: { id }
    });
  },

  findAll() {
    return prisma.ordenCompra.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }
  
};