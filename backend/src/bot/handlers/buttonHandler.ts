import { ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import prisma from '../../utils/database';
import logger from '../../utils/logger';
import { closeTicket, sendQuickResponse } from '../services/ticketService';
import { generateTranscript } from '../../utils/transcript';
import { logAction } from '../../utils/logSystem';

export async function handleButton(interaction: ButtonInteraction): Promise<void> {
  try {
    const customId = interaction.customId;

    // Handle ticket creation buttons
    if (customId.startsWith('create_ticket_')) {
      await handleCreateTicketButton(interaction);
      return;
    }

    // Handle close ticket button
    if (customId === 'close_ticket') {
      await handleCloseTicketButton(interaction);
      return;
    }

    // Handle quick response buttons
    if (customId.startsWith('quick_response_')) {
      await handleQuickResponseButton(interaction);
      return;
    }

    // Handle rating buttons
    if (customId.startsWith('rating_')) {
      await handleRatingButton(interaction);
      return;
    }
  } catch (error) {
    logger.error('Error handling button interaction:', error);
    
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: 'An error occurred while processing your request.',
        ephemeral: true,
      });
    }
  }
}

async function handleCreateTicketButton(interaction: ButtonInteraction): Promise<void> {
  if (!interaction.guild || !interaction.member) return;

  await interaction.deferReply({ ephemeral: true });

  const categoryName = interaction.customId.replace('create_ticket_', '');
  
  // Check if user already has an open ticket
  const existingTicket = await prisma.ticket.findFirst({
    where: {
      guildId: interaction.guild.id,
      userId: interaction.user.id,
      status: 'OPEN',
    },
  });

  if (existingTicket) {
    await interaction.editReply({
      content: `You already have an open ticket: <#${existingTicket.channelId}>`,
    });
    return;
  }

  const { createTicket } = await import('../services/ticketService');
  const channel = await createTicket(
    interaction.guild.id,
    interaction.user.id,
    categoryName,
    interaction.member as any
  );

  if (channel) {
    await interaction.editReply({
      content: `Ticket created: ${channel}`,
    });
  } else {
    await interaction.editReply({
      content: 'Failed to create ticket. Please contact an administrator.',
    });
  }
}

async function handleCloseTicketButton(interaction: ButtonInteraction): Promise<void> {
  if (!interaction.guild || !interaction.channel) return;

  await interaction.deferReply({ ephemeral: true });

  const ticket = await prisma.ticket.findUnique({
    where: { channelId: interaction.channel.id },
    include: { guild: true },
  });

  if (!ticket) {
    await interaction.editReply({
      content: 'This is not a valid ticket channel.',
    });
    return;
  }

  if (ticket.status !== 'OPEN') {
    await interaction.editReply({
      content: 'This ticket is already closed.',
    });
    return;
  }

  // Generate transcript if enabled
  if (ticket.guild.enableTranscripts) {
    try {
      const transcriptPath = await generateTranscript(
        interaction.channel as any,
        ticket.id
      );
      logger.info(`Transcript saved: ${transcriptPath}`);
    } catch (error) {
      logger.error('Failed to generate transcript:', error);
    }
  }

  // Close ticket
  await closeTicket(ticket.id, interaction.user.id);

  // Send rating request if enabled
  if (ticket.guild.enableRating) {
    await sendRatingRequest(interaction, ticket.id, ticket.userId);
  }

  await interaction.editReply({
    content: 'Ticket is being closed...',
  });

  // Delete channel after 5 seconds
  setTimeout(async () => {
    try {
      await interaction.channel?.delete();
    } catch (error) {
      logger.error('Failed to delete ticket channel:', error);
    }
  }, 5000);
}

async function handleQuickResponseButton(interaction: ButtonInteraction): Promise<void> {
  const wasHelpful = interaction.customId === 'quick_response_helpful';

  const ticket = await prisma.ticket.findUnique({
    where: { channelId: interaction.channel?.id },
  });

  if (!ticket) {
    await interaction.reply({
      content: 'This is not a valid ticket channel.',
      ephemeral: true,
    });
    return;
  }

  await sendQuickResponse(ticket.id, interaction.user.id, wasHelpful);

  await interaction.reply({
    content: `Thank you for your feedback! ✅`,
    ephemeral: true,
  });
}

async function handleRatingButton(interaction: ButtonInteraction): Promise<void> {
  const stars = parseInt(interaction.customId.replace('rating_', ''));
  const ticketId = interaction.message.embeds[0]?.footer?.text?.replace('Ticket ID: ', '');

  if (!ticketId) {
    await interaction.reply({
      content: 'Invalid rating request.',
      ephemeral: true,
    });
    return;
  }

  try {
    await prisma.rating.create({
      data: {
        ticketId,
        userId: interaction.user.id,
        stars,
      },
    });

    await interaction.reply({
      content: `Thank you for rating this ticket ${stars} star${stars > 1 ? 's' : ''}! ⭐`,
      ephemeral: true,
    });

    // Disable buttons
    await interaction.message.edit({ components: [] });
  } catch (error) {
    logger.error('Error saving rating:', error);
    await interaction.reply({
      content: 'Failed to save rating. You may have already rated this ticket.',
      ephemeral: true,
    });
  }
}

async function sendRatingRequest(
  interaction: ButtonInteraction,
  ticketId: string,
  userId: string
): Promise<void> {
  try {
    const user = await interaction.client.users.fetch(userId);
    
    const embed = new EmbedBuilder()
      .setTitle('Rate Your Support Experience')
      .setDescription('How would you rate the support you received?')
      .setColor('#FFD700')
      .setFooter({ text: `Ticket ID: ${ticketId}` })
      .setTimestamp();

    const row = new ActionRowBuilder<ButtonBuilder>();
    
    for (let i = 1; i <= 5; i++) {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`rating_${i}`)
          .setLabel(`${i} ⭐`)
          .setStyle(ButtonStyle.Secondary)
      );
    }

    await user.send({ embeds: [embed], components: [row] });
    logger.info(`Rating request sent to user ${userId} for ticket ${ticketId}`);
  } catch (error) {
    logger.error('Failed to send rating request:', error);
  }
}
