// src/services/cliente.service.js
import { ClienteRepository } from '../repositories/cliente.repository.js';

export const ClienteService = {
  crear(data) {
    // podrías validar aquí si quieres
    return ClienteRepository.create(data);
  },

  listar() {
    return ClienteRepository.findAll();
  },

  obtenerPorCedula(cedula) {
    return ClienteRepository.findByCedula(cedula);
  }
};