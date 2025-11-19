import express from 'express';
import cors from 'cors';
import planRoutes from './routes/planRoutes';
import { config } from './config';

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use('/api', planRoutes);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[unhandled]', err);
  res.status(500).json({ message: err.message });
});

app.listen(config.port, () => {
  console.log(`Backend listening on port ${config.port}`);
});

