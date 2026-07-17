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
import authRoute from './routes/auth.route';
import userRoute from './routes/user.route';
import authorRequestRoute from './routes/author-request.route';
import categoryRoute from './routes/category.route';
import articleRoute from './routes/article.route';
import path from 'path';
import cors from 'cors';

const app = express();

// CORS middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root route
app.get('/', (_req: Request, res: Response) => {
  sendSuccess(res, null, 'News Portal API is running');
});

// API routes
app.use('/api/v1', healthRoute);
app.use('/api/v1', authRoute);
app.use('/api/v1', authorRequestRoute);
app.use('/api/v1', userRoute);
app.use('/api/v1', categoryRoute);
app.use('/api/v1', articleRoute);

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
