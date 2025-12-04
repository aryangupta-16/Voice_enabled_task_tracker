import { Router } from 'express';
import { parseVoiceHandler, createTaskFromVoiceHandler, getParsingLogHandler } from './voice.controller';

const router = Router();

router.post('/parse', parseVoiceHandler);
router.post('/create-task', createTaskFromVoiceHandler);
router.get('/logs/:logId', getParsingLogHandler);

export default router;
