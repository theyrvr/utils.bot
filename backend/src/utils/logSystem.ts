import prisma from './database';
import logger from './logger';

export async function logAction(
  guildId: string,
  action: string,
  details?: string,
  userId?: string,
  ticketId?: string
): Promise<void> {
  try {
    await prisma.log.create({
      data: {
        guildId,
        action,
        details,
        userId,
        ticketId,
      },
    });
    logger.info(`Action logged: ${action}`, { guildId, userId, ticketId });
  } catch (error) {
    logger.error('Failed to log action:', error);
  }
}

export async function getLogs(guildId: string, limit = 100) {
  return await prisma.log.findMany({
    where: { guildId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}
