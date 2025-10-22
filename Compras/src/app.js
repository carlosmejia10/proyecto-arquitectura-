import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middlewares/errorHandler.js';
import ordenRoutes from './routes/orden.routes.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/ordenes', ordenRoutes);

app.get('/health', (_, res) => res.json({ ok: true }));

app.use(errorHandler);


export default app;