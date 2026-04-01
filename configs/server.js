import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from '../src/auth/auth.routes.js';

export function createServer() {
  const app = express();
  app.use(cors());
  app.use(helmet({ crossOriginOpenerPolicy: false }));
  app.use(express.json({ limit: '15mb' }));
  app.use(morgan('dev'));

  app.get('/api/health', (_req, res) => res.json({ success: true, message: 'SenGarage backend ok' }));
  app.use('/api/v1/auth', authRoutes);

  app.use((error, _req, res, _next) => {
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  });

  return app;
}
