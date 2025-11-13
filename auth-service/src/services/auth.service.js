import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository.js';

const {
  JWT_SECRET,
  JWT_ACCESS_TTL = '15m',
  JWT_REFRESH_TTL = '7d',
  JWT_ISSUER = 'auth-service',
  JWT_AUDIENCE = 'tvp-backend'
} = process.env;

function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    {
      expiresIn: JWT_ACCESS_TTL,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE
    }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      type: 'refresh'
    },
    JWT_SECRET,
    {
      expiresIn: JWT_REFRESH_TTL,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE
    }
  );
}

export const AuthService = {
  async login({ email, password }) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      const err = new Error('Credenciales inválidas');
      err.status = 401;
      throw err;
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      const err = new Error('Credenciales inválidas');
      err.status = 401;
      throw err;
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    };
  },

  verifyToken(token) {
    return jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE
    });
  }
};