import { prisma } from '../lib/prisma.js';

export const CarritoRepository = {
  addItem({ cedulaCliente, paqueteId, cantidad }) {
    return prisma.carritoItem.create({
      data: {
        cedulaCliente,
        paqueteId: Number(paqueteId),
        cantidad: Number(cantidad)
      }
    });
  },

  findByCliente(cedulaCliente) {
    return prisma.carritoItem.findMany({
      where: { cedulaCliente },
      include: { paquete: true }
    });
  },

  clearByCliente(cedulaCliente) {
    return prisma.carritoItem.deleteMany({
      where: { cedulaCliente }
    });
  }
};