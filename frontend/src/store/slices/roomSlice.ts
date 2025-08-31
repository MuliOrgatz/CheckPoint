import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchRooms } from '../../services/room.service';
import type { RoomResponse } from '../../models/Room';
import { bookRoom, fetchUserBookings } from '../../services/booking.service';
import type { BookingPayload, UpcomingBooking } from '../../models/Booking';
import { getToday, getTomorrow } from '../../utils/dateHelpers';

export const getRooms = createAsyncThunk(
  'rooms/getRooms',
  async (params?: { limit?: number; offset?: number }) => {
    return await fetchRooms(params);
  }
);

export const bookRoomThunk = createAsyncThunk(
  'rooms/bookRoom',
  async (payload: BookingPayload) => {
    return await bookRoom(payload);
  }
);

export const getUserBookings = createAsyncThunk(
  'rooms/getUserBookings',
  async (userId: number) => {
    return await fetchUserBookings(userId);
  }
);

interface RoomState {
  roomsResponse: RoomResponse;
  loading: boolean;
  error: string | null;
  hasBooking: boolean;
  userBookings: UpcomingBooking[];
  startDate: string;
  endDate: string;
}

const initialState: RoomState = {
  roomsResponse: {
    rooms: [],
    total: 0,
  },
  loading: false,
  error: null,
  hasBooking: false,
  userBookings: [],
  startDate: getToday(),
  endDate: getTomorrow(),
};

const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setStartDate(state, action) {
      state.startDate = action.payload;
    },
    setEndDate(state, action) {
      state.endDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.roomsResponse = action.payload;
      })
      .addCase(getRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch rooms';
      })
      .addCase(bookRoomThunk.fulfilled, (state, action) => {
        const payload = action.payload;
        state.hasBooking = state.roomsResponse.rooms.some(
          (r) => r.id === payload.booking.roomId
        );
      })
      .addCase(getUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.userBookings = action.payload;
      })
      .addCase(getUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch bookings';
      });
  },
});

export const { setStartDate, setEndDate } = roomSlice.actions;
export default roomSlice.reducer;
