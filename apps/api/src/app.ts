import path from 'path';
import { AppError } from './utils/app-error';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env';
import rootRouter from './routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(cookieParser());
app.use(morgan('dev'));

// Main API routes
app.use(rootRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Not Found' });
});

// Centralized error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (err instanceof AppError) {
    const response: any = { message: err.message };

    if (env.NODE_ENV === 'development' && err.stack) {
      response.stack = err.stack;
    }

    res.status(err.statusCode).json(response);
  } else {
    const response: any = { message: 'Internal Server Error' };

    if (env.NODE_ENV === 'development' && err.stack) {
      response.stack = err.stack;
    }

    res.status(500).json(response);
  }
});

export default app;