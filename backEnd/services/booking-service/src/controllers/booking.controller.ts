import { randomUUID } from 'crypto';
import sequelize from '../database/db';
import Booking from '../database/models/booking';
import Room from '../database/models/room';
import { publish } from '../redis/client';
import redis from '../redis/client';
import { Op } from 'sequelize';

function startOfDayUTC(d: Date) {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  );
}
function daysBetweenUTC(start: Date, endExclusive: Date): string[] {
  const s = startOfDayUTC(start);
  const e = startOfDayUTC(endExclusive);
  const out: string[] = [];
  for (let d = s; d < e; d = new Date(d.getTime() + 24 * 60 * 60 * 1000)) {
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

async function acquireLock(key: string, ttlMs: number, value: string) {
  const ok = await redis.set(key, value, 'PX', ttlMs, 'NX');
  return ok === 'OK';
}

async function releaseLock(key: string, value: string) {
  const script = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;
  await redis.eval(script, 1, key, value);
}

export async function createBooking(params: {
  userId: number;
  roomId: number;
  start: string;
  end: string;
}) {
  const { userId, roomId, start, end } = params;

  if (!roomId || !start || !end) {
    const e: any = new Error('roomId, start, end are required');
    e.status = 400;
    throw e;
  }

  const startDate = new Date(start);
  const endDate = new Date(end);
  if (!(startDate < endDate)) {
    const e: any = new Error('Invalid date range');
    e.status = 400;
    throw e;
  }

  const dayKeys = daysBetweenUTC(startDate, endDate).map(
    (day) => `lock:room:${roomId}:day:${day}`
  );
  const lockVal = randomUUID();

  let acquiredKeys: string[] = [];
  try {
    for (const key of dayKeys) {
      const ok = await acquireLock(key, 5000, lockVal);
      if (!ok) {
        await Promise.all(acquiredKeys.map((k) => releaseLock(k, lockVal)));
        const e: any = new Error(
          'Room is being booked for one of the selected days, try again'
        );
        e.status = 409;
        throw e;
      }
      acquiredKeys.push(key);
    }
  } catch (err) {
    throw err;
  }

  await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    const room = await Room.findByPk(roomId);
    if (!room) {
      const e: any = new Error('Room not found');
      e.status = 404;
      throw e;
    }

    return await sequelize.transaction(async (t) => {
      const overlapRows = await Booking.findOne({
        where: {
          roomId,
          status: 'confirmed',
          startTime: { [Op.lt]: endDate },
          endTime: { [Op.gt]: startDate },
        },
        transaction: t,
      });

      if (overlapRows) {
        const e: any = new Error('Room not available for selected time');
        e.status = 409;
        throw e;
      }

      const booking = await Booking.create(
        {
          userId,
          roomId,
          startTime: startDate,
          endTime: endDate,
          status: 'confirmed',
        },
        { transaction: t }
      );

      await publish('room.booked', {
        type: 'booking.created',
        data: {
          id: booking.id,
          userId,
          roomId,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });

      return booking;
    });
  } finally {
    await Promise.all(dayKeys.map((key) => releaseLock(key, lockVal)));
  }
}

export async function getUpcomingBookingsForUser(userId: number) {
  const today = new Date();
  return await Booking.findAll({
    where: {
      userId,
      status: 'confirmed',
      startTime: { [Op.gte]: today }, // Only future bookings
    },
    include: [
      {
        model: Room,
        as: 'room',
        attributes: ['id', 'name', 'location', 'pricePerNight'],
      },
    ],
    order: [['startTime', 'ASC']],
  });
}
