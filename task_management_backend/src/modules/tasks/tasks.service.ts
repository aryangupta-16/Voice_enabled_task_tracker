import prisma from '../../config/database';
import { Priority, TaskStatus } from '@prisma/client';

export async function createTask(data: {
  title: string;
  description?: string | null;
  priority?: Priority;
  dueDate?: Date | null;
  status?: TaskStatus;
  rawTranscript?: string | null;
}) {
  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      priority: data.priority ?? 'MEDIUM',
      dueDate: data.dueDate ?? null,
      status: data.status ?? 'TODO',
      rawTranscript: data.rawTranscript ?? null,
    },
  });
  return task;
}

export async function getAllTasks(filters?: { status?: string; priority?: string; search?: string }) {
  const where: any = {};
  if (filters?.status) where.status = filters.status;
  if (filters?.priority) where.priority = filters.priority;
  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const tasks = await prisma.task.findMany({ where, orderBy: { dueDate: 'asc' } });
  return tasks;
}

export async function getTaskById(id: string) {
  return prisma.task.findUnique({ where: { id } });
}

export async function updateTask(id: string, data: Partial<{ title: string; description: string; priority: Priority; dueDate: Date | null; status: TaskStatus; }>) {
  return prisma.task.update({ where: { id }, data });
}

export async function deleteTask(id: string) {
  await prisma.task.delete({ where: { id } });
}
