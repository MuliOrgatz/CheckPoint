import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { getUserBookings } from '../store/slices/roomSlice';
import { getUserIdFromLocal } from '../utils/authHelpers';
import { formatDate } from '../utils/dateHelpers';

export default function BookingPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { userBookings, loading } = useSelector(
    (state: RootState) => state.rooms
  );

  const userId = getUserIdFromLocal();

  useEffect(() => {
    if (userId) {
      dispatch(getUserBookings(userId));
    }
  }, [dispatch, userId]);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-3xl font-bold text-pink mb-8 text-center flex items-center justify-center gap-2">
        <img src="/assets/calendar.svg" alt="calendar" className="w-8 h-8" />
        My Bookings
      </h2>
      {loading && <div className="text-center text-gray-500">Loading...</div>}
      {!loading && userBookings.length === 0 && (
        <div className="text-center text-gray-400 text-lg py-12">
          No bookings found.
        </div>
      )}
      <ul className="space-y-6">
        {userBookings.map((booking) => (
          <li
            key={booking.id}
            className="bg-white rounded-xl shadow-lg gap-10 p-6 flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <img src="/assets/room.svg" alt="Room" className="w-10 h-10" />
              <div>
                <div className="font-bold text-xl text-pink">
                  {booking.room.name}
                </div>
                <div className="text-gray-400 text-sm">
                  {booking.room.location}
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  Status:{' '}
                  <span
                    className={`font-semibold ${
                      booking.status === 'confirmed'
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:items-end gap-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">From:</span>
                <span className="bg-pink/10 text-pink px-3 py-1 rounded-lg font-semibold">
                  {formatDate(booking.startTime)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">To:</span>
                <span className="bg-pink/10 text-pink px-3 py-1 rounded-lg font-semibold">
                  {formatDate(booking.endTime)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
