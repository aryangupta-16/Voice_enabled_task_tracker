import { Router } from 'express';
import {
  createTaskHandler,
  listTasksHandler,
  getTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
} from './tasks.controller';

const router = Router();

router.post('/', createTaskHandler);
router.get('/', listTasksHandler);
router.get('/:id', getTaskHandler);
router.patch('/:id', updateTaskHandler);
router.delete('/:id', deleteTaskHandler);

export default router;
