'use client';

import ConfigForm from '@/components/ConfigForm';

export default function ConfigPage() {
  const guildId = process.env.NEXT_PUBLIC_GUILD_ID || 'YOUR_GUILD_ID';

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '30px' }}>
        Configuration
      </h1>
      <ConfigForm guildId={guildId} />
    </div>
  );
}
