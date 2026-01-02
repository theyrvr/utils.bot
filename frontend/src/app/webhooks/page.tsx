'use client';

import WebhookManager from '@/components/WebhookManager';

export default function WebhooksPage() {
  const guildId = process.env.NEXT_PUBLIC_GUILD_ID || 'YOUR_GUILD_ID';

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '30px' }}>
        Webhook Manager
      </h1>
      <WebhookManager guildId={guildId} />
    </div>
  );
}
