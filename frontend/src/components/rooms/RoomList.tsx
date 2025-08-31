import { useEffect, useState } from 'react';
import {
  getRooms,
  setStartDate,
  setEndDate,
} from '../../store/slices/roomSlice';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import RoomCard from './RoomCard';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../ui/SearchBar';
import { getToday, getNextDay } from '../../utils/dateHelpers';
import { useRoomBookingUpdates } from '../../utils/useRoomBookingUpdates';

const ROOM_IMAGES = [
  '/assets/rooms/1.jpeg',
  '/assets/rooms/2.jpeg',
  '/assets/rooms/3.webp',
  '/assets/rooms/4.jpg',
  '/assets/rooms/5.jpg',
  '/assets/rooms/6.jpeg',
];

const ROOMS_PER_PAGE = 6;

export default function RoomList() {
  const dispatch = useDispatch<AppDispatch>();
  const { roomsResponse, loading, startDate, endDate } = useSelector(
    (state: RootState) => state.rooms
  );
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    setRooms(roomsResponse.rooms);
  }, [roomsResponse.rooms]);

  useRoomBookingUpdates(rooms, setRooms);

  useEffect(() => {
    dispatch(
      getRooms({
        limit: ROOMS_PER_PAGE,
        offset: (page - 1) * ROOMS_PER_PAGE,
        text: searchTerm.trim() || undefined,
        start: startDate || undefined,
        end: endDate || undefined,
      })
    );
  }, [dispatch, page, searchTerm, startDate, endDate]);

  const totalPages = Math.ceil(roomsResponse.total / ROOMS_PER_PAGE);

  const handleStartDateChange = (value: string) => {
    dispatch(setStartDate(value));
    if (!endDate || value >= endDate) {
      dispatch(setEndDate(getNextDay(value)));
    }
  };

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h2 className="text-3xl font-bold text-pink mb-6 text-center">
        Available Rooms
      </h2>
      <div className="flex flex-col items-center mb-8">
        <div className="w-full max-w-2xl flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
          <div className="flex gap-2 w-full md:w-auto items-center">
            <label className="flex flex-col text-gray-700 font-medium">
              <span className="text-xs mb-1">Start Date</span>
              <input
                type="date"
                className="border border-pink rounded-[2.25rem] px-4 py-2 text-sm h-[40px] focus:outline-none focus:ring-2 focus:ring-pink"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                min={getToday()}
              />
            </label>
            <label className="flex flex-col text-gray-700 font-medium">
              <span className="text-xs mb-1">End Date</span>
              <input
                type="date"
                className="border border-pink rounded-[2.25rem] px-4 py-2 text-sm h-[40px] focus:outline-none focus:ring-2 focus:ring-pink"
                value={endDate}
                onChange={(e) => dispatch(setEndDate(e.target.value))}
                min={startDate}
              />
            </label>
          </div>
        </div>
      </div>
      {loading && (
        <div className="flex justify-center items-center py-10">
          <span className="text-lg text-gray-500">Loading...</span>
        </div>
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={page + searchTerm + startDate + endDate}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
        >
          {rooms.slice(0, ROOMS_PER_PAGE).map((room, idx) => (
            <RoomCard
              key={room.id}
              room={room}
              img={ROOM_IMAGES[idx % ROOM_IMAGES.length]}
              className="h-[400px] w-full"
            />
          ))}
        </motion.div>
      </AnimatePresence>
      {!loading && roomsResponse.rooms.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          No rooms available at the moment.
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-4">
          <button
            className="px-4 py-2 rounded bg-pink text-white disabled:bg-gray"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="px-4 py-2 text-lg font-semibold text-pink">
            Page {page} of {totalPages}
          </span>
          <button
            className="px-4 py-2 rounded bg-pink text-white disabled:bg-gray"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
