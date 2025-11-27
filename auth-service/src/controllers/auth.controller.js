// src/controllers/auth.controller.js
import { AuthService } from '../services/auth.service.js';

export const AuthController = {
  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'username y password son requeridos' });
      }

      const result = await AuthService.login({ username, password });

      return res.status(200).json({
        message: 'Login exitoso',
        token: result.token,
        role: result.role,
        username: result.username
      });
    } catch (err) {
      console.error('Error en login:', err);
      return res.status(err.status || 500).json({
        error: err.message || 'Error en autenticación'
      });
    }
  }
};