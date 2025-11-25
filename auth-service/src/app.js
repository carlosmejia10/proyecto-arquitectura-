// src/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';

dotenv.config(); // Carga variables de entorno desde .env

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
app.use('/auth', authRoutes);

// Puerto desde .env o fallback
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Auth service escuchando en el puerto ${PORT}`);
});