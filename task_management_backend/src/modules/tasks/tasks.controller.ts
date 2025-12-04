import { Request, Response } from 'express';
import * as service from './tasks.service';
import { ApiError } from '../../middleware/errorHandler';

export async function createTaskHandler(req: Request, res: Response) {
  const { title, description, priority, dueDate, status, rawTranscript } = req.body;
  if (!title || typeof title !== 'string') throw new ApiError(400, 'Title is required');

  const due = dueDate ? new Date(dueDate) : null;
  const task = await service.createTask({ title, description, priority, dueDate: due, status, rawTranscript });
  return res.status(201).json(task);
}

export async function listTasksHandler(req: Request, res: Response) {
  const { status, priority, search } = req.query;
  const tasks = await service.getAllTasks({ status: status as string, priority: priority as string, search: search as string });
  return res.json({ data: tasks });
}

export async function getTaskHandler(req: Request, res: Response) {
  const { id } = req.params;
  const task = await service.getTaskById(id);
  if (!task) throw new ApiError(404, 'Task not found');
  return res.json(task);
}

export async function updateTaskHandler(req: Request, res: Response) {
  const { id } = req.params;
  const payload = req.body;
  const updated = await service.updateTask(id, payload);
  return res.json(updated);
}

export async function deleteTaskHandler(req: Request, res: Response) {
  const { id } = req.params;
  await service.deleteTask(id);
  return res.status(204).send();
}
