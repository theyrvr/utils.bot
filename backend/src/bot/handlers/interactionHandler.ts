import { Interaction } from 'discord.js';
import logger from '../../utils/logger';

export async function handleInteraction(interaction: Interaction): Promise<void> {
  try {
    if (interaction.isCommand()) {
      // Handle slash commands here if needed
      logger.info(`Command received: ${interaction.commandName}`);
    } else if (interaction.isStringSelectMenu()) {
      // Handle select menus here if needed
      logger.info(`Select menu interaction: ${interaction.customId}`);
    }
  } catch (error) {
    logger.error('Error handling interaction:', error);
  }
}
