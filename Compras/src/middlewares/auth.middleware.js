// src/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';

export function authRequired(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const token = header.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // payload: { id, username, role }
    req.user = payload;
    next();
  } catch (err) {
    console.error('Error verificando JWT en Compras:', err);
    return res.status(401).json({ error: 'Token inválido' });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'Permiso denegado: requiere rol ' + role });
    }
    next();
  };
}