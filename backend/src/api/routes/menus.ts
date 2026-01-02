import { Router, Request, Response } from 'express';
import prisma from '../../utils/database';
import logger from '../../utils/logger';

const router = Router();

// Get all menus for a guild
router.get('/:guildId', async (req: Request, res: Response) => {
  try {
    const { guildId } = req.params;

    const menus = await prisma.menu.findMany({
      where: { guildId },
      include: {
        buttons: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(menus);
  } catch (error) {
    logger.error('Error fetching menus:', error);
    res.status(500).json({ error: 'Failed to fetch menus' });
  }
});

// Create menu
router.post('/:guildId', async (req: Request, res: Response) => {
  try {
    const { guildId } = req.params;
    const { name, description, buttons } = req.body;

    const menu = await prisma.menu.create({
      data: {
        guildId,
        name,
        description,
        buttons: {
          create: buttons || [],
        },
      },
      include: {
        buttons: true,
      },
    });

    res.json(menu);
  } catch (error) {
    logger.error('Error creating menu:', error);
    res.status(500).json({ error: 'Failed to create menu' });
  }
});

// Update menu
router.put('/:guildId/:menuId', async (req: Request, res: Response) => {
  try {
    const { menuId } = req.params;
    const { name, description, enabled, buttons } = req.body;

    const menu = await prisma.menu.update({
      where: { id: menuId },
      data: {
        name,
        description,
        enabled,
      },
      include: {
        buttons: true,
      },
    });

    // Update buttons if provided
    if (buttons) {
      // Delete existing buttons
      await prisma.menuButton.deleteMany({
        where: { menuId },
      });

      // Create new buttons
      await prisma.menuButton.createMany({
        data: buttons.map((btn: any, index: number) => ({
          menuId,
          ...btn,
          order: index,
        })),
      });
    }

    res.json(menu);
  } catch (error) {
    logger.error('Error updating menu:', error);
    res.status(500).json({ error: 'Failed to update menu' });
  }
});

// Delete menu
router.delete('/:guildId/:menuId', async (req: Request, res: Response) => {
  try {
    const { menuId } = req.params;

    await prisma.menu.delete({
      where: { id: menuId },
    });

    res.json({ success: true });
  } catch (error) {
    logger.error('Error deleting menu:', error);
    res.status(500).json({ error: 'Failed to delete menu' });
  }
});

export default router;
