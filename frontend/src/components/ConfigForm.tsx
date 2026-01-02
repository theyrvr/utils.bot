'use client';

import { useState, useEffect } from 'react';
import { configAPI } from '@/lib/api';
import { GuildConfig } from '@/types';

interface ConfigFormProps {
  guildId: string;
}

export default function ConfigForm({ guildId }: ConfigFormProps) {
  const [config, setConfig] = useState<GuildConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadConfig();
  }, [guildId]);

  const loadConfig = async () => {
    try {
      const response = await configAPI.get(guildId);
      setConfig(response.data);
    } catch (error) {
      console.error('Failed to load config:', error);
      setMessage('Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    setSaving(true);
    setMessage('');

    try {
      await configAPI.update(guildId, config);
      setMessage('Configuration saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save config:', error);
      setMessage('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof GuildConfig, value: any) => {
    if (!config) return;
    setConfig({ ...config, [field]: value });
  };

  if (loading) {
    return <div className="loading">Loading configuration...</div>;
  }

  if (!config) {
    return <div className="error">Failed to load configuration</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2 className="card-header">Guild Configuration</h2>
      
      {message && (
        <div className={message.includes('success') ? 'success' : 'error'}>
          {message}
        </div>
      )}

      <div className="grid grid-2">
        <div className="form-group">
          <label className="label">Ticket Category ID</label>
          <input
            type="text"
            className="input"
            value={config.ticketCategoryId || ''}
            onChange={(e) => handleChange('ticketCategoryId', e.target.value)}
            placeholder="Enter category ID"
          />
        </div>

        <div className="form-group">
          <label className="label">Log Channel ID</label>
          <input
            type="text"
            className="input"
            value={config.logChannelId || ''}
            onChange={(e) => handleChange('logChannelId', e.target.value)}
            placeholder="Enter log channel ID"
          />
        </div>

        <div className="form-group">
          <label className="label">Transcript Channel ID</label>
          <input
            type="text"
            className="input"
            value={config.transcriptChannelId || ''}
            onChange={(e) => handleChange('transcriptChannelId', e.target.value)}
            placeholder="Enter transcript channel ID"
          />
        </div>

        <div className="form-group">
          <label className="label">Support Role ID</label>
          <input
            type="text"
            className="input"
            value={config.supportRoleId || ''}
            onChange={(e) => handleChange('supportRoleId', e.target.value)}
            placeholder="Enter support role ID"
          />
        </div>
      </div>

      <div className="grid grid-3">
        <div className="form-group">
          <label className="label">
            <input
              type="checkbox"
              checked={config.enableQuickResponses}
              onChange={(e) => handleChange('enableQuickResponses', e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Enable Quick Responses
          </label>
        </div>

        <div className="form-group">
          <label className="label">
            <input
              type="checkbox"
              checked={config.enableRating}
              onChange={(e) => handleChange('enableRating', e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Enable Rating System
          </label>
        </div>

        <div className="form-group">
          <label className="label">
            <input
              type="checkbox"
              checked={config.enableTranscripts}
              onChange={(e) => handleChange('enableTranscripts', e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Enable Transcripts
          </label>
        </div>
      </div>

      <button type="submit" className="button button-primary" disabled={saving}>
        {saving ? 'Saving...' : 'Save Configuration'}
      </button>
    </form>
  );
}
