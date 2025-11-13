import jwt from 'jsonwebtoken';

const {
  JWT_SECRET,
  JWT_ISSUER = 'auth-service',
  JWT_AUDIENCE = 'tvp-backend'
} = process.env;

export function authRequired(req, res, next) {
  const header = req.headers['authorization'] || '';
  const [, token] = header.split(' '); // "Bearer xxx"

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE
    });

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

// Para endpoints que requieren rol específico
export function hasRole(...roles) {
  return function (req, res, next) {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    next();
  };
}