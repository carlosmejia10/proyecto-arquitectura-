import { prisma } from '../lib/prisma.js';

export const TransaccionRepository = {
  async create({ cedulaCliente, numeroTarjeta, total, estado, items }) {
    return prisma.transaccion.create({
      data: {
        cedulaCliente,
        numeroTarjeta,
        total,
        estado,
        items: {
          create: items.map(i => ({
            paqueteId: i.paqueteId,
            cantidad: i.cantidad,
            precioUnitario: i.precioUnitario,
            subtotal: i.subtotal
          }))
        }
      },
      include: { items: true }
    });
  },

  findAll() {
    return prisma.transaccion.findMany({
      include: { items: true }
    });
  },

  findById(id) {
    return prisma.transaccion.findUnique({
      where: { id: Number(id) },
      include: { items: true }
    });
  },

  updateEstado(id, estado) {
    return prisma.transaccion.update({
      where: { id: Number(id) },
      data: { estado },
      include: { items: true }
    });
  }
};