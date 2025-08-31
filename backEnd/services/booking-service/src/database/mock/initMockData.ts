import Room from '../models/room';
import Booking from '../models/booking';
import { roomsMock } from './roomsMock';
import { bookingsMock } from './bookingsMock';

export async function initMockData() {
  await Room.sync({ force: true });
  await Booking.sync({ force: true });

  await Room.bulkCreate(
    roomsMock.map((room) => ({
      ...room,
    }))
  );

  await Booking.bulkCreate(
    bookingsMock.map((booking) => ({
      ...booking,
      startTime: new Date(booking.startTime),
      endTime: new Date(booking.endTime),
    }))
  );

  console.log('Mock data inserted!');
  process.exit(0);
}

initMockData();
