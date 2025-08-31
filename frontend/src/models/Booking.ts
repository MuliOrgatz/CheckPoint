import type { Room } from './Room';

export interface BookingPayload {
  roomId: number;
  start: Date;
  end: Date;
}

export interface BookingResponse {
  booking: {
    id: number;
    userId: number;
    roomId: number;
    startTime: string;
    endTime: string;
    status: string;
    updatedAt: string;
    createdAt: string;
  };
}

export interface UpcomingBooking {
  id: number;
  userId: number;
  roomId: number;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  room: Room;
}

export type UpcomingBookingsResponse = UpcomingBooking[];
