'use client';

import MessageEditor from '@/components/MessageEditor';

export default function MessagesPage() {
  const guildId = process.env.NEXT_PUBLIC_GUILD_ID || 'YOUR_GUILD_ID';

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '30px' }}>
        Message Configuration
      </h1>
      <MessageEditor guildId={guildId} />
    </div>
  );
}
