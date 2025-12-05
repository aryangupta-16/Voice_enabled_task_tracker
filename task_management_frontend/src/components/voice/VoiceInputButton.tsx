/**
 * Voice Input Button Component
 * Handles voice recording with visual feedback
 */

'use client';

import React, { useEffect, useState } from 'react';

interface VoiceInputButtonProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
  isParsing?: boolean;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  isRecording,
  onStart,
  onStop,
  disabled = false,
  isParsing = false,
}) => {
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSupported('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    }
  }, []);

  if (!isSupported) {
    return (
      <button
        disabled
        className="px-4 py-2.5 bg-gray-200 text-gray-500 rounded-xl cursor-not-allowed flex items-center gap-2 shadow-sm"
        title="Speech Recognition not supported"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4"
          />
        </svg>
        <span className="text-sm">Voice Not Available</span>
      </button>
    );
  }

  if (isParsing) {
    return (
      <button
        disabled
        className="px-4 py-2.5 rounded-full font-semibold flex items-center gap-2 transition-all duration-200 
          bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm cursor-not-allowed"
        title="Processing voice input..."
      >
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-sm">Processing...</span>
      </button>
    );
  }

  return (
    <button
      onClick={isRecording ? onStop : onStart}
      disabled={disabled}
      className={`px-4 py-2.5 rounded-full font-semibold flex items-center gap-2 transition-all duration-200 
        shadow-sm hover:shadow-md hover:-translate-y-0.5
        ${
          isRecording
            ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white animate-pulse'
            : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white'
        }
        disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-sm disabled:hover:translate-y-0`}
      title={isRecording ? 'Stop recording' : 'Start recording'}
    >
      {isRecording ? (
        <>
          <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow-sm" />
          <span className="text-sm">Stop Recording</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 012-2h4a1 1 0 010 2H6v10a2 2 0 11-4 0V4zm2-2a1 1 0 100 2 1 1 0 000-2zm9 0a1 1 0 010 2H9a1 1 0 010-2h6zm0 4a1 1 0 110 2H9a1 1 0 110-2h6zM4 12a2 2 0 104 0 2 2 0 00-4 0z" />
          </svg>
          <span className="text-sm">Start Recording</span>
        </>
      )}
    </button>
  );
};
