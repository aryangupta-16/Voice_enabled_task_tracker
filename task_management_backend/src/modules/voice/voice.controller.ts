import { Request, Response } from 'express';
import * as service from './voice.service';
import { ApiError } from '../../middleware/errorHandler';
import { voiceParseValidationSchema, voiceCreateTaskValidationSchema } from './voice.validation';

export async function parseVoiceHandler(req: Request, res: Response) {
  const payload = voiceParseValidationSchema.safeParse(req.body);
  if (!payload.success) {
    throw new ApiError(400, 'Invalid request', payload.error.format());
  }

  const result = await service.parseTranscript(payload.data.transcript, payload.data.timezone);
  return res.json(result);
}

export async function createTaskFromVoiceHandler(req: Request, res: Response) {
  const payload = voiceCreateTaskValidationSchema.safeParse(req.body);
  if (!payload.success) {
    throw new ApiError(400, 'Invalid request', payload.error.format());
  }

  const dueDate = payload.data.parsedData.dueDate ? new Date(payload.data.parsedData.dueDate) : null;

  const result = await service.createTaskFromVoice({
    transcript: payload.data.transcript,
    parsedData: {
      title: payload.data.parsedData.title,
      description: payload.data.parsedData.description,
      priority: payload.data.parsedData.priority as any,
      dueDate,
      status: payload.data.parsedData.status as any,
    },
    timezone: payload.data.timezone,
  });

  return res.status(201).json(result.task);
}

export async function getParsingLogHandler(req: Request, res: Response) {
  const { logId } = req.params;
  const log = await service.getParsingLog(logId);
  if (!log) {
    throw new ApiError(404, 'Parsing log not found');
  }
  return res.json(log);
}
