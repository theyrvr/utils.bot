import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from '../utils/logger';
import configRouter from './routes/config';
import ticketRouter from './routes/tickets';
import menuRouter from './routes/menus';
import messageRouter from './routes/messages';
import webhookRouter from './routes/webhooks';
import logRouter from './routes/logs';

dotenv.config();

export class APIServer {
  public app: Express;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3001', 10);
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('user-agent'),
      });
      next();
    });
  }

  private setupRoutes(): void {
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    this.app.use('/api/config', configRouter);
    this.app.use('/api/tickets', ticketRouter);
    this.app.use('/api/menus', menuRouter);
    this.app.use('/api/messages', messageRouter);
    this.app.use('/api/webhooks', webhookRouter);
    this.app.use('/api/logs', logRouter);
  }

  private setupErrorHandling(): void {
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      logger.error('API Error:', err);
      res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
    });
  }

  public start(): void {
    this.app.listen(this.port, () => {
      logger.info(`API server listening on port ${this.port}`);
    });
  }
}
