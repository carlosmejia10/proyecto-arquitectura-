import { LoginDTO } from '../dtos/auth.dto.js';
import { AuthService } from '../services/auth.service.js';

export const AuthController = {
  async login(req, res, next) {
    try {
      const dto = new LoginDTO(req.body);
      const data = await AuthService.login(dto);
      res.json(data); // user + tokens
    } catch (err) {
      next(err);
    }
  }
};