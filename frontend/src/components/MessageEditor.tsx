'use client';

import { useState, useEffect } from 'react';
import { messagesAPI } from '@/lib/api';
import { Message } from '@/types';

interface MessageEditorProps {
  guildId: string;
}

const MESSAGE_KEYS = [
  { key: 'ticket_created', label: 'Ticket Created' },
  { key: 'ticket_closed', label: 'Ticket Closed' },
  { key: 'welcome_message', label: 'Welcome Message' },
];

export default function MessageEditor({ guildId }: MessageEditorProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedKey, setSelectedKey] = useState(MESSAGE_KEYS[0].key);
  const [editingMessage, setEditingMessage] = useState<Partial<Message>>({
    content: '',
    embedTitle: '',
    embedDesc: '',
    embedColor: '#5865f2',
    ephemeral: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadMessages();
  }, [guildId]);

  useEffect(() => {
    loadMessage(selectedKey);
  }, [selectedKey]);

  const loadMessages = async () => {
    try {
      const response = await messagesAPI.getAll(guildId);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessage = async (key: string) => {
    try {
      const response = await messagesAPI.getOne(guildId, key);
      setEditingMessage(response.data);
    } catch (error) {
      // Message doesn't exist yet, use defaults
      setEditingMessage({
        content: '',
        embedTitle: '',
        embedDesc: '',
        embedColor: '#5865f2',
        ephemeral: false,
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      await messagesAPI.upsert(guildId, selectedKey, editingMessage);
      setMessage('Message saved successfully!');
      await loadMessages();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save message:', error);
      setMessage('Failed to save message');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading messages...</div>;
  }

  return (
    <div className="card">
      <h2 className="card-header">Message Configuration</h2>

      {message && (
        <div className={message.includes('success') ? 'success' : 'error'}>
          {message}
        </div>
      )}

      <div className="form-group">
        <label className="label">Select Message Type</label>
        <select
          className="select"
          value={selectedKey}
          onChange={(e) => setSelectedKey(e.target.value)}
        >
          {MESSAGE_KEYS.map((msg) => (
            <option key={msg.key} value={msg.key}>
              {msg.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-2">
        <div>
          <div className="form-group">
            <label className="label">Content</label>
            <textarea
              className="textarea"
              value={editingMessage.content || ''}
              onChange={(e) =>
                setEditingMessage({ ...editingMessage, content: e.target.value })
              }
              placeholder="Message content"
            />
          </div>

          <div className="form-group">
            <label className="label">Embed Title</label>
            <input
              type="text"
              className="input"
              value={editingMessage.embedTitle || ''}
              onChange={(e) =>
                setEditingMessage({ ...editingMessage, embedTitle: e.target.value })
              }
              placeholder="Embed title (optional)"
            />
          </div>

          <div className="form-group">
            <label className="label">Embed Description</label>
            <textarea
              className="textarea"
              value={editingMessage.embedDesc || ''}
              onChange={(e) =>
                setEditingMessage({ ...editingMessage, embedDesc: e.target.value })
              }
              placeholder="Embed description (optional)"
            />
          </div>

          <div className="form-group">
            <label className="label">Embed Color</label>
            <input
              type="color"
              className="input"
              value={editingMessage.embedColor || '#5865f2'}
              onChange={(e) =>
                setEditingMessage({ ...editingMessage, embedColor: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label className="label">
              <input
                type="checkbox"
                checked={editingMessage.ephemeral || false}
                onChange={(e) =>
                  setEditingMessage({ ...editingMessage, ephemeral: e.target.checked })
                }
                style={{ marginRight: '8px' }}
              />
              Ephemeral (only visible to user)
            </label>
          </div>
        </div>

        <div>
          <div className="card" style={{ backgroundColor: 'var(--background-tertiary)' }}>
            <h3 style={{ marginBottom: '15px', color: 'var(--text-secondary)' }}>
              Preview
            </h3>
            {editingMessage.content && (
              <p style={{ marginBottom: '10px' }}>{editingMessage.content}</p>
            )}
            {(editingMessage.embedTitle || editingMessage.embedDesc) && (
              <div
                style={{
                  borderLeft: `4px solid ${editingMessage.embedColor}`,
                  paddingLeft: '15px',
                  marginTop: '10px',
                }}
              >
                {editingMessage.embedTitle && (
                  <h4 style={{ marginBottom: '8px' }}>{editingMessage.embedTitle}</h4>
                )}
                {editingMessage.embedDesc && (
                  <p style={{ color: 'var(--text-secondary)' }}>
                    {editingMessage.embedDesc}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="button button-primary"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save Message'}
      </button>
    </div>
  );
}
