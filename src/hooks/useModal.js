import { useState, useCallback } from 'react';

export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [data, setData] = useState(null);

  const open = useCallback((modalData = null) => {
    if (modalData) setData(modalData);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Delay clearing data to let Framer Motion finish fade-out animations
    setTimeout(() => {
      setData(null);
    }, 200);
  }, []);

  return { isOpen, data, open, close };
};
