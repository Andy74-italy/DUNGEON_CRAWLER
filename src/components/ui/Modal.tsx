/**
 * components/ui/Modal.tsx – Reusable modal with glassmorphism backdrop.
 */

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  /** If true, clicking outside the modal does NOT close it */
  persistent?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZE_CLASSES: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  persistent = false,
  className = '',
  size = 'md',
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen || persistent) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose, persistent]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dungeon-950/80 backdrop-blur-sm"
        onClick={persistent ? undefined : onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={[
          'relative w-full glass rounded-xl border border-dungeon-600/50 shadow-2xl',
          'animate-[fade-up_0.3s_ease-out]',
          SIZE_CLASSES[size],
          className,
        ].join(' ')}
      >
        {/* Header */}
        {(title || onClose) && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-dungeon-700/50">
            {title && (
              <h2 className="font-display text-base font-semibold text-dungeon-100 tracking-wide">
                {title}
              </h2>
            )}
            {onClose && !persistent && (
              <button
                onClick={onClose}
                className="ml-auto p-1.5 rounded-md text-dungeon-400 hover:text-dungeon-200 hover:bg-dungeon-700/50 transition-colors"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
