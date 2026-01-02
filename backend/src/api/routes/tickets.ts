import { Router, Request, Response } from 'express';
import prisma from '../../utils/database';
import logger from '../../utils/logger';

const router = Router();

// Get all tickets for a guild
router.get('/:guildId', async (req: Request, res: Response) => {
  try {
    const { guildId } = req.params;
    const { status } = req.query;

    const where: any = { guildId };
    if (status) {
      where.status = status;
    }

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        responses: true,
        rating: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(tickets);
  } catch (error) {
    logger.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Get single ticket
router.get('/:guildId/:ticketId', async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        responses: true,
        rating: true,
        logs: true,
      },
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    logger.error('Error fetching ticket:', error);
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

// Get ticket statistics
router.get('/:guildId/stats', async (req: Request, res: Response) => {
  try {
    const { guildId } = req.params;

    const [total, open, closed, avgRating] = await Promise.all([
      prisma.ticket.count({ where: { guildId } }),
      prisma.ticket.count({ where: { guildId, status: 'OPEN' } }),
      prisma.ticket.count({ where: { guildId, status: 'CLOSED' } }),
      prisma.rating.aggregate({
        where: { ticket: { guildId } },
        _avg: { stars: true },
      }),
    ]);

    res.json({
      total,
      open,
      closed,
      averageRating: avgRating._avg.stars || 0,
    });
  } catch (error) {
    logger.error('Error fetching ticket stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;
