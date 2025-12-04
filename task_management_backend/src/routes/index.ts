import { Router } from 'express';
import healthRouter from '../modules/health/health.route';
import tasksRouter from '../modules/tasks/tasks.route';
import voiceRouter from '../modules/voice/voice.route';

const router = Router();

router.use('/health', healthRouter);
router.use('/tasks', tasksRouter);
router.use('/voice', voiceRouter);

export default router;
