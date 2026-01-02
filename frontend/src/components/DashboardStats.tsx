'use client';

import { useState, useEffect } from 'react';
import { ticketsAPI } from '@/lib/api';
import { TicketStats } from '@/types';

interface DashboardStatsProps {
  guildId: string;
}

export default function DashboardStats({ guildId }: DashboardStatsProps) {
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [guildId]);

  const loadStats = async () => {
    try {
      const response = await ticketsAPI.getStats(guildId);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading statistics...</div>;
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-4">
      <div className="stat-card">
        <div className="stat-value">{stats.total}</div>
        <div className="stat-label">Total Tickets</div>
      </div>

      <div className="stat-card">
        <div className="stat-value" style={{ color: 'var(--success-color)' }}>
          {stats.open}
        </div>
        <div className="stat-label">Open Tickets</div>
      </div>

      <div className="stat-card">
        <div className="stat-value" style={{ color: 'var(--text-secondary)' }}>
          {stats.closed}
        </div>
        <div className="stat-label">Closed Tickets</div>
      </div>

      <div className="stat-card">
        <div className="stat-value" style={{ color: 'var(--warning-color)' }}>
          {stats.averageRating.toFixed(1)}⭐
        </div>
        <div className="stat-label">Average Rating</div>
      </div>
    </div>
  );
}
