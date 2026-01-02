import { Router, Request, Response } from 'express';
import { getLogs } from '../../utils/logSystem';
import logger from '../../utils/logger';

const router = Router();

// Get logs for a guild
router.get('/:guildId', async (req: Request, res: Response) => {
  try {
    const { guildId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;

    const logs = await getLogs(guildId, limit);

    res.json(logs);
  } catch (error) {
    logger.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

export default router;
