import React from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center rounded-lg bg-black/50 z-50">
      <div className="bg-white w-[60rem] max-w-full rounded-lg shadow-xl relative p-8">
        {/* Header */}
        <div className="flex justify-between justify-center items-center mb-6">
          <h2 className="text-2xl font-bold text-pink mb-4 text-center">
            {title}
          </h2>
          <button onClick={onClose} className="absolute top-2 right-5 text-2xl">
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[75vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
