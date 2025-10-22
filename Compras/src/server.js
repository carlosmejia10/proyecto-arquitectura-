import app from './app.js';
import { logger } from './lib/logger.js';
import { connectRabbit } from './lib/amqp.js';
import { prisma } from './lib/prisma.js';

await connectRabbit();

const port = process.env.PORT || 8083;

async function bootstrap() {
  try {
    await prisma.$connect();
    await connectRabbit();
    app.listen(port, () => logger.info(`Compras service en puerto ${port}`));
  } catch (err) {
    logger.error({ err }, 'Error iniciando servicio');
    process.exit(1);
  }
}

bootstrap();