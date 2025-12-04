/**
 * Custom Hook for Voice Input
 * Manages voice recording, transcription, and parsing
 */

'use client';

import { useState, useCallback } from 'react';
import { VoiceParseResponse, CreateTaskFromVoiceDTO, Task } from '@/types';
import { voiceService, APIError } from '@/services/api';
import { voiceRecognitionService } from '@/services/voiceRecognition';

interface UseVoiceReturn {
  isRecording: boolean;
  transcript: string;
  isParsingVoice: boolean;
  parsedData: VoiceParseResponse | null;
  error: string | null;
  startRecording: () => void;
  stopRecording: () => void;
  parseTranscript: (transcript: string) => Promise<VoiceParseResponse | null>;
  createTaskFromVoice: (data: CreateTaskFromVoiceDTO) => Promise<Task | null>;
  resetVoiceState: () => void;
  clearError: () => void;
  isVoiceSupported: boolean;
}

/**
 * Hook for managing voice input and parsing
 */
export const useVoice = (): UseVoiceReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isParsingVoice, setIsParsingVoice] = useState(false);
  const [parsedData, setParsedData] = useState<VoiceParseResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isVoiceSupported = voiceRecognitionService.isSupported();

  const startRecording = useCallback(() => {
    if (!isVoiceSupported) {
      setError('Speech Recognition not supported in this browser');
      return;
    }

    console.log('Starting recording');

    setError(null);
    setTranscript('');
    setIsRecording(true);

    voiceRecognitionService.startRecording(
      (result: string, isFinal: boolean) => {
        setTranscript(result);
      },
      (err: string) => {
        alert(err);
        setError(err);
        setIsRecording(false);
      }
    );
  }, [isVoiceSupported]);

  const stopRecording = useCallback(() => {
    voiceRecognitionService.stopRecording();
    setIsRecording(false);
  }, []);

  const parseTranscript = useCallback(
    async (text: string): Promise<VoiceParseResponse | null> => {
      if (!text.trim()) {
        setError('Transcript cannot be empty');
        return null;
      }

      setError(null);
      setIsParsingVoice(true);

      try {
        const result = await voiceService.parseTranscript(text);
        setParsedData(result);
        return result;
      } catch (err) {
        const message = err instanceof APIError ? err.message : 'Failed to parse voice';
        setError(message);
        return null;
      } finally {
        setIsParsingVoice(false);
      }
    },
    []
  );

  const createTaskFromVoice = useCallback(
    async (data: CreateTaskFromVoiceDTO): Promise<Task | null> => {
      setError(null);
      setIsParsingVoice(true);

      try {
        const task = await voiceService.createTaskFromVoice(data);
        return task;
      } catch (err) {
        const message = err instanceof APIError ? err.message : 'Failed to create task from voice';
        setError(message);
        return null;
      } finally {
        setIsParsingVoice(false);
      }
    },
    []
  );

  const resetVoiceState = useCallback(() => {
    setTranscript('');
    setParsedData(null);
    setError(null);
    setIsRecording(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isRecording,
    transcript,
    isParsingVoice,
    parsedData,
    error,
    startRecording,
    stopRecording,
    parseTranscript,
    createTaskFromVoice,
    resetVoiceState,
    clearError,
    isVoiceSupported,
  };
};
