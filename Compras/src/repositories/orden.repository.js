import { prisma } from '../db/prisma.js';

export const OrdenRepository = {
  create: (data) => prisma.ordenCompra.create({ data }),
  findById: (id) => prisma.ordenCompra.findUnique({ where: { id } }),
  update: (id, data) => prisma.ordenCompra.update({ where: { id }, data }),
  findAll: () => prisma.ordenCompra.findMany({ orderBy: { createdAt: 'desc' } })
};