import type { Room } from '../../models/Room';
import { Button } from '../ui/Button';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bookRoomThunk } from '../../store/slices/roomSlice';
import type { AppDispatch, RootState } from '../../store';
import BookingModal from '../modals/BookingModal';

export default function RoomCard({
  room,
  img,
  className,
}: {
  room: Room;
  img?: string;
  className?: string;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { startDate, endDate } = useSelector((state: RootState) => state.rooms);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Calculate number of nights
  const nights =
    startDate && endDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 1;
  const finalPrice = nights * room.pricePerNight;

  const handleBook = async () => {
    setError('');
    setLoading(true);
    try {
      await dispatch(
        bookRoomThunk({
          roomId: room.id,
          start: new Date(startDate),
          end: new Date(endDate),
        })
      ).unwrap();
      setSuccess(true);
    } catch (err: unknown) {
      let errorMessage = 'Booking failed. Please try again.';
      if (
        typeof err === 'object' &&
        err !== null &&
        'message' in err &&
        typeof (err as { message?: string }).message === 'string'
      ) {
        errorMessage =
          (err as { message: string }).message ===
          'Room not available for selected time'
            ? 'This room is not available for the selected dates. Please choose different dates.'
            : (err as { message: string }).message;
      }
      setError(errorMessage);
      setSuccess(false);
    }
    setLoading(false);
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between ${className}`}
    >
      {img && (
        <img
          src={img}
          alt={room.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      <div>
        <h3 className="text-xl font-semibold text-pink mb-2">{room.name}</h3>
        <p className="text-gray-600 mb-1">
          <span className="font-medium">Location:</span> {room.location}
        </p>
        <p className="text-gray-800 mb-4">
          <span className="font-medium">Price per night:</span> $
          {room.pricePerNight}
        </p>
      </div>
      <Button
        onClick={() => setModalOpen(true)}
        variant="pink"
        size="wide"
        disabled={loading}
      >
        Book
      </Button>
      {modalOpen && (
        <BookingModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setError('');
            setSuccess(false);
            setLoading(false);
          }}
          roomName={room.name}
          nights={nights}
          pricePerNight={room.pricePerNight}
          finalPrice={finalPrice}
          error={error}
          loading={loading}
          success={success}
          onConfirm={handleBook}
        />
      )}
    </div>
  );
}
