import { Button } from '../ui/Button';
import Modal from '../ui/Modal';

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
  nights: number;
  pricePerNight: number;
  finalPrice: number;
  error?: string;
  loading?: boolean;
  success?: boolean;
  onConfirm: () => void;
};

export default function BookingModal({
  isOpen,
  onClose,
  roomName,
  nights,
  pricePerNight,
  finalPrice,
  error,
  loading,
  success,
  onConfirm,
}: BookingModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Book ${roomName}`}>
      <div
        className="flex flex-col items-center justify-center w-full h-full px-8 py-8"
        role="dialog"
        aria-modal="true"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <img
              src="/assets/loader2.svg"
              alt="Booking denied"
              className="w-16 h-16 mb-4"
            />
            <div className="text-pink text-center text-xl font-bold">
              Booking...
            </div>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center justify-center py-8">
            <img
              src="/assets/approved.svg"
              alt="Booking approved"
              className="w-16 h-16 mb-4"
            />
            <div className="text-green-500 text-center text-xl font-bold">
              Booking confirmed!
            </div>
            <div className="text-gray-400 mt-2 text-center">
              Your room is reserved. We look forward to seeing you!
            </div>
            <Button className="mt-6" variant="pink" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8">
            <svg
              className="w-16 h-16 mb-4 text-red-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="currentColor"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 15l8-8M8 8l8 8"
                stroke="white"
                strokeWidth="2"
              />
            </svg>
            <div className="text-red-500 text-center text-xl font-bold">
              {error}
            </div>
            <Button className="mt-6" variant="pink" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-xl font-bold text-pink mb-4">
              Are you sure you want to book this room?
            </div>
            <div className="text-gray-700 mb-2">
              <span className="font-semibold">Number of nights:</span> {nights}
            </div>
            <div className="text-gray-700 mb-2">
              <span className="font-semibold">Price per night:</span> $
              {pricePerNight}
            </div>
            <div className="text-lg font-bold text-green-600 mb-6">
              Final Price: ${finalPrice}
            </div>
            <Button
              className="mt-2"
              variant="pink"
              onClick={onConfirm}
              disabled={loading}
            >
              Confirm Booking
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
