import express, { Request, Response } from 'express';
import env from './config/env';
import connectDB from './config/database';
import logger from './config/logger';
import notFound from './middlewares/not-found';
import errorHandler from './middlewares/error-handler';
import { sendSuccess } from './utils/api-response';
import swaggerSpec from './config/swagger';
import swaggerUi from 'swagger-ui-express';
import healthRoute from './routes/health.route';

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root route
app.get('/', (_req: Request, res: Response) => {
  sendSuccess(res, null, 'News Portal API is running');
});

// API routes
app.use('/api/v1', healthRoute);

// 404 handler (must be after all routes)
app.use(notFound);

// Global error handler (must be last middleware)
app.use(errorHandler);

// Connect to MongoDB and start server
const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(env.PORT, () => {
    logger.info(`Server is running on http://localhost:${env.PORT} [${env.NODE_ENV}]`);
  });
};

startServer();

export default app;
