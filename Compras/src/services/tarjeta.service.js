
// src/services/tarjeta.service.js
import { TarjetaRepository } from '../repositories/tarjeta.repository.js';

export const TarjetaService = {
  async crear(data) {
    // Asignar tarjeta a un cliente
    // Si en el repo generas el número y la fecha, aquí solo pasas cedula + tipo
    return TarjetaRepository.create({
      cedulaCliente: data.cedulaCliente,
      tipo: data.tipoTarjeta, // 'CREDITO' | 'DEBITO'
      marca: data.marca || 'VISA'
    });
  },

  async recargar({ numeroTarjeta, monto }) {
    // Podrías validar que monto > 0
    return TarjetaRepository.recargar(numeroTarjeta, monto);
  },

  async obtenerPorNumero(numeroTarjeta) {
    return TarjetaRepository.findByNumero(numeroTarjeta);
  },

  async debitar(numeroTarjeta, monto) {
    return TarjetaRepository.debitar(numeroTarjeta, monto);
  },

  async acreditar(numeroTarjeta, monto) {
    return TarjetaRepository.acreditar(numeroTarjeta, monto);
  }
};