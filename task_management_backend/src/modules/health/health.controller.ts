import { Request, Response } from 'express';
import prisma from '../../config/database';

export async function getHealth(req: Request, res: Response) {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.json({ status: 'healthy', database: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    return res.status(500).json({ status: 'unhealthy', database: 'disconnected', timestamp: new Date().toISOString() });
  }
}
