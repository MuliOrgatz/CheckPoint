import { Server } from 'socket.io';
import { redisSubscriber } from '../redis/client';

type BookingCreatedEvent = {
  type?: 'booking.created';
  data: {
    id: number;
    userId: number;
    roomId: number;
    startTime: string;
    endTime: string;
  };
};

let isSubscribed = false;

function safeParse<T = unknown>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function initWebSocket(io: Server) {
  io.on('connection', (socket) => {
    socket.emit('welcome', { ok: true });

    socket.on('subscribeRoom', (roomId: unknown, ack?: (res: any) => void) => {
      const idNum = typeof roomId === 'number' ? roomId : Number(roomId);
      if (!Number.isFinite(idNum) || idNum <= 0) {
        ack?.({ ok: false, error: 'Invalid roomId' });
        return;
      }
      socket.join(`room:${idNum}`);
      ack?.({ ok: true, room: idNum });
    });

    socket.on(
      'unsubscribeRoom',
      (roomId: unknown, ack?: (res: any) => void) => {
        const idNum = typeof roomId === 'number' ? roomId : Number(roomId);
        if (!Number.isFinite(idNum) || idNum <= 0) {
          ack?.({ ok: false, error: 'Invalid roomId' });
          return;
        }
        socket.leave(`room:${idNum}`);
        ack?.({ ok: true, room: idNum });
      }
    );
  });

  if (!isSubscribed) {
    await redisSubscriber.subscribe('room.booked');

    redisSubscriber.on('message', (channel: string, message: string) => {
      if (channel !== 'room.booked') {
        return;
      }
      const payload = safeParse<BookingCreatedEvent>(message) || ({} as any);
      const data = payload.data || safeParse<any>(message);
      if (!data || typeof data.roomId !== 'number') {
        return;
      }

      io.emit('booking.created', data);
      io.to(`room:${data.roomId}`).emit('booking.created', data);
    });

    isSubscribed = true;
  }
}
