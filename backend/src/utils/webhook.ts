import axios from 'axios';
import prisma from './database';
import logger from './logger';

export interface WebhookPayload {
  event: string;
  guildId: string;
  timestamp: Date;
  data: any;
}

export async function triggerWebhooks(
  guildId: string,
  event: string,
  data: any
): Promise<void> {
  try {
    const webhooks = await prisma.webhook.findMany({
      where: {
        guildId,
        enabled: true,
        events: {
          has: event,
        },
      },
    });

    const payload: WebhookPayload = {
      event,
      guildId,
      timestamp: new Date(),
      data,
    };

    const promises = webhooks.map(async (webhook) => {
      try {
        const headers: any = {
          'Content-Type': 'application/json',
        };
        
        if (webhook.secret) {
          headers['X-Webhook-Secret'] = webhook.secret;
        }

        await axios.post(webhook.url, payload, { headers, timeout: 5000 });
        logger.info(`Webhook triggered: ${webhook.name} for event ${event}`);
      } catch (error) {
        logger.error(`Failed to trigger webhook ${webhook.name}:`, error);
      }
    });

    await Promise.allSettled(promises);
  } catch (error) {
    logger.error('Failed to process webhooks:', error);
  }
}

export async function createWebhook(
  guildId: string,
  name: string,
  url: string,
  events: string[],
  secret?: string
) {
  return await prisma.webhook.create({
    data: {
      guildId,
      name,
      url,
      events,
      secret,
    },
  });
}
