import { Router, Request, Response } from 'express';
import prisma from '../../utils/database';
import logger from '../../utils/logger';

const router = Router();

// Get guild config
router.get('/:guildId', async (req: Request, res: Response) => {
  try {
    const { guildId } = req.params;
    
    let config = await prisma.guildConfig.findUnique({
      where: { guildId },
    });

    if (!config) {
      // Create default config if not exists
      config = await prisma.guildConfig.create({
        data: { guildId },
      });
    }

    res.json(config);
  } catch (error) {
    logger.error('Error fetching guild config:', error);
    res.status(500).json({ error: 'Failed to fetch configuration' });
  }
});

// Update guild config
router.put('/:guildId', async (req: Request, res: Response) => {
  try {
    const { guildId } = req.params;
    const data = req.body;

    const config = await prisma.guildConfig.upsert({
      where: { guildId },
      update: data,
      create: { guildId, ...data },
    });

    res.json(config);
  } catch (error) {
    logger.error('Error updating guild config:', error);
    res.status(500).json({ error: 'Failed to update configuration' });
  }
});

export default router;
