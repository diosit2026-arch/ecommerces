import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const MotionDiv = motion.div;

const Modal = ({ isOpen, onClose, title, children, showCloseBtn = true }) => {
  // Lock body scroll when modal is active
  React.useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <MotionDiv
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="bg-surface rounded-xl shadow-2xl w-full max-w-lg overflow-hidden pointer-events-auto border border-gray-700"
            >
              <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">{title}</h2>
                {showCloseBtn && (
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-800"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              <div className="p-6">
                {children}
              </div>
            </MotionDiv>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
