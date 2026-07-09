import { useState, useCallback } from 'react';
import { modals } from '../data/modalContent';
import type { ModalContent } from '../data/types';

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ModalContent | null>(null);

  const openModal = useCallback((key: string) => {
    const modal = modals[key];
    if (modal) {
      setContent(modal);
      setIsOpen(true);
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setContent(null);
  }, []);

  return { isOpen, content, openModal, closeModal };
}
