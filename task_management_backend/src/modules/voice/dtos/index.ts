export class VoiceParseDto {
  transcript!: string;
  timezone?: string;
}

export class VoiceParseResponseDto {
  rawTranscript!: string;
  parsed!: {
    title: string;
    description?: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    dueDate: Date | null;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  };
  confidence!: {
    overall: number;
    title: number;
    priority: number;
    dueDate: number;
  };
  parsedLogId!: string;
}

export class CreateTaskFromVoiceDto {
  transcript!: string;
  parsedData!: {
    title: string;
    description?: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    dueDate?: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  };
  timezone?: string;
}
