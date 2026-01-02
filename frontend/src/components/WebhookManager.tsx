'use client';

import { useState, useEffect } from 'react';
import { webhooksAPI } from '@/lib/api';
import { Webhook } from '@/types';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

interface WebhookManagerProps {
  guildId: string;
}

const AVAILABLE_EVENTS = [
  'ticket_created',
  'ticket_closed',
  'ticket_updated',
  'quick_response',
  'rating_submitted',
];

export default function WebhookManager({ guildId }: WebhookManagerProps) {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingWebhook, setEditingWebhook] = useState<Partial<Webhook> | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadWebhooks();
  }, [guildId]);

  const loadWebhooks = async () => {
    try {
      const response = await webhooksAPI.getAll(guildId);
      setWebhooks(response.data);
    } catch (error) {
      console.error('Failed to load webhooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWebhook = () => {
    setEditingWebhook({
      name: '',
      url: '',
      events: [],
      enabled: true,
    });
  };

  const handleSaveWebhook = async () => {
    if (!editingWebhook || !editingWebhook.name || !editingWebhook.url) {
      setMessage('Please fill in all required fields');
      return;
    }

    try {
      if (editingWebhook.id) {
        await webhooksAPI.update(guildId, editingWebhook.id, editingWebhook);
      } else {
        await webhooksAPI.create(guildId, editingWebhook);
      }
      setMessage('Webhook saved successfully!');
      setEditingWebhook(null);
      await loadWebhooks();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save webhook:', error);
      setMessage('Failed to save webhook');
    }
  };

  const handleDeleteWebhook = async (webhookId: string) => {
    if (!confirm('Are you sure you want to delete this webhook?')) return;

    try {
      await webhooksAPI.delete(guildId, webhookId);
      setMessage('Webhook deleted successfully!');
      await loadWebhooks();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to delete webhook:', error);
      setMessage('Failed to delete webhook');
    }
  };

  const toggleEvent = (event: string) => {
    if (!editingWebhook) return;
    const events = editingWebhook.events || [];
    if (events.includes(event)) {
      setEditingWebhook({
        ...editingWebhook,
        events: events.filter((e) => e !== event),
      });
    } else {
      setEditingWebhook({
        ...editingWebhook,
        events: [...events, event],
      });
    }
  };

  if (loading) {
    return <div className="loading">Loading webhooks...</div>;
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="card-header" style={{ margin: 0 }}>Webhook Manager</h2>
        <button className="button button-primary" onClick={handleCreateWebhook}>
          <FaPlus /> Create Webhook
        </button>
      </div>

      {message && (
        <div className={message.includes('success') ? 'success' : 'error'}>
          {message}
        </div>
      )}

      {editingWebhook && (
        <div className="card" style={{ backgroundColor: 'var(--background-tertiary)', marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>
            {editingWebhook.id ? 'Edit Webhook' : 'Create Webhook'}
          </h3>

          <div className="form-group">
            <label className="label">Webhook Name *</label>
            <input
              type="text"
              className="input"
              value={editingWebhook.name || ''}
              onChange={(e) => setEditingWebhook({ ...editingWebhook, name: e.target.value })}
              placeholder="Enter webhook name"
            />
          </div>

          <div className="form-group">
            <label className="label">Webhook URL *</label>
            <input
              type="url"
              className="input"
              value={editingWebhook.url || ''}
              onChange={(e) => setEditingWebhook({ ...editingWebhook, url: e.target.value })}
              placeholder="https://example.com/webhook"
            />
          </div>

          <div className="form-group">
            <label className="label">Secret (Optional)</label>
            <input
              type="text"
              className="input"
              value={editingWebhook.secret || ''}
              onChange={(e) => setEditingWebhook({ ...editingWebhook, secret: e.target.value })}
              placeholder="Enter secret for webhook authentication"
            />
          </div>

          <div className="form-group">
            <label className="label">Events</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
              {AVAILABLE_EVENTS.map((event) => (
                <label key={event} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={editingWebhook.events?.includes(event) || false}
                    onChange={() => toggleEvent(event)}
                    style={{ marginRight: '8px' }}
                  />
                  <span className="badge badge-info">{event}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="label">
              <input
                type="checkbox"
                checked={editingWebhook.enabled ?? true}
                onChange={(e) => setEditingWebhook({ ...editingWebhook, enabled: e.target.checked })}
                style={{ marginRight: '8px' }}
              />
              Enabled
            </label>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="button button-primary" onClick={handleSaveWebhook}>
              Save Webhook
            </button>
            <button className="button button-secondary" onClick={() => setEditingWebhook(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-2">
        {webhooks.map((webhook) => (
          <div key={webhook.id} className="card" style={{ backgroundColor: 'var(--background-tertiary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
              <div>
                <h3 style={{ marginBottom: '5px' }}>{webhook.name}</h3>
                <span className={`badge ${webhook.enabled ? 'badge-success' : 'badge-danger'}`}>
                  {webhook.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="button button-secondary"
                  onClick={() => setEditingWebhook(webhook)}
                  style={{ padding: '8px' }}
                >
                  <FaEdit />
                </button>
                <button
                  className="button button-danger"
                  onClick={() => handleDeleteWebhook(webhook.id)}
                  style={{ padding: '8px' }}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '10px', wordBreak: 'break-all' }}>
              {webhook.url}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {webhook.events.map((event) => (
                <span key={event} className="badge badge-info">
                  {event}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
