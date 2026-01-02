'use client';

import MenuManager from '@/components/MenuManager';

export default function MenusPage() {
  const guildId = process.env.NEXT_PUBLIC_GUILD_ID || 'YOUR_GUILD_ID';

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '30px' }}>
        Menu Manager
      </h1>
      <MenuManager guildId={guildId} />
    </div>
  );
}
