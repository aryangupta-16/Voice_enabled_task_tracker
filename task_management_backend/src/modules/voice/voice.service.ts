import prisma from '../../config/database';
import { parseVoiceWithLLM } from '../../utils/voiceParser';
import { Priority, TaskStatus } from '@prisma/client';
import { VoiceParseResponse, ParsedTaskData } from '../../types/voice.types';

export async function parseTranscript(transcript: string, timezone?: string): Promise<VoiceParseResponse> {

  const parsingResult = await parseVoiceWithLLM(transcript);

  const parseLog = await prisma.voiceParsingLog.create({
    data: {
      rawTranscript: transcript,
      parsedData: parsingResult as any,
    },
  });

  return {
    rawTranscript: transcript,
    parsed: parsingResult,
    parsedLogId: parseLog.id,
  };
}

export async function createTaskFromVoice(data: {
  transcript: string;
  parsedData: ParsedTaskData;
  timezone?: string;
}) {
  const task = await prisma.task.create({
    data: {
      title: data.parsedData.title,
      description: data.parsedData.description ?? null,
      priority: data.parsedData.priority as Priority,
      dueDate: data.parsedData.dueDate ?? null,
      status: data.parsedData.status as TaskStatus,
      rawTranscript: data.transcript,
    },
  });

  const parseLog = await prisma.voiceParsingLog.create({
    data: {
      rawTranscript: data.transcript,
      parsedData: data.parsedData as any,
      confidence: 1.0,
    },
  });

  return { task, parseLog };
}

export async function getParsingLog(logId: string) {
  return prisma.voiceParsingLog.findUnique({ where: { id: logId }, include: { task: true } });
}

