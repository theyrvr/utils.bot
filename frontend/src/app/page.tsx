'use client';

import DashboardStats from '@/components/DashboardStats';

export default function HomePage() {
  const guildId = process.env.NEXT_PUBLIC_GUILD_ID || 'YOUR_GUILD_ID';

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '30px' }}>
        Dashboard
      </h1>

      <DashboardStats guildId={guildId} />

      <div className="card">
        <h2 className="card-header">Welcome to Ticket Bot Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>
          This is a complete Discord ticket bot management system with the following features:
        </p>
        <ul style={{ color: 'var(--text-secondary)', paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>✅ Fully configurable ticket system</li>
          <li>✅ Custom menus with button support</li>
          <li>✅ Ephemeral messages configuration</li>
          <li>✅ Quick response system (helpful/not helpful)</li>
          <li>✅ 5-star rating system via DM</li>
          <li>✅ Webhook integration for external systems</li>
          <li>✅ Comprehensive logging system</li>
          <li>✅ Automatic transcript generation</li>
          <li>✅ Message preview in real-time</li>
          <li>✅ Production and development ready</li>
        </ul>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3 className="card-header">Quick Start</h3>
          <ol style={{ color: 'var(--text-secondary)', paddingLeft: '20px', lineHeight: '1.8' }}>
            <li>Configure your bot in the Configuration page</li>
            <li>Set up custom messages in the Messages page</li>
            <li>Create ticket menus in the Menus page</li>
            <li>Configure webhooks for integrations</li>
            <li>Monitor tickets and logs</li>
          </ol>
        </div>

        <div className="card">
          <h3 className="card-header">Backend Setup</h3>
          <ol style={{ color: 'var(--text-secondary)', paddingLeft: '20px', lineHeight: '1.8' }}>
            <li>Set up PostgreSQL database</li>
            <li>Configure environment variables</li>
            <li>Run database migrations</li>
            <li>Start the backend server</li>
            <li>Start the Discord bot</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
