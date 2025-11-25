import { prisma } from '../lib/prisma.js';

export const TarjetaRepository = {
  create({ cedulaCliente, tipo, marca }) {
    const numero = Math.floor(Math.random() * 1e15).toString();
    const fechaVencimiento = new Date();
    fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + 3);

    return prisma.tarjeta.create({
      data: {
        numero,
        cedulaCliente,
        tipo,
        saldo: 0,
        fechaVencimiento
      }
    });
  },

  recargar(numeroTarjeta, monto) {
    return prisma.tarjeta.update({
      where: { numero: numeroTarjeta },
      data: {
        saldo: { increment: monto }
      }
    });
  },

  findByNumero(numeroTarjeta) {
    return prisma.tarjeta.findUnique({
      where: { numero: numeroTarjeta }
    });
  },

  debitar(numeroTarjeta, monto) {
    return prisma.tarjeta.update({
      where: { numero: numeroTarjeta },
      data: {
        saldo: { decrement: monto }
      }
    });
  },

  acreditar(numeroTarjeta, monto) {
    return prisma.tarjeta.update({
      where: { numero: numeroTarjeta },
      data: {
        saldo: { increment: monto }
      }
    });
  }
};