import type {
  BookingPayload,
  BookingResponse,
  UpcomingBooking,
} from '../models/Booking';
import { post, get } from './api';
import { GET_UPCOMING_BOOKINGS, POST_BOOK_ROOM } from './endpoints';

export async function bookRoom(
  payload: BookingPayload
): Promise<BookingResponse> {
  return post<BookingResponse, BookingPayload>(POST_BOOK_ROOM, payload);
}

export async function fetchUserBookings(
  userId: number
): Promise<UpcomingBooking[]> {
  return get<UpcomingBooking[]>(`${GET_UPCOMING_BOOKINGS}/${userId}`);
}
