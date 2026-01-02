import dotenv from 'dotenv';
import { TicketBot } from './bot/client';
import { APIServer } from './api/server';
import logger from './utils/logger';
import prisma from './utils/database';

dotenv.config();

async function main() {
  try {
    logger.info('Starting Ticket Bot application...');

    // Test database connection
    await prisma.$connect();
    logger.info('Database connected successfully');

    // Start Discord bot
    const bot = new TicketBot();
    await bot.start();

    // Start API server
    const apiServer = new APIServer();
    apiServer.start();

    // Graceful shutdown
    process.on('SIGINT', async () => {
      logger.info('Received SIGINT, shutting down gracefully...');
      await bot.stop();
      await prisma.$disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      logger.info('Received SIGTERM, shutting down gracefully...');
      await bot.stop();
      await prisma.$disconnect();
      process.exit(0);
    });
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

main();
