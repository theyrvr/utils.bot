'use client';

import { useState, useEffect } from 'react';
import { ticketsAPI } from '@/lib/api';
import { Ticket } from '@/types';

export default function TicketsPage() {
  const guildId = process.env.NEXT_PUBLIC_GUILD_ID || 'YOUR_GUILD_ID';
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'OPEN' | 'CLOSED'>('all');

  useEffect(() => {
    loadTickets();
  }, [filter]);

  const loadTickets = async () => {
    try {
      const response = await ticketsAPI.getAll(
        guildId,
        filter === 'all' ? undefined : filter
      );
      setTickets(response.data);
    } catch (error) {
      console.error('Failed to load tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading tickets...</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '30px' }}>
        Tickets
      </h1>

      <div className="card">
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            className={`button ${filter === 'all' ? 'button-primary' : 'button-secondary'}`}
            onClick={() => setFilter('all')}
          >
            All Tickets
          </button>
          <button
            className={`button ${filter === 'OPEN' ? 'button-primary' : 'button-secondary'}`}
            onClick={() => setFilter('OPEN')}
          >
            Open
          </button>
          <button
            className={`button ${filter === 'CLOSED' ? 'button-primary' : 'button-secondary'}`}
            onClick={() => setFilter('CLOSED')}
          >
            Closed
          </button>
        </div>

        {tickets.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>
            No tickets found
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Channel ID</th>
                <th>User ID</th>
                <th>Category</th>
                <th>Status</th>
                <th>Created</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.channelId}</td>
                  <td>{ticket.userId}</td>
                  <td>{ticket.categoryName || '-'}</td>
                  <td>
                    <span className={`badge ${
                      ticket.status === 'OPEN' ? 'badge-success' : 
                      ticket.status === 'CLOSED' ? 'badge-danger' : 
                      'badge-warning'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                  <td>
                    {ticket.rating ? `${ticket.rating.stars}⭐` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
