import express, { Application, Request, Response } from 'express';
import { Database } from './infrastructure/database/database';
import { Container } from './container';

export class App {
  private app: Application;
  private database: Database;
  private container: Container;

  constructor() {
    this.app = express();
    this.database = Database.getInstance();
    this.container = Container.getInstance();
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  private setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // API routes
    this.app.use('/api/users', this.container.userRoutes.getRouter());

    // 404 handler
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({ error: 'Route not found' });
    });
  }

  private setupErrorHandler(): void {
    this.app.use((error: Error, req: Request, res: Response, next: any) => {
      console.error('Unhandled error:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
  }

  async start(port: number = 3000): Promise<void> {
    try {
      await this.database.connect();
      
      this.app.listen(port, () => {
        console.log(`🚀 Server running on http://localhost:${port}`);
        console.log(`📊 Health check: http://localhost:${port}/health`);
        console.log(`👥 Users API: http://localhost:${port}/api/users`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  getApp(): Application {
    return this.app;
  }
}
