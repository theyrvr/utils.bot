import { Router, Request, Response } from 'express';
import prisma from '../../utils/database';
import logger from '../../utils/logger';

const router = Router();

// Get all messages for a guild
router.get('/:guildId', async (req: Request, res: Response) => {
  try {
    const { guildId } = req.params;

    const messages = await prisma.message.findMany({
      where: { guildId },
      orderBy: { key: 'asc' },
    });

    res.json(messages);
  } catch (error) {
    logger.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get specific message
router.get('/:guildId/:key', async (req: Request, res: Response) => {
  try {
    const { guildId, key } = req.params;

    const message = await prisma.message.findUnique({
      where: {
        guildId_key: {
          guildId,
          key,
        },
      },
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    logger.error('Error fetching message:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});

// Create or update message
router.put('/:guildId/:key', async (req: Request, res: Response) => {
  try {
    const { guildId, key } = req.params;
    const data = req.body;

    const message = await prisma.message.upsert({
      where: {
        guildId_key: {
          guildId,
          key,
        },
      },
      update: data,
      create: {
        guildId,
        key,
        ...data,
      },
    });

    res.json(message);
  } catch (error) {
    logger.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// Delete message
router.delete('/:guildId/:key', async (req: Request, res: Response) => {
  try {
    const { guildId, key } = req.params;

    await prisma.message.delete({
      where: {
        guildId_key: {
          guildId,
          key,
        },
      },
    });

    res.json({ success: true });
  } catch (error) {
    logger.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

export default router;
