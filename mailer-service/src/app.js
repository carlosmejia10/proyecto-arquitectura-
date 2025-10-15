import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import emailRoutes from './routes/email.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', emailRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use(errorHandler);
export default app;