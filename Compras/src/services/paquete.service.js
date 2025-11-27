// src/services/paquete.service.js
import { PaqueteRepository } from "../repositories/paquete.repository.js";

export const PaqueteService = {
  async crear(data) {
    // Aquí podrías meter validaciones básicas si quieres
    return PaqueteRepository.create({
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: data.precio,
      moneda: data.moneda || "COP",
      fechaIda: new Date(data.fechaIda),
      fechaRegreso: new Date(data.fechaRegreso),
    });
  },

  async listar() {
    return PaqueteRepository.findAll();
  },

  async obtenerPorId(id) {
    return PaqueteRepository.findById(id);
  },
};
