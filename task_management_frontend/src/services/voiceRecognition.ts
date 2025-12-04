/**
 * Voice Recognition Service using Web Speech API
 * Handles recording, transcription, and real-time speech-to-text
 */

export class VoiceRecognitionService {
  private recognition: any = null;
  private isListening = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.setupRecognition();
      }
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
  }

  /**
   * Start recording voice
   */
  startRecording(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void
  ): void {
    if (!this.recognition) {
      onError('Speech Recognition API not supported in this browser');
      return;
    }

    if (this.isListening) return;

    this.isListening = true;
    let interimTranscript = '';

    this.recognition.onstart = () => {
      interimTranscript = '';
    };

    this.recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
    
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript + ' ';
        }
      }
    
      // Send both transcripts
      onResult(finalTranscript.trim() || interimTranscript.trim(), finalTranscript.length > 0);
    };
    
    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      switch(event.error) {
        case 'network':
          onError('Network error: Check your internet connection.');
          break;
        case 'not-allowed':
          onError('Microphone access denied.');
          break;
        default:
          onError(`Speech recognition error: ${event.error}`);
      }
      this.isListening = false;
    };
    

    this.recognition.onend = () => {
      this.isListening = false;
    };

    this.recognition.start();
  }

  /**
   * Stop recording voice
   */
  stopRecording(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Check if Speech Recognition API is supported
   */
  isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    );
  }

  /**
   * Check if currently listening
   */
  getIsListening(): boolean {
    return this.isListening;
  }
}

// Export singleton instance
export const voiceRecognitionService = new VoiceRecognitionService();
