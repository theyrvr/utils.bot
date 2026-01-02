import { Router, Request, Response } from 'express';
import prisma from '../../utils/database';
import logger from '../../utils/logger';
import { createWebhook } from '../../utils/webhook';

const router = Router();

// Get all webhooks for a guild
router.get('/:guildId', async (req: Request, res: Response) => {
  try {
    const { guildId } = req.params;

    const webhooks = await prisma.webhook.findMany({
      where: { guildId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(webhooks);
  } catch (error) {
    logger.error('Error fetching webhooks:', error);
    res.status(500).json({ error: 'Failed to fetch webhooks' });
  }
});

// Create webhook
router.post('/:guildId', async (req: Request, res: Response) => {
  try {
    const { guildId } = req.params;
    const { name, url, events, secret } = req.body;

    if (!name || !url || !events || !Array.isArray(events)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const webhook = await createWebhook(guildId, name, url, events, secret);

    res.json(webhook);
  } catch (error) {
    logger.error('Error creating webhook:', error);
    res.status(500).json({ error: 'Failed to create webhook' });
  }
});

// Update webhook
router.put('/:guildId/:webhookId', async (req: Request, res: Response) => {
  try {
    const { webhookId } = req.params;
    const data = req.body;

    const webhook = await prisma.webhook.update({
      where: { id: webhookId },
      data,
    });

    res.json(webhook);
  } catch (error) {
    logger.error('Error updating webhook:', error);
    res.status(500).json({ error: 'Failed to update webhook' });
  }
});

// Delete webhook
router.delete('/:guildId/:webhookId', async (req: Request, res: Response) => {
  try {
    const { webhookId } = req.params;

    await prisma.webhook.delete({
      where: { id: webhookId },
    });

    res.json({ success: true });
  } catch (error) {
    logger.error('Error deleting webhook:', error);
    res.status(500).json({ error: 'Failed to delete webhook' });
  }
});

export default router;
