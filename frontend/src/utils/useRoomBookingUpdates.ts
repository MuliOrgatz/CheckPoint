import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Room } from '../models/Room';

const SOCKET_URL = 'http://localhost:3002';

let socket: Socket | null = null;

export function useRoomBookingUpdates(
  rooms: Room[],
  setRooms: (rooms: Room[]) => void
) {
  useEffect(() => {
    if (!socket) {
      socket = io(SOCKET_URL);
    }

    const handleBookingCreated = (data: { roomId: number }) => {
      setRooms((prevRooms) =>
        prevRooms.filter((room) => room.id !== data.roomId)
      );
    };

    socket.on('booking.created', handleBookingCreated);

    return () => {
      socket?.off('booking.created', handleBookingCreated);
    };
  }, [setRooms]);
}
