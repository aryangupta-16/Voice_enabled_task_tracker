/**
 * Modal Component
 * Reusable modal dialog with overlay
 */

'use client';

import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  actions?: React.ReactNode;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  actions,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-900/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative glass rounded-2xl shadow-2xl border border-white/30 ${sizeClasses[size]} w-full mx-4 
        animate-fadeIn`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/20 px-6 py-4 bg-gradient-to-r from-white/70 to-white/40 rounded-t-2xl">
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 transition hover-scale rounded-full p-1 hover:bg-white/60"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto bg-white/70">
          {children}
        </div>

        {/* Footer */}
        {actions && (
          <div className="border-t border-white/20 px-6 py-4 flex gap-3 justify-end bg-white/80 rounded-b-2xl">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
