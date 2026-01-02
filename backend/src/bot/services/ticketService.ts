import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionFlagsBits,
  ChannelType,
  TextChannel,
  GuildMember,
} from 'discord.js';
import prisma from '../../utils/database';
import logger from '../../utils/logger';
import { logAction } from '../../utils/logSystem';
import { triggerWebhooks } from '../../utils/webhook';

export async function createTicket(
  guildId: string,
  userId: string,
  categoryName: string,
  member: GuildMember
): Promise<TextChannel | null> {
  try {
    const config = await prisma.guildConfig.findUnique({
      where: { guildId },
    });

    if (!config) {
      logger.error(`No config found for guild ${guildId}`);
      return null;
    }

    const guild = member.guild;
    const ticketNumber = await getNextTicketNumber(guildId);
    const channelName = `ticket-${ticketNumber}`;

    // Create ticket channel
    const channel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: config.ticketCategoryId || undefined,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: userId,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
          ],
        },
        {
          id: guild.members.me!.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ManageChannels,
          ],
        },
      ],
    });

    // Add support role if configured
    if (config.supportRoleId) {
      await channel.permissionOverwrites.create(config.supportRoleId, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true,
      });
    }

    // Create ticket in database
    const ticket = await prisma.ticket.create({
      data: {
        guildId,
        channelId: channel.id,
        userId,
        categoryName,
        status: 'OPEN',
      },
    });

    // Send welcome message
    const welcomeMessage = await getCustomMessage(guildId, 'ticket_created');
    const embed = new EmbedBuilder()
      .setTitle(welcomeMessage?.embedTitle || '🎫 Ticket Created')
      .setDescription(
        welcomeMessage?.embedDesc ||
          `Welcome ${member}! Support will be with you shortly.\n\nPlease describe your issue in detail.`
      )
      .setColor(welcomeMessage?.embedColor || '#5865f2')
      .setTimestamp();

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('close_ticket')
        .setLabel('Close Ticket')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('🔒')
    );

    if (config.enableQuickResponses) {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId('quick_response_helpful')
          .setLabel('Helpful')
          .setStyle(ButtonStyle.Success)
          .setEmoji('👍'),
        new ButtonBuilder()
          .setCustomId('quick_response_not_helpful')
          .setLabel('Not Helpful')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('👎')
      );
    }

    await channel.send({ embeds: [embed], components: [row] });

    // Log action
    await logAction(guildId, 'ticket_created', `Ticket ${channelName} created by ${member.user.tag}`, userId, ticket.id);

    // Trigger webhooks
    await triggerWebhooks(guildId, 'ticket_created', {
      ticketId: ticket.id,
      channelId: channel.id,
      userId,
      categoryName,
    });

    logger.info(`Ticket created: ${channelName} for user ${userId}`);
    return channel;
  } catch (error) {
    logger.error('Error creating ticket:', error);
    return null;
  }
}

export async function closeTicket(
  ticketId: string,
  closedBy: string,
  reason?: string
): Promise<boolean> {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { guild: true },
    });

    if (!ticket) {
      logger.error(`Ticket ${ticketId} not found`);
      return false;
    }

    await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status: 'CLOSED',
        closedAt: new Date(),
        closedBy,
      },
    });

    // Log action
    await logAction(
      ticket.guildId,
      'ticket_closed',
      reason || 'Ticket closed',
      closedBy,
      ticketId
    );

    // Trigger webhooks
    await triggerWebhooks(ticket.guildId, 'ticket_closed', {
      ticketId,
      closedBy,
      reason,
    });

    logger.info(`Ticket ${ticketId} closed by ${closedBy}`);
    return true;
  } catch (error) {
    logger.error('Error closing ticket:', error);
    return false;
  }
}

async function getNextTicketNumber(guildId: string): Promise<number> {
  const count = await prisma.ticket.count({
    where: { guildId },
  });
  return count + 1;
}

async function getCustomMessage(guildId: string, key: string) {
  return await prisma.message.findUnique({
    where: {
      guildId_key: {
        guildId,
        key,
      },
    },
  });
}

export async function sendQuickResponse(
  ticketId: string,
  userId: string,
  wasHelpful: boolean
): Promise<void> {
  try {
    await prisma.quickResponse.create({
      data: {
        ticketId,
        userId,
        wasHelpful,
      },
    });

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (ticket) {
      await logAction(
        ticket.guildId,
        'quick_response',
        `User ${userId} marked response as ${wasHelpful ? 'helpful' : 'not helpful'}`,
        userId,
        ticketId
      );
    }
  } catch (error) {
    logger.error('Error saving quick response:', error);
  }
}
