import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import clientesRoutes from './routes/clientes.routes.js';
import paquetesRoutes from './routes/paquetes.routes.js';
import tarjetasRoutes from './routes/tarjetas.routes.js';
import carritoRoutes from './routes/carrito.routes.js';
import transaccionesRoutes from './routes/transacciones.routes.js';
import ordenesRoutes from './routes/ordenes.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/clientes', clientesRoutes);
app.use('/api/paquetes', paquetesRoutes);
app.use('/api/tarjetas', tarjetasRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/transacciones', transaccionesRoutes);
app.use('/api/ordenes', ordenesRoutes);

export default app;