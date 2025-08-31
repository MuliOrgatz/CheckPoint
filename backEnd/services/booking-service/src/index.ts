import express from 'express';
import { json } from 'body-parser';
import rateLimiterMiddleware from './middleware/rateLimiter';
import errorHandler from './middleware/errorHandler';
import indexRouter from './routes/index';
import authMiddleware from './middleware/auth';
import { setupSwagger } from './docs/swagger';
import { initRedis } from './redis/client';
import cors from 'cors';
import { initWebSocket } from './socket/socket';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
app.use(json());
app.use(cors());
app.use(['/room', '/booking'], rateLimiterMiddleware);

//middleware auth
app.use((req, res, next) => {
  if (req.path.includes('/api-docs')) {
    return next();
  } else {
    authMiddleware(req, res, next);
  }
});

app.use('/', indexRouter);
app.use(errorHandler);
setupSwagger(app);

initRedis();

const PORT = process.env.PORT || 3002;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust as needed for your frontend
  },
});
initWebSocket(io);

server.listen(PORT, () => {
  console.log(`Booking Service running on port ${PORT}`);
  console.log(`Socket.IO running at ws://localhost:${PORT}`);
});
