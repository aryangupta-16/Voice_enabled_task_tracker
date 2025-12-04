export interface VoiceParseRequest {
  transcript: string;
  timezone?: string;
}

export interface ParsedTaskData {
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dueDate?: Date | null;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

export interface VoiceParseResponse {
  rawTranscript: string;
  parsed: Object;
  parsedLogId: string;
}

export interface CreateTaskFromVoiceRequest {
  transcript: string;
  parsedData: ParsedTaskData;
  timezone?: string;
}
