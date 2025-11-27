import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { users } from '../models/user.model.js';

export const AuthService = {
  async login({ username, password }) {
    const user = users.find(u => u.username === username);
    if (!user) throw new Error('Usuario no existe');

    const ok = (password === '12345'); // mock simplificado

    if (!ok) throw new Error('Credenciales inválidas');

    // JWT expiry: use JWT_ACCESS_TTL (e.g. '15m') or fallback to a sensible default.
    const expiresIn = process.env.JWT_ACCESS_TTL || process.env.JWT_EXPIRES || '15m';

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no está definido en las variables de entorno');
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    return { token, role: user.role };
  }
};