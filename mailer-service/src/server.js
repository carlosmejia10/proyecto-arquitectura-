import app from './app.js';
import { verifyTransport } from './lib/mailer.js';
import { connectRabbit, setupComprasBindings } from './lib/amqp.js';
import { startComprasConsumer } from './workers/compras.consumer.js';
import { logger } from './lib/logger.js';


const port = process.env.PORT || 4000;

app.listen(port, async () => {
  logger.info(`Mailer service escuchando en :${port}`);
  await verifyTransport();
  await connectRabbit();
  await setupComprasBindings();
  await startComprasConsumer();
});