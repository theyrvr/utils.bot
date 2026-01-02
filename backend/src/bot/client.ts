import {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  ClientEvents,
} from 'discord.js';
import dotenv from 'dotenv';
import logger from '../utils/logger';
import { handleInteraction } from './handlers/interactionHandler';
import { handleButton } from './handlers/buttonHandler';
import { handleModal } from './handlers/modalHandler';
import prisma from '../utils/database';

dotenv.config();

export class TicketBot {
  public client: Client;
  private ready = false;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
      ],
      partials: [Partials.Channel, Partials.Message],
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.once('ready', async () => {
      if (!this.client.user) return;
      
      logger.info(`Bot logged in as ${this.client.user.tag}`);
      logger.info(`Serving ${this.client.guilds.cache.size} guilds`);
      
      this.ready = true;
    });

    this.client.on('interactionCreate', async (interaction) => {
      try {
        if (interaction.isButton()) {
          await handleButton(interaction);
        } else if (interaction.isModalSubmit()) {
          await handleModal(interaction);
        } else if (interaction.isCommand() || interaction.isStringSelectMenu()) {
          await handleInteraction(interaction);
        }
      } catch (error) {
        logger.error('Error handling interaction:', error);
      }
    });

    this.client.on('error', (error) => {
      logger.error('Discord client error:', error);
    });
  }

  public async start(): Promise<void> {
    const token = process.env.DISCORD_TOKEN;
    
    if (!token) {
      throw new Error('DISCORD_TOKEN is not defined in environment variables');
    }

    try {
      await this.client.login(token);
      logger.info('Bot successfully connected to Discord');
    } catch (error) {
      logger.error('Failed to start bot:', error);
      throw error;
    }
  }

  public async stop(): Promise<void> {
    logger.info('Shutting down bot...');
    await prisma.$disconnect();
    this.client.destroy();
    this.ready = false;
  }

  public isReady(): boolean {
    return this.ready;
  }
}
