import { ModalSubmitInteraction } from 'discord.js';
import logger from '../../utils/logger';

export async function handleModal(interaction: ModalSubmitInteraction): Promise<void> {
  try {
    logger.info(`Modal submitted: ${interaction.customId}`);
    
    // Handle modal submissions here if needed
    await interaction.reply({
      content: 'Modal submission received!',
      ephemeral: true,
    });
  } catch (error) {
    logger.error('Error handling modal:', error);
  }
}
