import { prisma } from '../lib/prisma.js';

export const ClienteRepository = {
  create(data) {
    return prisma.cliente.create({ data });
  },

  findAll() {
    return prisma.cliente.findMany();
  },

  findByCedula(cedula) {
    return prisma.cliente.findUnique({
      where: { cedula }
    });
  }
};