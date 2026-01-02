'use client';

import { useState, useEffect } from 'react';
import { logsAPI } from '@/lib/api';
import { Log } from '@/types';

export default function LogsPage() {
  const guildId = process.env.NEXT_PUBLIC_GUILD_ID || 'YOUR_GUILD_ID';
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(100);

  useEffect(() => {
    loadLogs();
  }, [limit]);

  const loadLogs = async () => {
    try {
      const response = await logsAPI.getAll(guildId, limit);
      setLogs(response.data);
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading logs...</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '30px' }}>
        Logs
      </h1>

      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <label className="label">Number of logs to display</label>
          <select
            className="select"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
            style={{ maxWidth: '200px' }}
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={250}>250</option>
            <option value={500}>500</option>
          </select>
        </div>

        {logs.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>
            No logs found
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>User ID</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.createdAt).toLocaleString()}</td>
                  <td>
                    <span className="badge badge-info">{log.action}</span>
                  </td>
                  <td>{log.userId || '-'}</td>
                  <td style={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {log.details || '-'}
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
