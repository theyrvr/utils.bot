import { Channel, Message, TextChannel } from 'discord.js';
import fs from 'fs/promises';
import path from 'path';
import logger from './logger';

export async function generateTranscript(
  channel: TextChannel,
  ticketId: string
): Promise<string> {
  try {
    const messages = await channel.messages.fetch({ limit: 100 });
    const sortedMessages = Array.from(messages.values()).reverse();

    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket Transcript - ${channel.name}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #36393f;
            color: #dcddde;
            padding: 20px;
            margin: 0;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background-color: #2f3136;
            border-radius: 8px;
            padding: 20px;
        }
        .header {
            border-bottom: 2px solid #202225;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            color: #fff;
            font-size: 24px;
        }
        .header p {
            margin: 5px 0 0 0;
            color: #b9bbbe;
            font-size: 14px;
        }
        .message {
            margin-bottom: 20px;
            display: flex;
            align-items: flex-start;
        }
        .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 15px;
            background-color: #5865f2;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }
        .message-content {
            flex: 1;
        }
        .message-header {
            display: flex;
            align-items: baseline;
            margin-bottom: 5px;
        }
        .author {
            font-weight: 600;
            color: #fff;
            margin-right: 10px;
        }
        .timestamp {
            font-size: 12px;
            color: #72767d;
        }
        .content {
            color: #dcddde;
            line-height: 1.5;
            word-wrap: break-word;
        }
        .attachment {
            margin-top: 10px;
            padding: 10px;
            background-color: #202225;
            border-radius: 4px;
            font-size: 14px;
        }
        .attachment a {
            color: #00aff4;
            text-decoration: none;
        }
        .attachment a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Ticket Transcript</h1>
            <p>Channel: #${channel.name} | Ticket ID: ${ticketId}</p>
            <p>Generated: ${new Date().toLocaleString()}</p>
        </div>
        <div class="messages">
`;

    for (const message of sortedMessages) {
      const authorInitial = message.author.username.charAt(0).toUpperCase();
      html += `
            <div class="message">
                <div class="avatar">${authorInitial}</div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="author">${message.author.username}</span>
                        <span class="timestamp">${message.createdAt.toLocaleString()}</span>
                    </div>
                    <div class="content">${escapeHtml(message.content || '[No content]')}</div>
`;
      
      if (message.attachments.size > 0) {
        for (const attachment of message.attachments.values()) {
          html += `
                    <div class="attachment">
                        📎 <a href="${attachment.url}" target="_blank">${attachment.name}</a>
                    </div>
`;
        }
      }
      
      html += `
                </div>
            </div>
`;
    }

    html += `
        </div>
    </div>
</body>
</html>
`;

    const filename = `transcript_${ticketId}_${Date.now()}.html`;
    const filepath = path.join(__dirname, '../../transcripts', filename);
    await fs.writeFile(filepath, html);

    logger.info(`Transcript generated: ${filename}`);
    return filepath;
  } catch (error) {
    logger.error('Failed to generate transcript:', error);
    throw error;
  }
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
