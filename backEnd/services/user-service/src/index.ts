import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import indexRouter from './routes/index';
import errorHandler from './middleware/errorHandler';
import rateLimiterMiddleware from './middleware/rateLimiter';
import { setupSwagger } from './docs/swagger';
import { initRedis } from './redis/client';

const app = express();
app.use(json());
app.use(cors());
app.use(['/user', '/auth'], rateLimiterMiddleware);
app.use('/', indexRouter);
app.use(errorHandler);

setupSwagger(app);
initRedis();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
