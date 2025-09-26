
import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" 
      onClick={onClose}
    >
      <div 
        className="bg-neutral-100 dark:bg-neutral-900 rounded-lg shadow-2xl p-6 w-full max-w-lg mx-4 relative transform transition-all duration-300 ease-out scale-95"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-neutral-300 dark:border-neutral-700 pb-3 mb-4">
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
            aria-label="Close modal"
          >
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;